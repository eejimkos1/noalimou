const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { build } = require('./lib/build');

const app = express();
const PORT = 3000;

// Security
app.disable('x-powered-by');
const helmet = require('helmet');
app.use(helmet({ contentSecurityPolicy: false }));

// Config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'admin', 'views'));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Session setup — secret generated randomly on first run
const SESSION_SECRET_PATH = path.join(__dirname, 'data', '.session-secret');
function getSessionSecret() {
  if (fs.existsSync(SESSION_SECRET_PATH)) {
    return fs.readFileSync(SESSION_SECRET_PATH, 'utf8').trim();
  }
  const secret = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(SESSION_SECRET_PATH, secret, 'utf8');
  return secret;
}

app.use(session({
  secret: getSessionSecret(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
  }
}));

// Credentials
const CREDS_PATH = path.join(__dirname, 'data', 'credentials.json');
function getCredentials() {
  return JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
}

// Auth middleware — protects all /admin routes except login
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.redirect('/admin/login');
}

// Rate limiting for login (simple in-memory)
const loginAttempts = {};
function checkRateLimit(ip) {
  const now = Date.now();
  if (!loginAttempts[ip]) loginAttempts[ip] = [];
  // Remove attempts older than 15 minutes
  loginAttempts[ip] = loginAttempts[ip].filter(t => now - t < 15 * 60 * 1000);
  return loginAttempts[ip].length < 10; // Max 10 attempts per 15 min
}
function recordAttempt(ip) {
  if (!loginAttempts[ip]) loginAttempts[ip] = [];
  loginAttempts[ip].push(Date.now());
}

// Multer for image uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E6) + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExt = /\.(jpg|jpeg|png|gif|webp)$/i;
    const allowedMime = /^image\/(jpeg|png|gif|webp)$/;
    if (allowedExt.test(path.extname(file.originalname)) && allowedMime.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Μόνο εικόνες (jpg, png, gif, webp)'));
    }
  }
});

// Helpers
const DATA_PATH = path.join(__dirname, 'data', 'site.json');
const BACKUP_PATH = path.join(__dirname, 'data', 'site.backup.json');

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function backupData() {
  if (fs.existsSync(DATA_PATH)) {
    fs.copyFileSync(DATA_PATH, BACKUP_PATH);
  }
}

// Section definitions for the dashboard
const SECTIONS = [
  { key: 'hero', icon: '🎬', label: 'Hero / Αρχική' },
  { key: 'about', icon: '📋', label: 'Ο Όμιλος' },
  { key: 'sports', icon: '⛵', label: 'Αθλήματα' },
  { key: 'academy', icon: '🎓', label: 'Ακαδημίες' },
  { key: 'camp', icon: '☀️', label: 'Summer Camp' },
  { key: 'events', icon: '🏁', label: 'Εκδηλώσεις' },
  { key: 'news', icon: '📰', label: 'Νέα' },
  { key: 'gallery', icon: '📷', label: 'Γκαλερί & Social' },
  { key: 'membership', icon: '🤝', label: 'Εγγραφές' },
  { key: 'weather', icon: '🌤️', label: 'Καιρός & Υποστηρικτές' },
  { key: 'footer', icon: '📍', label: 'Footer & Επικοινωνία' },
  { key: 'meta', icon: '🔍', label: 'SEO & Meta' }
];

// Render helper: renders content template, wraps in layout
const ejs = require('ejs');
function renderPage(res, template, locals) {
  const viewsDir = path.join(__dirname, 'admin', 'views');
  const contentPath = path.join(viewsDir, template + '.ejs');
  const layoutPath = path.join(viewsDir, 'layout.ejs');

  // Render inner content
  const contentHtml = ejs.render(
    fs.readFileSync(contentPath, 'utf8'),
    locals,
    { filename: contentPath }
  );

  // Render layout with content
  const fullHtml = ejs.render(
    fs.readFileSync(layoutPath, 'utf8'),
    { ...locals, body: contentHtml },
    { filename: layoutPath }
  );

  res.send(fullHtml);
}

// ============ ROUTES ============

// Root redirect
app.get('/', (req, res) => res.redirect('/admin'));

// Login page
app.get('/admin/login', (req, res) => {
  if (req.session && req.session.authenticated) return res.redirect('/admin');
  res.render('login', { error: null });
});

// Login POST
app.post('/admin/login', (req, res) => {
  const ip = req.ip;
  if (!checkRateLimit(ip)) {
    return res.render('login', { error: 'Πολλές αποτυχημένες προσπάθειες. Δοκιμάστε ξανά σε 15 λεπτά.' });
  }

  const { username, password } = req.body;
  const creds = getCredentials();

  if (username === creds.username && bcrypt.compareSync(password, creds.passwordHash)) {
    req.session.regenerate((err) => {
      if (err) return res.status(500).send('Session error');
      req.session.authenticated = true;
      req.session.username = username;
      return res.redirect('/admin');
    });
    return;
  }

  recordAttempt(ip);
  res.render('login', { error: 'Λάθος όνομα χρήστη ή κωδικός.' });
});

// Logout
app.get('/admin/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// Protect all /admin routes below this point
app.use('/admin', requireAuth);

// Dashboard
app.get('/admin', (req, res) => {
  const data = readData();
  const lastBuild = fs.existsSync(path.join(__dirname, 'index.html'))
    ? fs.statSync(path.join(__dirname, 'index.html')).mtime.toLocaleString('el-GR')
    : null;
  renderPage(res, 'dashboard', { data, sections: SECTIONS, lastBuild, saved: req.query.saved, published: req.query.published });
});

// Image upload (BEFORE :section wildcard)
app.post('/admin/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Δεν επιλέχθηκε αρχείο' });
  res.json({ url: '/uploads/' + req.file.filename });
});

// Build / Publish (BEFORE :section wildcard)
app.post('/admin/build', (req, res) => {
  try {
    const result = build();
    try {
      execFileSync('git', ['add', 'index.html', 'data/site.json'], { cwd: __dirname });
      execFileSync('git', ['commit', '-m', 'Update site content'], { cwd: __dirname });
      execFileSync('git', ['push', 'origin', 'main'], { cwd: __dirname, timeout: 30000 });
      result.pushed = true;
    } catch (gitErr) {
      console.error('Git push error:', gitErr.message);
      result.pushed = false;
      result.gitError = gitErr.message;
    }
    res.json(result);
  } catch (e) {
    console.error('Build error:', e);
    res.status(500).json({ error: 'Build failed' });
  }
});

// Preview (BEFORE :section wildcard)
app.get('/admin/preview', (req, res) => {
  try {
    build();
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (e) {
    console.error('Preview build error:', e);
    res.status(500).send('Build failed');
  }
});

// Download (BEFORE :section wildcard)
app.get('/admin/download', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  if (!fs.existsSync(filePath)) {
    build();
  }
  res.download(filePath, 'index.html');
});

// Restore backup (BEFORE :section wildcard)
app.post('/admin/restore', (req, res) => {
  if (fs.existsSync(BACKUP_PATH)) {
    fs.copyFileSync(BACKUP_PATH, DATA_PATH);
  }
  res.redirect('/admin?saved=1');
});

// Change password (BEFORE :section wildcard)
app.post('/admin/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const creds = getCredentials();
  if (!bcrypt.compareSync(currentPassword, creds.passwordHash)) {
    return res.status(400).json({ error: 'Λάθος τρέχων κωδικός' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Ο νέος κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες' });
  }
  creds.passwordHash = bcrypt.hashSync(newPassword, 10);
  fs.writeFileSync(CREDS_PATH, JSON.stringify(creds, null, 2), 'utf8');
  res.json({ ok: true });
});

// Section editor — GET
app.get('/admin/:section', (req, res) => {
  const section = req.params.section;
  const validSections = SECTIONS.map(s => s.key);
  if (!validSections.includes(section)) return res.redirect('/admin');
  const data = readData();
  const sectionMeta = SECTIONS.find(s => s.key === section);
  renderPage(res, 'sections/' + section, { data, section: data[section], sectionMeta, sections: SECTIONS, saved: req.query.saved });
});

// Section editor — POST (save)
app.post('/admin/:section', (req, res) => {
  const section = req.params.section;
  backupData();
  const data = readData();

  // Parse form data based on section type
  const parsed = parseSection(section, req.body);
  if (parsed._multi) {
    // Weather section saves to multiple keys
    Object.keys(parsed).forEach(function(key) {
      if (key !== '_multi') data[key] = parsed[key];
    });
  } else {
    data[section] = parsed;
  }
  writeData(data);

  res.redirect('/admin/' + section + '?saved=1');
});

// ============ SECTION PARSERS ============

function parseSection(section, body) {
  // For JSON-submitted data (from admin.js)
  if (body._json) {
    let parsed;
    try {
      parsed = JSON.parse(body._json);
    } catch (e) {
      console.error('Invalid JSON in form submission:', e.message);
      return body;
    }

    // Weather section saves to both weather + sponsors
    if (section === 'weather') {
      return {
        _multi: true,
        weather: {
          title: parsed.title,
          location: parsed.location,
          lat: parseFloat(parsed.lat) || 37.91,
          lng: parseFloat(parsed.lng) || 23.71,
          defaults: parsed.defaults || {}
        },
        sponsors: {
          title: parsed.sponsorsTitle || '',
          items: parsed.items || []
        }
      };
    }

    // Membership: convert featuresText (newline-separated) to features array
    if (section === 'membership' && parsed.tiers) {
      parsed.tiers = parsed.tiers.map(function(tier) {
        if (tier.featuresText) {
          tier.features = tier.featuresText.split('\n').map(f => f.trim()).filter(Boolean);
          delete tier.featuresText;
        }
        // Convert featured string to boolean
        tier.featured = tier.featured === 'true' || tier.featured === true;
        return tier;
      });
    }

    // Gallery: convert wide/tall strings to booleans
    if (section === 'gallery' && parsed.images) {
      parsed.images = parsed.images.map(function(img) {
        img.wide = img.wide === 'true' || img.wide === true;
        img.tall = img.tall === 'true' || img.tall === true;
        return img;
      });
    }

    return parsed;
  }
  // Otherwise return body as-is (simple forms)
  return body;
}

// ============ START ============

app.listen(PORT, () => {
  console.log(`\n  NOA CMS — Πίνακας Διαχείρισης`);
  console.log(`  http://localhost:${PORT}/admin\n`);
});
