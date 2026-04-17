const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// Sanitization helpers
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeForBr(str) {
  if (!str) return '';
  return escapeHtml(str).replace(/&lt;br\s*\/?&gt;/gi, '<br>');
}

function sanitizeData(data) {
  // Titles that allow <br> only
  var brSections = ['about', 'sports', 'academy', 'camp', 'events', 'news', 'gallery', 'membership'];
  brSections.forEach(function(key) {
    if (data[key] && data[key].title) {
      data[key].title = sanitizeForBr(data[key].title);
    }
  });

  // Icon fields (emoji only, no HTML)
  if (data.camp) data.camp.icon = escapeHtml(data.camp.icon);
  if (data.camp && data.camp.features) {
    data.camp.features.forEach(function(f) { f.icon = escapeHtml(f.icon); });
  }
  if (data.about && data.about.values) {
    data.about.values.forEach(function(v) { v.icon = escapeHtml(v.icon); });
  }
  if (data.sports && data.sports.cards) {
    data.sports.cards.forEach(function(c) { c.icon = escapeHtml(c.icon); });
  }
  if (data.membership && data.membership.tiers) {
    data.membership.tiers.forEach(function(t) { t.icon = escapeHtml(t.icon); });
  }

  // Footer text fields
  if (data.footer) {
    data.footer.copyrightText = escapeHtml(data.footer.copyrightText);
    data.footer.registryText = escapeHtml(data.footer.registryText);
    // Address: escape then convert newlines to <br>
    if (data.footer.contact && data.footer.contact.address) {
      data.footer.contact.addressHtml = escapeHtml(data.footer.contact.address).replace(/\n/g, '<br>');
    }
  }

  return data;
}

function build() {
  const dataPath = path.join(__dirname, '..', 'data', 'site.json');
  const templatePath = path.join(__dirname, '..', 'templates', 'site.ejs');
  const distDir = path.join(__dirname, '..', 'dist');
  const outputPath = path.join(distDir, 'index.html');

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const template = fs.readFileSync(templatePath, 'utf8');

  // Sanitize user-controlled content before rendering
  sanitizeData(data);

  const html = ejs.render(template, data, { filename: templatePath });

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, html, 'utf8');

  const timestamp = new Date().toLocaleString('el-GR');
  console.log(`  Build OK → dist/index.html (${timestamp})`);
  return { success: true, timestamp };
}

// Allow running directly: node lib/build.js
if (require.main === module) {
  build();
}

module.exports = { build };
