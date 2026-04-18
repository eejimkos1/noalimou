/**
 * build-template.js
 * Client-side build: converts site.json data into the complete HTML page.
 * JS equivalent of templates/site.ejs — split into section builders.
 */

function buildSiteHtml(data) {
  var meta = data.meta;
  var header = data.header;
  var hero = data.hero;
  var about = data.about;
  var sports = data.sports;
  var academy = data.academy;
  var camp = data.camp;
  var events = data.events;
  var news = data.news;
  var gallery = data.gallery;
  var membership = data.membership;
  var weather = data.weather;
  var sponsors = data.sponsors;
  var footer = data.footer;
  var floatingCta = data.floatingCta;

  function h(val) {
    if (val === null || val === undefined) return '';
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  var out = '';

  // ========== HEAD ==========
  out += '<!DOCTYPE html>\n';
  out += '<html lang="el">\n';
  out += '<head>\n';
  out += '  <meta charset="UTF-8">\n';
  out += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
  out += '  <title>' + h(meta.title) + '</title>\n';
  out += '  <meta name="description" content="' + h(meta.description) + '">\n';
  out += '  <meta name="keywords" content="' + h(meta.keywords) + '">\n';
  out += '  <meta name="author" content="' + h(meta.author) + '">\n';
  out += '  <meta name="robots" content="index, follow">\n';
  out += '  <link rel="canonical" href="' + h(meta.canonicalUrl) + '">\n';
  out += '\n';
  out += '  <!-- Open Graph -->\n';
  out += '  <meta property="og:title" content="' + h(meta.title) + '">\n';
  out += '  <meta property="og:description" content="' + h(meta.ogDescription) + '">\n';
  out += '  <meta property="og:type" content="website">\n';
  out += '  <meta property="og:url" content="' + h(meta.canonicalUrl) + '">\n';
  out += '  <meta property="og:image" content="' + h(meta.ogImage) + '">\n';
  out += '  <meta property="og:locale" content="el_GR">\n';
  out += '  <meta property="og:site_name" content="' + h(meta.author) + '">\n';
  out += '\n';
  out += '  <!-- Twitter Card -->\n';
  out += '  <meta name="twitter:card" content="summary_large_image">\n';
  out += '  <meta name="twitter:title" content="' + h(meta.title) + '">\n';
  out += '  <meta name="twitter:description" content="' + h(meta.twitterDescription) + '">\n';
  out += '  <meta name="twitter:image" content="' + h(meta.ogImage) + '">\n';
  out += '\n';

  // Structured Data JSON-LD
  out += '  <!-- Structured Data -->\n';
  out += '  <script type="application/ld+json">\n';
  out += '  {\n';
  out += '    "@context": "https://schema.org",\n';
  out += '    "@type": "SportsClub",\n';
  out += '    "name": "' + h(meta.author) + '",\n';
  out += '    "alternateName": "' + meta.title.split(' — ')[0] + '",\n';
  out += '    "url": "' + h(meta.canonicalUrl.replace(/\/$/, '')) + '",\n';
  out += '    "email": "' + h(meta.structuredData.email) + '",\n';
  out += '    "telephone": "' + h(meta.structuredData.telephone) + '",\n';
  out += '    "address": {\n';
  out += '      "@type": "PostalAddress",\n';
  out += '      "streetAddress": "' + h(meta.structuredData.address.street) + '",\n';
  out += '      "addressLocality": "' + h(meta.structuredData.address.locality) + '",\n';
  out += '      "addressRegion": "' + h(meta.structuredData.address.region) + '",\n';
  out += '      "addressCountry": "' + h(meta.structuredData.address.country) + '"\n';
  out += '    },\n';
  out += '    "geo": {\n';
  out += '      "@type": "GeoCoordinates",\n';
  out += '      "latitude": ' + meta.structuredData.geo.lat + ',\n';
  out += '      "longitude": ' + meta.structuredData.geo.lng + '\n';
  out += '    },\n';
  out += '    "sport": ' + JSON.stringify(meta.structuredData.sports) + ',\n';
  out += '    "sameAs": ' + JSON.stringify(meta.structuredData.sameAs) + '\n';
  out += '  }\n';
  out += '  </script>\n';
  out += '\n';

  // Favicon
  out += '  <!-- Favicon -->\n';
  out += '  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E' + encodeURIComponent(meta.faviconEmoji) + '%3C/text%3E%3C/svg%3E">\n';
  out += '  <meta name="theme-color" content="' + h(meta.themeColor) + '">\n';
  out += '\n';

  // Fonts
  out += '  <!-- Fonts -->\n';
  out += '  <link rel="preconnect" href="https://fonts.googleapis.com">\n';
  out += '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n';
  out += '  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">\n';
  out += '\n';

  // ========== INLINE CSS ==========
  out += '  <style>\n';
  out += _buildCss();
  out += '  </style>\n';
  out += '</head>\n';

  // ========== BODY ==========
  out += '<body>\n';
  out += _buildHeader(header, h);
  out += _buildHero(hero, h);
  out += _buildWaveDivider('#FFFFFF', 6);
  out += _buildAbout(about, h);
  out += _buildSports(sports, h);
  out += _buildWaveDivider('#0A1628', 7, 'var(--off-white)');
  out += _buildAcademy(academy, h);
  out += _buildCamp(camp, h);
  out += _buildEvents(events, h);
  out += _buildNews(news, h);
  out += _buildGallery(gallery, h);
  out += _buildMembership(membership, h);
  out += _buildWeatherSponsors(weather, sponsors, h);
  out += _buildFloatingCta(floatingCta, h);
  out += _buildFooter(footer, h);
  out += _buildInlineScript(sports, weather);
  out += _buildCookieConsent();
  out += '\n</body>\n</html>\n';

  return out;
}

// ========== CSS (static, no interpolation) ==========
function _buildCss() {
  return `
    :root {
      --navy-deep: #0A1628;
      --navy: #1A3A6B;
      --navy-mid: #2558A0;
      --navy-light: #3470BD;
      --teal: #2E6EB5;
      --teal-light: #4A90D9;
      --teal-glow: rgba(46, 110, 181, 0.15);
      --gold: #E8A838;
      --gold-light: #F5C563;
      --white: #FFFFFF;
      --off-white: #F2F6FA;
      --gray-100: #E4EAF2;
      --gray-200: #C5D0DE;
      --gray-400: #7E8FA3;
      --gray-600: #4A5568;
      --coral: #FF6B6B;
      --noa-blue: #2E6EB5;
      --font-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
      --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --section-pad: clamp(4rem, 8vw, 8rem);
      --container-max: 1280px;
      --gap: clamp(1rem, 2vw, 2rem);
      --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
      --transition: 0.4s var(--ease-out);
    }
    .wave-divider { position: relative; width: 100%; overflow: hidden; line-height: 0; margin-top: -1px; }
    .wave-divider svg { position: relative; display: block; width: 100%; height: 80px; }
    .wave-divider--flip { transform: rotate(180deg); margin-bottom: -1px; margin-top: 0; }
    @keyframes waveMove { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .wave-path { animation: waveMove 8s linear infinite; }
    .glass { background: rgba(255,255,255,0.08); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.12); }
    .counter { display: inline-block; }
    .gradient-text { background: linear-gradient(135deg, var(--teal-light), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    @supports (animation-timeline: scroll()) {
      .parallax-slow { animation: parallaxUp linear both; animation-timeline: scroll(); animation-range: entry 0% exit 100%; }
      @keyframes parallaxUp { from { transform: translateY(30px); } to { transform: translateY(-30px); } }
    }
    .glow-hover { position: relative; overflow: hidden; }
    .glow-hover::before { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; background: radial-gradient(circle, var(--teal-glow), transparent 70%); border-radius: 50%; transition: width 0.6s var(--ease-out), height 0.6s var(--ease-out); transform: translate(-50%, -50%); z-index: 0; pointer-events: none; }
    .glow-hover:hover::before { width: 300px; height: 300px; }
    body::before { content: ''; position: fixed; inset: 0; z-index: 9999; pointer-events: none; opacity: 0.015; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-repeat: repeat; background-size: 256px 256px; }
    .sport-card, .event-card, .news-card, .membership-card, .gallery__item { will-change: transform; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; font-size: 16px; }
    body { font-family: var(--font-body); color: var(--navy); background: var(--white); line-height: 1.7; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
    img { max-width: 100%; height: auto; display: block; }
    a { color: inherit; text-decoration: none; }
    .container { width: 90%; max-width: var(--container-max); margin: 0 auto; }
    :focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } .reveal { opacity: 1; transform: none; } }
    .section-label { font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: var(--teal); margin-bottom: 0.75rem; }
    .section-title { font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700; line-height: 1.15; color: var(--navy); margin-bottom: 1rem; }
    .section-title--light { color: var(--white); }
    .section-subtitle { font-size: 1.05rem; color: var(--gray-600); max-width: 600px; line-height: 1.8; }
    .section-subtitle--light { color: var(--gray-200); }
    .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 2rem; font-family: var(--font-body); font-size: 0.9rem; font-weight: 600; letter-spacing: 0.04em; border: none; border-radius: 60px; cursor: pointer; transition: var(--transition); text-decoration: none; }
    .btn--primary { background: var(--teal); color: var(--white); }
    .btn--primary:hover { background: var(--teal-light); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(14,165,160,0.35); }
    .btn--outline { background: transparent; color: var(--white); border: 2px solid rgba(255,255,255,0.4); }
    .btn--outline:hover { border-color: var(--white); background: rgba(255,255,255,0.1); transform: translateY(-2px); }
    .btn--gold { background: var(--gold); color: var(--navy-deep); }
    .btn--gold:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(212,168,83,0.35); }
    .btn--dark { background: var(--navy); color: var(--white); }
    .btn--dark:hover { background: var(--navy-mid); transform: translateY(-2px); }
    .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s var(--ease-out), transform 0.8s var(--ease-out); }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-delay-1 { transition-delay: 0.1s; } .reveal-delay-2 { transition-delay: 0.2s; } .reveal-delay-3 { transition-delay: 0.3s; } .reveal-delay-4 { transition-delay: 0.4s; } .reveal-delay-5 { transition-delay: 0.5s; } .reveal-delay-6 { transition-delay: 0.6s; }
    .header { position: fixed; top: 0; left: 0; width: 100%; z-index: 1000; padding: 1.2rem 0; transition: background 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease; }
    .header.scrolled { background: rgba(6,16,31,0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); padding: 0.7rem 0; box-shadow: 0 4px 30px rgba(0,0,0,0.3); }
    .header__inner { display: flex; align-items: center; justify-content: space-between; }
    .header__logo { display: flex; align-items: center; gap: 0.75rem; z-index: 1001; }
    .header__logo-icon { width: 44px; height: 44px; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .header__logo-icon img { width: 100%; height: 100%; object-fit: contain; }
    .header__logo-text { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; color: var(--white); letter-spacing: 0.02em; }
    .header__logo-text span { display: block; font-family: var(--font-body); font-size: 0.6rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.7; margin-top: -2px; }
    .nav { display: flex; align-items: center; gap: 2rem; }
    .nav__link { font-size: 0.85rem; font-weight: 500; color: rgba(255,255,255,0.8); letter-spacing: 0.03em; transition: color 0.3s ease; position: relative; }
    .nav__link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: var(--teal); transition: width 0.3s var(--ease-out); }
    .nav__link:hover { color: var(--white); }
    .nav__link:hover::after { width: 100%; }
    .nav__cta { font-size: 0.8rem; padding: 0.6rem 1.5rem; }
    .nav__lang { font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.6); cursor: pointer; border: 1px solid rgba(255,255,255,0.2); padding: 0.3rem 0.6rem; border-radius: 4px; transition: var(--transition); }
    .nav__lang:hover { color: var(--white); border-color: rgba(255,255,255,0.5); }
    .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; z-index: 1001; background: none; border: none; padding: 4px; }
    .hamburger span { display: block; width: 26px; height: 2px; background: var(--white); border-radius: 2px; transition: var(--transition); }
    .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.active span:nth-child(2) { opacity: 0; }
    .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    .mobile-menu { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: var(--navy-deep); z-index: 999; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; display: flex; opacity: 0; visibility: hidden; transition: opacity 0.4s ease, visibility 0.4s ease; }
    .mobile-menu.open { opacity: 1; visibility: visible; }
    .mobile-menu a { font-family: var(--font-display); font-size: 1.8rem; color: var(--white); font-weight: 600; transition: color 0.3s ease; }
    .mobile-menu a:hover { color: var(--teal); }
    @media (max-width: 968px) { .nav { display: none; } .hamburger { display: flex; } }
    .hero { position: relative; min-height: 100vh; display: flex; align-items: flex-end; padding-bottom: clamp(4rem, 10vw, 7rem); overflow: hidden; }
    .hero__bg { position: absolute; inset: 0; z-index: 0; }
    .hero__bg video, .hero__bg img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; }
    .hero__bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(6,16,31,0.4) 0%, rgba(6,16,31,0.15) 40%, rgba(6,16,31,0.65) 70%, rgba(6,16,31,0.93) 100%); }
    .hero__content { position: relative; z-index: 1; }
    .hero__badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(14,165,160,0.15); border: 1px solid rgba(14,165,160,0.3); backdrop-filter: blur(10px); padding: 0.5rem 1.2rem; border-radius: 60px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--teal-light); margin-bottom: 1.5rem; animation: fadeInUp 0.8s var(--ease-out) 0.2s both; }
    .hero__badge::before { content: ''; width: 8px; height: 8px; background: var(--teal); border-radius: 50%; animation: pulse 2s ease infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    .hero__title { font-family: var(--font-display); font-size: clamp(2.8rem, 7vw, 5.5rem); font-weight: 700; color: var(--white); line-height: 1.05; margin-bottom: 0.25rem; animation: fadeInUp 0.8s var(--ease-out) 0.4s both; }
    .hero__title-accent { display: block; background: linear-gradient(135deg, var(--teal-light), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero__subtitle { font-size: clamp(1rem, 1.8vw, 1.25rem); color: rgba(255,255,255,0.75); max-width: 540px; line-height: 1.7; margin-bottom: 2.5rem; animation: fadeInUp 0.8s var(--ease-out) 0.6s both; }
    .hero__actions { display: flex; flex-wrap: wrap; gap: 1rem; animation: fadeInUp 0.8s var(--ease-out) 0.8s both; }
    .hero__scroll-indicator { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: rgba(255,255,255,0.4); font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; animation: fadeInUp 0.8s var(--ease-out) 1.2s both; }
    .hero__scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent); animation: scrollLine 2s ease infinite; }
    @keyframes scrollLine { 0% { transform: scaleY(0); transform-origin: top; } 50% { transform: scaleY(1); transform-origin: top; } 51% { transform: scaleY(1); transform-origin: bottom; } 100% { transform: scaleY(0); transform-origin: bottom; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .hero__stats { display: flex; gap: 3rem; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); animation: fadeInUp 0.8s var(--ease-out) 1s both; }
    .hero__stat-number { font-family: var(--font-display); font-size: 2.2rem; font-weight: 700; color: var(--teal-light); line-height: 1; }
    .hero__stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.5); letter-spacing: 0.08em; margin-top: 0.25rem; }
    @media (max-width: 640px) { .hero__stats { gap: 1.5rem; flex-wrap: wrap; } .hero__stat-number { font-size: 1.6rem; } }
    .about { padding: var(--section-pad) 0; background: var(--white); }
    .about__grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 5rem); align-items: center; }
    .about__image-wrap { position: relative; }
    .about__image { border-radius: 16px; overflow: hidden; box-shadow: 0 25px 60px rgba(11,29,58,0.15); }
    .about__image img { width: 100%; height: 450px; object-fit: cover; transition: transform 0.6s var(--ease-out); }
    .about__image:hover img { transform: scale(1.03); }
    .about__image-accent { position: absolute; top: -20px; right: -20px; width: 120px; height: 120px; border: 3px solid var(--teal); border-radius: 16px; opacity: 0.3; z-index: -1; }
    .about__values { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2rem; }
    .about__value { display: flex; align-items: flex-start; gap: 0.75rem; }
    .about__value-icon { width: 40px; height: 40px; min-width: 40px; background: var(--teal-glow); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
    .about__value-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.15rem; }
    .about__value-text { font-size: 0.8rem; color: var(--gray-600); line-height: 1.5; }
    @media (max-width: 768px) { .about__grid { grid-template-columns: 1fr; } .about__image img { height: 300px; } .about__image-accent { display: none; } .about__values { grid-template-columns: 1fr; } }
    .sports { padding: var(--section-pad) 0; background: var(--off-white); position: relative; overflow: hidden; }
    .sports::before { content: ''; position: absolute; top: -200px; right: -200px; width: 500px; height: 500px; background: radial-gradient(circle, var(--teal-glow), transparent 70%); pointer-events: none; }
    .sports__header { text-align: center; margin-bottom: 3rem; }
    .sports__header .section-subtitle { margin: 0 auto; }
    .sports__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); }
    .sport-card { background: var(--white); border-radius: 16px; overflow: hidden; transition: var(--transition); cursor: pointer; position: relative; box-shadow: 0 4px 20px rgba(11,29,58,0.06); }
    .sport-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(11,29,58,0.12); }
    .sport-card__image { height: 200px; overflow: hidden; position: relative; }
    .sport-card__image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease-out); }
    .sport-card:hover .sport-card__image img { transform: scale(1.08); }
    .sport-card__image-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(6,16,31,0.7) 100%); }
    .sport-card__icon { position: absolute; top: 1rem; left: 1rem; width: 48px; height: 48px; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .sport-card__body { padding: 1.5rem; }
    .sport-card__name { font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem; }
    .sport-card__desc { font-size: 0.85rem; color: var(--gray-600); line-height: 1.6; margin-bottom: 1rem; }
    .sport-card__link { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; font-weight: 600; color: var(--teal); letter-spacing: 0.03em; transition: gap 0.3s var(--ease-out); }
    .sport-card:hover .sport-card__link { gap: 0.7rem; }
    .sport-card__link::after { content: '\\2192'; }
    @media (max-width: 968px) { .sports__grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 580px) { .sports__grid { grid-template-columns: 1fr; } }
    .academy { padding: var(--section-pad) 0; background: var(--navy-deep); color: var(--white); position: relative; overflow: hidden; }
    .academy::before { content: ''; position: absolute; bottom: -100px; left: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(14,165,160,0.08), transparent 70%); pointer-events: none; }
    .academy__grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 5rem); align-items: center; }
    .academy__content { order: 1; } .academy__visual { order: 2; position: relative; }
    .academy__pathway { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem; }
    .academy__step { display: flex; align-items: flex-start; gap: 1.2rem; padding: 1.2rem 1.5rem; background: rgba(255,255,255,0.04); border-radius: 12px; border-left: 3px solid var(--teal); transition: var(--transition); }
    .academy__step:hover { background: rgba(255,255,255,0.08); }
    .academy__step-num { width: 36px; height: 36px; min-width: 36px; background: var(--teal); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; }
    .academy__step-title { font-weight: 600; font-size: 0.95rem; margin-bottom: 0.2rem; }
    .academy__step-text { font-size: 0.8rem; color: var(--gray-400); line-height: 1.5; }
    .academy__image { border-radius: 16px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.3); }
    .academy__image img { width: 100%; height: 500px; object-fit: cover; }
    .academy__cta { margin-top: 2rem; }
    .wave-mascot { position: absolute; bottom: -10px; right: 30px; font-size: 4rem; animation: bob 3s ease-in-out infinite; }
    @keyframes bob { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
    .academy__step-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 60px; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.3rem; }
    .badge--beginner { background: rgba(45,212,191,0.2); color: var(--teal-light); }
    .badge--intermediate { background: rgba(212,168,83,0.2); color: var(--gold-light); }
    .badge--advanced { background: rgba(255,107,107,0.2); color: var(--coral); }
    .sport-quiz { background: linear-gradient(135deg, var(--teal), var(--navy-light)); border-radius: 16px; padding: 2rem; text-align: center; margin-top: 2rem; color: var(--white); position: relative; overflow: hidden; }
    .sport-quiz::before { content: ''; position: absolute; top: -50%; right: -30%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%); pointer-events: none; }
    .sport-quiz__title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
    .sport-quiz__text { font-size: 0.9rem; opacity: 0.85; margin-bottom: 1.2rem; }
    .sport-quiz__options { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-bottom: 1rem; }
    .sport-quiz__option { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 60px; font-size: 0.8rem; cursor: pointer; transition: var(--transition); font-weight: 500; color: inherit; font-family: inherit; }
    .sport-quiz__option:hover, .sport-quiz__option.active { background: var(--white); color: var(--navy); border-color: var(--white); }
    .sport-quiz__result { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; min-height: 2rem; transition: opacity 0.3s ease; }
    @media (max-width: 768px) { .academy__grid { grid-template-columns: 1fr; } .academy__content { order: 2; } .academy__visual { order: 1; } .academy__image img { height: 300px; } }
    .camp { position: relative; padding: clamp(5rem, 10vw, 8rem) 0; overflow: hidden; }
    .camp__bg { position: absolute; inset: 0; z-index: 0; }
    .camp__bg img { width: 100%; height: 100%; object-fit: cover; }
    .camp__bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(6,16,31,0.88) 0%, rgba(14,165,160,0.6) 100%); }
    .camp__content { position: relative; z-index: 1; text-align: center; max-width: 700px; margin: 0 auto; }
    .camp__icon { font-size: 3rem; margin-bottom: 1rem; }
    .camp__title { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; color: var(--white); line-height: 1.1; margin-bottom: 1rem; }
    .camp__text { font-size: 1.1rem; color: rgba(255,255,255,0.8); line-height: 1.8; margin-bottom: 2rem; }
    .camp__features { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-bottom: 2.5rem; }
    .camp__feature { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(8px); padding: 0.5rem 1rem; border-radius: 60px; font-size: 0.8rem; color: var(--white); font-weight: 500; }
    .events { padding: var(--section-pad) 0; background: var(--white); }
    .events__header { text-align: center; margin-bottom: 3rem; }
    .events__header .section-subtitle { margin: 0 auto; }
    .events__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); }
    .event-card { border: 1px solid var(--gray-100); border-radius: 16px; overflow: hidden; transition: var(--transition); }
    .event-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(11,29,58,0.08); }
    .event-card__date { padding: 1.5rem 1.5rem 0; display: flex; align-items: flex-start; gap: 1rem; }
    .event-card__date-box { background: var(--teal); color: var(--white); border-radius: 12px; padding: 0.6rem 0.8rem; text-align: center; min-width: 58px; }
    .event-card__date-day { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; line-height: 1; }
    .event-card__date-month { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
    .event-card__date-info { flex: 1; }
    .event-card__category { display: inline-block; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--teal); margin-bottom: 0.3rem; }
    .event-card__title { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; }
    .event-card__body { padding: 1rem 1.5rem 1.5rem; }
    .event-card__desc { font-size: 0.85rem; color: var(--gray-600); line-height: 1.6; }
    .event-card__tag { display: inline-block; margin-top: 0.75rem; padding: 0.3rem 0.8rem; border-radius: 60px; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.05em; }
    .event-card__tag--sailing { background: #E0F7FA; color: #00796B; }
    .event-card__tag--windsurf { background: #FFF3E0; color: #E65100; }
    .event-card__tag--general { background: #EDE7F6; color: #4527A0; }
    @media (max-width: 768px) { .events__grid { grid-template-columns: 1fr; } }
    .news { padding: var(--section-pad) 0; background: var(--off-white); }
    .news__header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem; }
    .news__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); }
    .news-card { background: var(--white); border-radius: 16px; overflow: hidden; transition: var(--transition); box-shadow: 0 4px 20px rgba(11,29,58,0.06); }
    .news-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(11,29,58,0.1); }
    .news-card__image { height: 200px; overflow: hidden; }
    .news-card__image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease-out); }
    .news-card:hover .news-card__image img { transform: scale(1.05); }
    .news-card__body { padding: 1.5rem; }
    .news-card__date { font-size: 0.7rem; color: var(--gray-400); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.5rem; }
    .news-card__title { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.3; }
    .news-card__excerpt { font-size: 0.85rem; color: var(--gray-600); line-height: 1.6; }
    @media (max-width: 768px) { .news__grid { grid-template-columns: 1fr; } }
    .gallery { padding: var(--section-pad) 0; background: var(--white); }
    .gallery__header { text-align: center; margin-bottom: 3rem; }
    .gallery__header .section-subtitle { margin: 0 auto; }
    .gallery__grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 220px; gap: 0.5rem; }
    .gallery__item { border-radius: 12px; overflow: hidden; cursor: pointer; position: relative; }
    .gallery__item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s var(--ease-out); }
    .gallery__item::after { content: ''; position: absolute; inset: 0; background: rgba(6,16,31,0); transition: background 0.3s ease; }
    .gallery__item:hover img { transform: scale(1.08); }
    .gallery__item:hover::after { background: rgba(6,16,31,0.2); }
    .gallery__item--wide { grid-column: span 2; }
    .gallery__item--tall { grid-row: span 2; }
    @media (max-width: 768px) { .gallery__grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 180px; } .gallery__item--wide { grid-column: span 1; } .gallery__item--tall { grid-row: span 1; } }
    .social-feeds__grid { display: grid; grid-template-columns: 1fr; max-width: 500px; margin: 0 auto; gap: var(--gap); }
    .social-feeds__title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; }
    .social-feeds__embed { border-radius: 12px; overflow: hidden; }
    .social-feeds__ig-link { display: block; text-decoration: none; color: inherit; }
    .social-feeds__ig-card { background: var(--white); border: 1px solid var(--gray-100); border-radius: 12px; overflow: hidden; transition: var(--transition); }
    .social-feeds__ig-card:hover { box-shadow: 0 12px 40px rgba(11,29,58,0.1); transform: translateY(-2px); }
    .social-feeds__ig-header { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.2rem; border-bottom: 1px solid var(--gray-100); }
    .social-feeds__ig-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #833AB4, #FD1D1D, #F77737); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.7rem; }
    .social-feeds__ig-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; padding: 2px; }
    .social-feeds__ig-grid img { width: 100%; aspect-ratio: 1; object-fit: cover; transition: opacity 0.3s ease; }
    .social-feeds__ig-grid img:hover { opacity: 0.85; }
    .social-feeds__ig-cta { text-align: center; padding: 1rem; font-size: 0.85rem; font-weight: 600; color: var(--teal); border-top: 1px solid var(--gray-100); }
    @media (max-width: 768px) { .social-feeds__grid { grid-template-columns: 1fr; } }
    .lightbox { display: none; position: fixed; inset: 0; background: rgba(6,16,31,0.95); z-index: 2000; align-items: center; justify-content: center; cursor: pointer; }
    .lightbox.active { display: flex; }
    .lightbox img { max-width: 90vw; max-height: 85vh; border-radius: 8px; box-shadow: 0 30px 80px rgba(0,0,0,0.5); }
    .lightbox__close { position: absolute; top: 2rem; right: 2rem; width: 48px; height: 48px; background: rgba(255,255,255,0.1); border: none; border-radius: 50%; color: var(--white); font-size: 1.5rem; cursor: pointer; transition: var(--transition); display: flex; align-items: center; justify-content: center; }
    .lightbox__close:hover { background: rgba(255,255,255,0.2); }
    .membership { padding: var(--section-pad) 0; background: linear-gradient(135deg, var(--navy-deep) 0%, var(--navy-mid) 100%); color: var(--white); position: relative; overflow: hidden; }
    .membership::before { content: ''; position: absolute; top: -50%; right: -20%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(212,168,83,0.08), transparent 70%); pointer-events: none; }
    .membership__header { text-align: center; margin-bottom: 3rem; }
    .membership__header .section-subtitle--light { margin: 0 auto; }
    .membership__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); max-width: 1000px; margin: 0 auto; }
    .membership-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 2rem; text-align: center; transition: var(--transition); position: relative; }
    .membership-card:hover { background: rgba(255,255,255,0.08); transform: translateY(-4px); }
    .membership-card--featured { border-color: var(--gold); }
    .membership-card--featured::before { content: ''; display: none; }
    .membership-card__badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--gold); color: var(--navy-deep); font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.3rem 1rem; border-radius: 60px; white-space: nowrap; }
    .membership-card__icon { font-size: 2rem; margin-bottom: 1rem; }
    .membership-card__title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
    .membership-card__desc { font-size: 0.85rem; color: var(--gray-400); line-height: 1.6; margin-bottom: 1.5rem; }
    .membership-card__features { list-style: none; margin-bottom: 2rem; text-align: left; }
    .membership-card__features li { font-size: 0.85rem; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 0.5rem; }
    .membership-card__features li::before { content: '\\2713'; color: var(--teal-light); font-weight: 700; }
    @media (max-width: 768px) { .membership__grid { grid-template-columns: 1fr; max-width: 400px; } }
    .weather-sponsors { padding: var(--section-pad) 0; background: var(--off-white); }
    .weather-sponsors__grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 4rem); align-items: start; }
    .weather-widget { background: var(--white); border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(11,29,58,0.06); }
    .weather-widget__header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
    .weather-widget__icon { font-size: 2rem; }
    .weather-widget__title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; }
    .weather-widget__location { font-size: 0.75rem; color: var(--gray-400); }
    .weather-widget__data { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center; }
    .weather-widget__item-value { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--teal); line-height: 1; }
    .weather-widget__item-label { font-size: 0.7rem; color: var(--gray-400); margin-top: 0.25rem; letter-spacing: 0.08em; text-transform: uppercase; }
    .weather-widget__note { margin-top: 1.5rem; font-size: 0.75rem; color: var(--gray-400); text-align: center; font-style: italic; }
    .sponsors__title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin-bottom: 1.5rem; }
    .sponsors__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .sponsors__item { background: var(--white); border-radius: 12px; height: 80px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--gray-100); font-size: 0.8rem; color: var(--gray-400); font-weight: 600; letter-spacing: 0.05em; transition: var(--transition); }
    .sponsors__item:hover { border-color: var(--teal); color: var(--teal); }
    @media (max-width: 768px) { .weather-sponsors__grid { grid-template-columns: 1fr; } .sponsors__grid { grid-template-columns: repeat(2, 1fr); } }
    .footer { background: var(--navy-deep); color: var(--white); padding: clamp(3rem, 6vw, 5rem) 0 0; }
    .footer__grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: clamp(2rem, 4vw, 4rem); padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .footer__brand-name { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
    .footer__brand-desc { font-size: 0.85rem; color: var(--gray-400); line-height: 1.7; margin-bottom: 1.5rem; }
    .footer__social { display: flex; gap: 0.75rem; }
    .footer__social a { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; transition: var(--transition); }
    .footer__social a:hover { background: var(--teal); border-color: var(--teal); }
    .footer__heading { font-weight: 700; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1.2rem; }
    .footer__links { list-style: none; }
    .footer__links li { margin-bottom: 0.6rem; }
    .footer__links a { font-size: 0.85rem; color: var(--gray-400); transition: color 0.3s ease; }
    .footer__links a:hover { color: var(--teal-light); }
    .footer__contact-item { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem; }
    .footer__contact-icon { font-size: 1rem; color: var(--teal); margin-top: 2px; }
    .footer__contact-text { font-size: 0.85rem; color: var(--gray-400); line-height: 1.5; }
    .footer__contact-text a { color: var(--gray-400); transition: color 0.3s ease; }
    .footer__contact-text a:hover { color: var(--teal-light); }
    .footer__newsletter { margin-top: 1.5rem; }
    .footer__newsletter-form { display: flex; gap: 0.5rem; }
    .footer__newsletter-input { flex: 1; padding: 0.7rem 1rem; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); border-radius: 8px; color: var(--white); font-family: var(--font-body); font-size: 0.85rem; }
    .footer__newsletter-input::placeholder { color: var(--gray-400); }
    .footer__newsletter-btn { padding: 0.7rem 1.2rem; background: var(--teal); color: var(--white); border: none; border-radius: 8px; font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: var(--transition); }
    .footer__newsletter-btn:hover { background: var(--teal-light); }
    .footer__bottom { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; flex-wrap: wrap; gap: 0.5rem; }
    .footer__copy { font-size: 0.75rem; color: var(--gray-400); }
    .footer__registry { font-size: 0.7rem; color: var(--gray-400); opacity: 0.6; }
    .floating-cta { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 1500; display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-end; }
    .floating-cta__btn { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: var(--transition); box-shadow: 0 6px 25px rgba(0,0,0,0.2); }
    .floating-cta__btn:hover { transform: scale(1.1); }
    .floating-cta__btn--phone { background: var(--teal); color: var(--white); font-size: 1.3rem; }
    .floating-cta__btn--email { background: var(--gold); color: var(--navy-deep); font-size: 1.3rem; }
    .floating-cta__btn--top { background: var(--navy); color: var(--white); font-size: 1.1rem; opacity: 0; pointer-events: none; transition: opacity 0.3s ease, transform 0.3s ease; }
    .floating-cta__btn--top.visible { opacity: 1; pointer-events: auto; }
    .floating-cta__tooltip { position: absolute; right: 64px; top: 50%; transform: translateY(-50%); background: var(--navy); color: var(--white); font-size: 0.75rem; font-weight: 600; padding: 0.4rem 0.8rem; border-radius: 6px; white-space: nowrap; opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
    .floating-cta__btn:hover + .floating-cta__tooltip, .floating-cta__btn:hover .floating-cta__tooltip { opacity: 1; }
    .footer__map { grid-column: 1 / -1; margin-top: 1.5rem; border-radius: 12px; overflow: hidden; height: 250px; border: 1px solid rgba(255,255,255,0.08); }
    .footer__map iframe { width: 100%; height: 100%; border: none; filter: saturate(0.8) contrast(1.1); }
    @media (max-width: 968px) { .footer__grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 580px) { .footer__grid { grid-template-columns: 1fr; } .footer__bottom { flex-direction: column; text-align: center; } }
    .cookie-consent { position: fixed; bottom: 0; left: 0; right: 0; z-index: 10000; background: var(--navy); color: var(--white); padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: center; gap: 1.5rem; font-size: 0.85rem; box-shadow: 0 -2px 10px rgba(0,0,0,0.3); }
    .cookie-consent p { margin: 0; max-width: 600px; line-height: 1.5; }
    .cookie-consent a { color: var(--teal-light); text-decoration: underline; }
    .cookie-consent__btn { background: var(--teal); color: var(--white); border: none; padding: 0.6rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem; white-space: nowrap; font-family: inherit; }
    .cookie-consent__btn:hover { background: var(--teal-light); }
    @media (max-width: 580px) { .cookie-consent { flex-direction: column; text-align: center; gap: 0.8rem; } }
  `;
}

// ========== HEADER ==========
function _buildHeader(header, h) {
  var navLinks = header.navLinks.map(function(link) {
    return '        <a href="' + h(link.href) + '" class="nav__link">' + h(link.label) + '</a>';
  }).join('\n');

  var mobileLinks = header.navLinks.map(function(link) {
    return '    <a href="' + h(link.href) + '" onclick="closeMobile()">' + h(link.label) + '</a>';
  }).join('\n');

  return '\n  <!-- ========== HEADER ========== -->\n' +
    '  <header class="header" id="header">\n' +
    '    <div class="container header__inner">\n' +
    '      <a href="#" class="header__logo">\n' +
    '        <div class="header__logo-icon"><img src="' + h(header.logoUrl) + '" alt="' + h(header.logoAlt) + '"></div>\n' +
    '        <div class="header__logo-text">\n' +
    '          ' + h(header.brandName) + '\n' +
    '          <span>' + h(header.brandSubtitle) + '</span>\n' +
    '        </div>\n' +
    '      </a>\n' +
    '      <nav class="nav">\n' +
    navLinks + '\n' +
    '        <a href="' + h(header.ctaHref) + '" class="btn btn--primary nav__cta">' + h(header.ctaLabel) + '</a>\n' +
    '        <button class="nav__lang" aria-label="Switch language">EN</button>\n' +
    '      </nav>\n' +
    '      <button class="hamburger" id="hamburger" aria-label="Menu">\n' +
    '        <span></span><span></span><span></span>\n' +
    '      </button>\n' +
    '    </div>\n' +
    '  </header>\n\n' +
    '  <!-- Mobile Menu -->\n' +
    '  <div class="mobile-menu" id="mobileMenu">\n' +
    mobileLinks + '\n' +
    '    <a href="' + h(header.ctaHref) + '" onclick="closeMobile()">' + h(header.ctaLabel) + '</a>\n' +
    '  </div>\n';
}

// ========== HERO ==========
function _buildHero(hero, h) {
  var actions = hero.actions.map(function(a) {
    return '        <a href="' + h(a.href) + '" class="btn btn--' + h(a.style) + '">' + h(a.label) + '</a>';
  }).join('\n');

  var stats = hero.stats.map(function(s) {
    return '        <div>\n          <div class="hero__stat-number">' + h(s.value) + '</div>\n          <div class="hero__stat-label">' + h(s.label) + '</div>\n        </div>';
  }).join('\n');

  return '\n  <!-- ========== HERO ========== -->\n' +
    '  <section class="hero" id="hero">\n' +
    '    <div class="hero__bg">\n' +
    '      <video autoplay muted loop playsinline poster="' + h(hero.bgImageUrl) + '" id="heroVideo">\n' +
    '        <source src="' + h(hero.bgVideoUrl) + '" type="video/mp4" id="heroVideoSource">\n' +
    '      </video>\n' +
    '      <img src="' + h(hero.bgImageUrl) + '" alt="' + h(hero.bgImageAlt) + '" class="hero__bg-fallback" style="display:none;">\n' +
    '    </div>\n' +
    '    <div class="container hero__content">\n' +
    '      <div class="hero__badge">' + h(hero.badgeText) + '</div>\n' +
    '      <h1 class="hero__title">\n' +
    '        ' + h(hero.titleLine1) + '\n' +
    '        <span class="hero__title-accent">' + h(hero.titleAccent) + '</span>\n' +
    '      </h1>\n' +
    '      <p class="hero__subtitle">' + h(hero.subtitle) + '</p>\n' +
    '      <div class="hero__actions">\n' +
    actions + '\n' +
    '      </div>\n' +
    '      <div class="hero__stats">\n' +
    stats + '\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="hero__scroll-indicator">\n' +
    '      <span>Scroll</span>\n' +
    '      <div class="hero__scroll-line"></div>\n' +
    '    </div>\n' +
    '  </section>\n';
}

// ========== WAVE DIVIDER ==========
function _buildWaveDivider(fillColor, dur, bgStyle) {
  var styleAttr = bgStyle ? ' style="background:' + bgStyle + ';"' : '';
  return '\n  <div class="wave-divider"' + styleAttr + '>\n' +
    '    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">\n' +
    '      <path fill="' + fillColor + '" d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z">\n' +
    '        <animate attributeName="d" dur="' + dur + 's" repeatCount="indefinite"\n' +
    '          values="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z;\n' +
    '                  M0,50 C360,10 720,70 1080,30 C1260,20 1380,60 1440,50 L1440,80 L0,80 Z;\n' +
    '                  M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"/>\n' +
    '      </path>\n' +
    '    </svg>\n' +
    '  </div>\n';
}

// ========== ABOUT ==========
function _buildAbout(about, h) {
  var values = about.values.map(function(val) {
    return '            <div class="about__value">\n' +
      '              <div class="about__value-icon">' + val.icon + '</div>\n' +
      '              <div>\n' +
      '                <div class="about__value-title">' + h(val.title) + '</div>\n' +
      '                <div class="about__value-text">' + h(val.text) + '</div>\n' +
      '              </div>\n' +
      '            </div>';
  }).join('\n');

  return '\n  <!-- ========== ABOUT ========== -->\n' +
    '  <section class="about" id="about">\n' +
    '    <div class="container">\n' +
    '      <div class="about__grid">\n' +
    '        <div class="about__image-wrap reveal">\n' +
    '          <div class="about__image">\n' +
    '            <img src="' + h(about.imageUrl) + '" alt="' + h(about.imageAlt) + '">\n' +
    '          </div>\n' +
    '          <div class="about__image-accent"></div>\n' +
    '        </div>\n' +
    '        <div class="reveal reveal-delay-2">\n' +
    '          <div class="section-label">' + h(about.sectionLabel) + '</div>\n' +
    '          <h2 class="section-title">' + about.title + '</h2>\n' +
    '          <p class="section-subtitle">' + h(about.description) + '</p>\n' +
    '          <div class="about__values">\n' +
    values + '\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n';
}

// ========== SPORTS ==========
function _buildSports(sports, h) {
  var cards = sports.cards.map(function(card, i) {
    return '        <div class="sport-card reveal reveal-delay-' + Math.min(i + 1, 6) + '">\n' +
      '          <div class="sport-card__image">\n' +
      '            <img src="' + h(card.imageUrl) + '" alt="' + h(card.imageAlt) + '">\n' +
      '            <div class="sport-card__image-overlay"></div>\n' +
      '            <div class="sport-card__icon">' + card.icon + '</div>\n' +
      '          </div>\n' +
      '          <div class="sport-card__body">\n' +
      '            <h3 class="sport-card__name">' + h(card.name) + '</h3>\n' +
      '            <p class="sport-card__desc">' + h(card.description) + '</p>\n' +
      '            <span class="sport-card__link">' + h(card.linkText) + '</span>\n' +
      '          </div>\n' +
      '        </div>';
  }).join('\n');

  var quizOptions = sports.quiz.options.map(function(opt) {
    return '          <button type="button" class="sport-quiz__option" onclick="pickSport(this, \'' + h(opt.key) + '\')">' + h(opt.label) + '</button>';
  }).join('\n');

  return '\n  <!-- ========== SPORTS ========== -->\n' +
    '  <section class="sports" id="sports">\n' +
    '    <div class="container">\n' +
    '      <div class="sports__header reveal">\n' +
    '        <div class="section-label">' + h(sports.sectionLabel) + '</div>\n' +
    '        <h2 class="section-title">' + sports.title + '</h2>\n' +
    '        <p class="section-subtitle">' + h(sports.subtitle) + '</p>\n' +
    '      </div>\n' +
    '      <div class="sports__grid">\n' +
    cards + '\n' +
    '      </div>\n' +
    '      <!-- Fun Sport Quiz -->\n' +
    '      <div class="sport-quiz reveal" id="sportQuiz">\n' +
    '        <div class="sport-quiz__title">' + h(sports.quiz.title) + '</div>\n' +
    '        <div class="sport-quiz__text">' + h(sports.quiz.subtitle) + '</div>\n' +
    '        <div class="sport-quiz__options">\n' +
    quizOptions + '\n' +
    '        </div>\n' +
    '        <div class="sport-quiz__result" id="quizResult"></div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n';
}

// ========== ACADEMY ==========
function _buildAcademy(academy, h) {
  var steps = academy.steps.map(function(step) {
    return '            <div class="academy__step">\n' +
      '              <div class="academy__step-num">' + h(step.number) + '</div>\n' +
      '              <div>\n' +
      '                <div class="academy__step-title">' + h(step.title) + '</div>\n' +
      '                <div class="academy__step-text">' + h(step.text) + '</div>\n' +
      '                <span class="academy__step-badge badge--' + h(step.badgeClass) + '">' + h(step.badgeText) + '</span>\n' +
      '              </div>\n' +
      '            </div>';
  }).join('\n');

  return '\n  <!-- ========== YOUTH ACADEMIES ========== -->\n' +
    '  <section class="academy" id="academy">\n' +
    '    <div class="container">\n' +
    '      <div class="academy__grid">\n' +
    '        <div class="academy__content reveal">\n' +
    '          <div class="section-label" style="color: var(--teal-light);">' + h(academy.sectionLabel) + '</div>\n' +
    '          <h2 class="section-title section-title--light">' + academy.title + '</h2>\n' +
    '          <p class="section-subtitle section-subtitle--light">' + h(academy.subtitle) + '</p>\n' +
    '          <div class="academy__pathway">\n' +
    steps + '\n' +
    '          </div>\n' +
    '          <div class="academy__cta">\n' +
    '            <a href="' + h(academy.ctaHref) + '" class="btn btn--primary">' + h(academy.ctaLabel) + '</a>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '        <div class="academy__visual reveal reveal-delay-2">\n' +
    '          <div class="academy__image">\n' +
    '            <img src="' + h(academy.imageUrl) + '" alt="' + h(academy.imageAlt) + '">\n' +
    '          </div>\n' +
    '          <div class="wave-mascot">&#127754;</div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n';
}

// ========== SUMMER CAMP ==========
function _buildCamp(camp, h) {
  var features = camp.features.map(function(feat) {
    return '        <span class="camp__feature">' + feat.icon + ' ' + h(feat.label) + '</span>';
  }).join('\n');

  return '\n  <!-- ========== SUMMER CAMP ========== -->\n' +
    '  <section class="camp" id="camp">\n' +
    '    <div class="camp__bg">\n' +
    '      <img src="' + h(camp.bgImageUrl) + '" alt="' + h(camp.bgImageAlt) + '">\n' +
    '    </div>\n' +
    '    <div class="container camp__content reveal">\n' +
    '      <div class="camp__icon">' + camp.icon + '</div>\n' +
    '      <h2 class="camp__title">' + camp.title + '</h2>\n' +
    '      <p class="camp__text">' + h(camp.text) + '</p>\n' +
    '      <div class="camp__features">\n' +
    features + '\n' +
    '      </div>\n' +
    '      <a href="' + h(camp.ctaHref) + '" class="btn btn--gold">' + h(camp.ctaLabel) + '</a>\n' +
    '    </div>\n' +
    '  </section>\n';
}

// ========== EVENTS ==========
function _buildEvents(events, h) {
  var cards = events.cards.map(function(card, i) {
    return '        <div class="event-card reveal reveal-delay-' + Math.min(i + 1, 6) + '">\n' +
      '          <div class="event-card__date">\n' +
      '            <div class="event-card__date-box">\n' +
      '              <div class="event-card__date-day">' + h(card.dateDay) + '</div>\n' +
      '              <div class="event-card__date-month">' + h(card.dateMonth) + '</div>\n' +
      '            </div>\n' +
      '            <div class="event-card__date-info">\n' +
      '              <div class="event-card__category">' + h(card.category) + '</div>\n' +
      '              <div class="event-card__title">' + h(card.title) + '</div>\n' +
      '            </div>\n' +
      '          </div>\n' +
      '          <div class="event-card__body">\n' +
      '            <p class="event-card__desc">' + h(card.description) + '</p>\n' +
      '            <span class="event-card__tag event-card__tag--' + h(card.tagClass) + '">' + h(card.tagText) + '</span>\n' +
      '          </div>\n' +
      '        </div>';
  }).join('\n');

  return '\n  <!-- ========== EVENTS ========== -->\n' +
    '  <section class="events" id="events">\n' +
    '    <div class="container">\n' +
    '      <div class="events__header reveal">\n' +
    '        <div class="section-label">' + h(events.sectionLabel) + '</div>\n' +
    '        <h2 class="section-title">' + events.title + '</h2>\n' +
    '        <p class="section-subtitle">' + h(events.subtitle) + '</p>\n' +
    '      </div>\n' +
    '      <div class="events__grid">\n' +
    cards + '\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n';
}

// ========== NEWS ==========
function _buildNews(news, h) {
  var cards = news.cards.map(function(card, i) {
    return '        <div class="news-card reveal reveal-delay-' + Math.min(i + 1, 6) + '">\n' +
      '          <div class="news-card__image">\n' +
      '            <img src="' + h(card.imageUrl) + '" loading="lazy" alt="' + h(card.imageAlt) + '">\n' +
      '          </div>\n' +
      '          <div class="news-card__body">\n' +
      '            <div class="news-card__date">' + h(card.date) + '</div>\n' +
      '            <h3 class="news-card__title">' + h(card.title) + '</h3>\n' +
      '            <p class="news-card__excerpt">' + h(card.excerpt) + '</p>\n' +
      '            <a href="' + h(card.linkUrl) + '" target="_blank" rel="noopener" class="sport-card__link" style="margin-top:0.5rem;">' + h(card.linkText) + '</a>\n' +
      '          </div>\n' +
      '        </div>';
  }).join('\n');

  return '\n  <!-- ========== NEWS ========== -->\n' +
    '  <section class="news" id="news">\n' +
    '    <div class="container">\n' +
    '      <div class="news__header">\n' +
    '        <div>\n' +
    '          <div class="section-label">' + h(news.sectionLabel) + '</div>\n' +
    '          <h2 class="section-title">' + news.title + '</h2>\n' +
    '        </div>\n' +
    '        <a href="' + h(news.allNewsUrl) + '" target="_blank" rel="noopener" class="btn btn--dark">' + h(news.allNewsLabel) + '</a>\n' +
    '      </div>\n' +
    '      <div class="news__grid">\n' +
    cards + '\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n';
}

// ========== GALLERY ==========
function _buildGallery(gallery, h) {
  var images = gallery.images.map(function(img) {
    var cls = 'gallery__item';
    if (img.wide) cls += ' gallery__item--wide';
    if (img.tall) cls += ' gallery__item--tall';
    return '        <div class="' + cls + '" tabindex="0" role="button" onclick="openLightbox(this)" onkeydown="if(event.key===\'Enter\')openLightbox(this)">\n' +
      '          <img src="' + h(img.url) + '" loading="lazy" alt="' + h(img.alt) + '">\n' +
      '        </div>';
  }).join('\n');

  var igImages = gallery.social.instagramImages.map(function(img) {
    return '                    <img src="' + h(img.url) + '" loading="lazy" alt="' + h(img.alt) + '">';
  }).join('\n');

  var igSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#E4405F" style="vertical-align:middle;margin-right:0.5rem;"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>';

  return '\n  <!-- ========== GALLERY + SOCIAL FEED ========== -->\n' +
    '  <section class="gallery" id="gallery">\n' +
    '    <div class="container">\n' +
    '      <div class="gallery__header reveal">\n' +
    '        <div class="section-label">' + h(gallery.sectionLabel) + '</div>\n' +
    '        <h2 class="section-title">' + gallery.title + '</h2>\n' +
    '        <p class="section-subtitle">' + h(gallery.subtitle) + '</p>\n' +
    '      </div>\n' +
    '      <div class="gallery__grid reveal">\n' +
    images + '\n' +
    '      </div>\n' +
    '      <div class="social-feeds reveal" style="margin-top:3rem;">\n' +
    '        <div class="social-feeds__grid">\n' +
    '          <div class="social-feeds__item">\n' +
    '            <h3 class="social-feeds__title">\n' +
    '              ' + igSvg + '\n' +
    '              Instagram\n' +
    '            </h3>\n' +
    '            <div class="social-feeds__embed social-feeds__embed--ig">\n' +
    '              <a href="' + h(gallery.social.instagramUrl) + '" target="_blank" rel="noopener" class="social-feeds__ig-link">\n' +
    '                <div class="social-feeds__ig-card">\n' +
    '                  <div class="social-feeds__ig-header">\n' +
    '                    <div class="social-feeds__ig-avatar">NOA</div>\n' +
    '                    <div>\n' +
    '                      <strong>' + h(gallery.social.instagramHandle) + '</strong>\n' +
    '                      <span style="display:block;font-size:0.75rem;color:var(--gray-400);">' + h(gallery.social.instagramName) + '</span>\n' +
    '                    </div>\n' +
    '                  </div>\n' +
    '                  <div class="social-feeds__ig-grid">\n' +
    igImages + '\n' +
    '                  </div>\n' +
    '                  <div class="social-feeds__ig-cta">\u0391\u03BA\u03BF\u03BB\u03BF\u03CD\u03B8\u03B7\u03C3\u03AD \u03BC\u03B1\u03C2 \u03C3\u03C4\u03BF Instagram &rarr;</div>\n' +
    '                </div>\n' +
    '              </a>\n' +
    '            </div>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n\n' +
    '  <!-- Lightbox -->\n' +
    '  <div class="lightbox" id="lightbox" onclick="closeLightbox()">\n' +
    '    <button class="lightbox__close" onclick="event.stopPropagation(); closeLightbox()">&times;</button>\n' +
    '    <img id="lightboxImg" src="" alt="Gallery image" onclick="event.stopPropagation()">\n' +
    '  </div>\n';
}

// ========== MEMBERSHIP ==========
function _buildMembership(membership, h) {
  var tiers = membership.tiers.map(function(tier, i) {
    var featuredClass = tier.featured ? ' membership-card--featured' : '';
    var badge = tier.featured ? '<span class="membership-card__badge">\u0394\u0397\u039C\u039F\u03A6\u0399\u039B\u0395\u03A3</span>' : '';
    var featuresList = tier.features.map(function(f) {
      return '            <li>' + h(f) + '</li>';
    }).join('\n');

    return '        <div class="membership-card' + featuredClass + ' reveal reveal-delay-' + Math.min(i + 1, 6) + '">\n' +
      '          ' + badge + '\n' +
      '          <div class="membership-card__icon">' + tier.icon + '</div>\n' +
      '          <h3 class="membership-card__title">' + h(tier.title) + '</h3>\n' +
      '          <p class="membership-card__desc">' + h(tier.description) + '</p>\n' +
      '          <ul class="membership-card__features">\n' +
      featuresList + '\n' +
      '          </ul>\n' +
      '          <a href="' + h(tier.ctaHref) + '" class="btn btn--' + h(tier.ctaStyle) + '" style="width:100%;justify-content:center;">' + h(tier.ctaLabel) + '</a>\n' +
      '        </div>';
  }).join('\n');

  return '\n  <!-- ========== MEMBERSHIP ========== -->\n' +
    '  <section class="membership" id="membership">\n' +
    '    <div class="container">\n' +
    '      <div class="membership__header reveal">\n' +
    '        <div class="section-label" style="color: var(--gold);">' + h(membership.sectionLabel) + '</div>\n' +
    '        <h2 class="section-title section-title--light">' + membership.title + '</h2>\n' +
    '        <p class="section-subtitle section-subtitle--light">' + h(membership.subtitle) + '</p>\n' +
    '      </div>\n' +
    '      <div class="membership__grid">\n' +
    tiers + '\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n';
}

// ========== WEATHER & SPONSORS ==========
function _buildWeatherSponsors(weather, sponsors, h) {
  var sponsorItems = sponsors.items.map(function(item) {
    return '            <div class="sponsors__item">' + h(item.name) + '</div>';
  }).join('\n');

  return '\n  <!-- ========== WEATHER & SPONSORS ========== -->\n' +
    '  <section class="weather-sponsors" id="weather">\n' +
    '    <div class="container">\n' +
    '      <div class="weather-sponsors__grid">\n' +
    '        <div class="weather-widget reveal">\n' +
    '          <div class="weather-widget__header">\n' +
    '            <div class="weather-widget__icon">&#127774;</div>\n' +
    '            <div>\n' +
    '              <div class="weather-widget__title">' + h(weather.title) + '</div>\n' +
    '              <div class="weather-widget__location">' + h(weather.location) + '</div>\n' +
    '            </div>\n' +
    '          </div>\n' +
    '          <div class="weather-widget__data">\n' +
    '            <div>\n' +
    '              <div class="weather-widget__item-value" id="weatherTemp">' + h(weather.defaults.temp) + '</div>\n' +
    '              <div class="weather-widget__item-label">\u0398\u03B5\u03C1\u03BC\u03BF\u03BA\u03C1\u03B1\u03C3\u03AF\u03B1</div>\n' +
    '            </div>\n' +
    '            <div>\n' +
    '              <div class="weather-widget__item-value" id="weatherWind">' + h(weather.defaults.wind) + '</div>\n' +
    '              <div class="weather-widget__item-label">\u0386\u03BD\u03B5\u03BC\u03BF\u03C2</div>\n' +
    '            </div>\n' +
    '            <div>\n' +
    '              <div class="weather-widget__item-value" id="weatherSea">' + h(weather.defaults.sea) + '</div>\n' +
    '              <div class="weather-widget__item-label">\u039A\u03C5\u03BC\u03B1\u03C4\u03B9\u03C3\u03BC\u03CC\u03C2</div>\n' +
    '            </div>\n' +
    '          </div>\n' +
    '          <div class="weather-widget__note" id="weatherNote">\u03A6\u03BF\u03C1\u03C4\u03CE\u03BD\u03B5\u03B9 \u03B4\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03B1...</div>\n' +
    '        </div>\n' +
    '        <div class="reveal reveal-delay-2">\n' +
    '          <div class="sponsors__title">' + h(sponsors.title) + '</div>\n' +
    '          <div class="sponsors__grid">\n' +
    sponsorItems + '\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n';
}

// ========== FLOATING CTA ==========
function _buildFloatingCta(floatingCta, h) {
  return '\n  <div class="floating-cta">\n' +
    '    <div style="position:relative;">\n' +
    '      <a href="' + h(floatingCta.phone.href) + '" class="floating-cta__btn floating-cta__btn--phone" aria-label="Call">&#128222;</a>\n' +
    '      <span class="floating-cta__tooltip">' + h(floatingCta.phone.tooltip) + '</span>\n' +
    '    </div>\n' +
    '    <div style="position:relative;">\n' +
    '      <a href="' + h(floatingCta.email.href) + '" class="floating-cta__btn floating-cta__btn--email" aria-label="Email">&#9993;</a>\n' +
    '      <span class="floating-cta__tooltip">' + h(floatingCta.email.tooltip) + '</span>\n' +
    '    </div>\n' +
    '    <button class="floating-cta__btn floating-cta__btn--top" id="scrollTopBtn" onclick="window.scrollTo({top:0,behavior:\'smooth\'})" aria-label="Top">&#8593;</button>\n' +
    '  </div>\n';
}

// ========== FOOTER ==========
function _buildFooter(footer, h) {
  var svgFb = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
  var svgIg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>';
  var svgYt = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';

  var socialLinks = footer.socialLinks.map(function(s) {
    var svg = s.platform === 'facebook' ? svgFb : s.platform === 'instagram' ? svgIg : s.platform === 'youtube' ? svgYt : '';
    var label = s.platform.charAt(0).toUpperCase() + s.platform.slice(1);
    return '            <a href="' + h(s.url) + '" target="_blank" rel="noopener" aria-label="' + label + '">' + svg + '</a>';
  }).join('\n');

  var quickLinks = footer.quickLinks.map(function(l) {
    return '            <li><a href="' + h(l.href) + '">' + h(l.label) + '</a></li>';
  }).join('\n');

  var sportLinks = footer.sportLinks.map(function(l) {
    return '            <li><a href="' + h(l.href) + '">' + h(l.label) + '</a></li>';
  }).join('\n');

  var addressHtml = h(footer.contact.address).replace(/\n/g, '<br>');

  return '\n  <footer class="footer" id="contact">\n' +
    '    <div class="container">\n' +
    '      <div class="footer__grid">\n' +
    '        <div>\n' +
    '          <div class="footer__brand-name">' + h(footer.brandName) + '</div>\n' +
    '          <p class="footer__brand-desc">' + h(footer.brandDesc) + '</p>\n' +
    '          <div class="footer__social">\n' +
    socialLinks + '\n' +
    '          </div>\n' +
    '        </div>\n' +
    '        <div>\n' +
    '          <div class="footer__heading">\u03A3\u03CD\u03BD\u03B4\u03B5\u03C3\u03BC\u03BF\u03B9</div>\n' +
    '          <ul class="footer__links">\n' + quickLinks + '\n          </ul>\n' +
    '        </div>\n' +
    '        <div>\n' +
    '          <div class="footer__heading">\u0391\u03B8\u03BB\u03AE\u03BC\u03B1\u03C4\u03B1</div>\n' +
    '          <ul class="footer__links">\n' + sportLinks + '\n          </ul>\n' +
    '        </div>\n' +
    '        <div>\n' +
    '          <div class="footer__heading">\u0395\u03C0\u03B9\u03BA\u03BF\u03B9\u03BD\u03C9\u03BD\u03AF\u03B1</div>\n' +
    '          <div class="footer__contact-item">\n' +
    '            <div class="footer__contact-icon">&#128205;</div>\n' +
    '            <div class="footer__contact-text">' + addressHtml + '</div>\n' +
    '          </div>\n' +
    '          <div class="footer__contact-item">\n' +
    '            <div class="footer__contact-icon">&#128222;</div>\n' +
    '            <div class="footer__contact-text"><a href="' + h(footer.contact.phoneHref) + '">' + h(footer.contact.phone) + '</a></div>\n' +
    '          </div>\n' +
    '          <div class="footer__contact-item">\n' +
    '            <div class="footer__contact-icon">&#9993;</div>\n' +
    '            <div class="footer__contact-text"><a href="mailto:' + h(footer.contact.email) + '">' + h(footer.contact.email) + '</a></div>\n' +
    '          </div>\n' +
    '          <div class="footer__newsletter">\n' +
    '            <div class="footer__heading">Newsletter</div>\n' +
    '            <form class="footer__newsletter-form" onsubmit="event.preventDefault(); this.style.display=\'none\'; document.getElementById(\'newsletterSuccess\').style.display=\'block\';">\n' +
    '              <input type="email" class="footer__newsletter-input" placeholder="' + h(footer.newsletter.placeholder) + '" required>\n' +
    '              <button type="submit" class="footer__newsletter-btn">' + h(footer.newsletter.buttonText) + '</button>\n' +
    '            </form>\n' +
    '            <div id="newsletterSuccess" style="display:none; color:var(--teal-light); font-size:0.9rem; margin-top:0.5rem;">' + h(footer.newsletter.successMessage) + '</div>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '        <div class="footer__map">\n' +
    '          <iframe src="' + h(footer.mapEmbedUrl) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map"></iframe>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="footer__bottom">\n' +
    '        <div class="footer__copy">' + footer.copyrightText + '</div>\n' +
    '        <div class="footer__registry">' + footer.registryText + '</div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </footer>\n';
}

// ========== INLINE SCRIPT ==========
function _buildInlineScript(sports, weather) {
  var sportMapEntries = sports.quiz.options.map(function(opt, i) {
    var comma = i < sports.quiz.options.length - 1 ? ',' : '';
    return "      '" + opt.key + "': " + JSON.stringify(opt.result) + comma;
  }).join('\n');

  return '\n  <script>\n' +
    '    const hamburger = document.getElementById(\'hamburger\');\n' +
    '    const mobileMenu = document.getElementById(\'mobileMenu\');\n' +
    '    hamburger.addEventListener(\'click\', () => {\n' +
    '      hamburger.classList.toggle(\'active\');\n' +
    '      mobileMenu.classList.toggle(\'open\');\n' +
    '      document.body.style.overflow = mobileMenu.classList.contains(\'open\') ? \'hidden\' : \'\';\n' +
    '    });\n' +
    '    function closeMobile() { hamburger.classList.remove(\'active\'); mobileMenu.classList.remove(\'open\'); document.body.style.overflow = \'\'; }\n' +
    '    window.addEventListener(\'scroll\', () => {\n' +
    '      document.getElementById(\'header\').classList.toggle(\'scrolled\', window.scrollY > 60);\n' +
    '      const topBtn = document.getElementById(\'scrollTopBtn\');\n' +
    '      if (topBtn) topBtn.classList.toggle(\'visible\', window.scrollY > 600);\n' +
    '    });\n' +
    '    const revealObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add(\'visible\'); }); }, { threshold: 0.1, rootMargin: \'0px 0px -50px 0px\' });\n' +
    '    document.querySelectorAll(\'.reveal\').forEach(el => revealObserver.observe(el));\n' +
    '    function openLightbox(el) { const src = el.querySelector(\'img\').src; document.getElementById(\'lightboxImg\').src = src; document.getElementById(\'lightbox\').classList.add(\'active\'); document.body.style.overflow = \'hidden\'; }\n' +
    '    function closeLightbox() { document.getElementById(\'lightbox\').classList.remove(\'active\'); document.body.style.overflow = \'\'; }\n' +
    '    document.addEventListener(\'keydown\', (e) => { if (e.key === \'Escape\') closeLightbox(); });\n' +
    '    const heroVideo = document.getElementById(\'heroVideo\');\n' +
    '    const heroVideoSource = document.getElementById(\'heroVideoSource\');\n' +
    '    if (heroVideo && heroVideoSource) {\n' +
    '      heroVideoSource.addEventListener(\'error\', () => { heroVideo.style.display = \'none\'; const f = document.querySelector(\'.hero__bg-fallback\'); if (f) f.style.display = \'block\'; });\n' +
    '      heroVideo.addEventListener(\'error\', () => { heroVideo.style.display = \'none\'; const f = document.querySelector(\'.hero__bg-fallback\'); if (f) f.style.display = \'block\'; });\n' +
    '    }\n' +
    '    const sportMap = {\n' +
    sportMapEntries + '\n' +
    '    };\n' +
    '    function pickSport(el, key) { document.querySelectorAll(\'.sport-quiz__option\').forEach(o => o.classList.remove(\'active\')); el.classList.add(\'active\'); document.getElementById(\'quizResult\').innerHTML = sportMap[key]; }\n' +
    '    function animateCounters() {\n' +
    '      document.querySelectorAll(\'.hero__stat-number\').forEach(el => {\n' +
    '        const text = el.textContent.trim();\n' +
    '        const match = text.match(/^([^0-9]*)(\\d+)([^0-9]*)$/);\n' +
    '        if (!match) return;\n' +
    '        const prefix = match[1], target = parseInt(match[2]), suffix = match[3];\n' +
    '        let current = 0; const increment = Math.max(1, Math.floor(target / 40));\n' +
    '        const timer = setInterval(() => { current += increment; if (current >= target) { current = target; clearInterval(timer); } el.textContent = prefix + current + suffix; }, 30);\n' +
    '      });\n' +
    '    }\n' +
    '    const statsObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { animateCounters(); statsObserver.disconnect(); } }); }, { threshold: 0.5 });\n' +
    '    const heroStats = document.querySelector(\'.hero__stats\');\n' +
    '    if (heroStats) statsObserver.observe(heroStats);\n' +
    '    async function fetchWeather() {\n' +
    '      try {\n' +
    '        const res = await fetch(\'https://api.open-meteo.com/v1/forecast?latitude=' + weather.lat + '&longitude=' + weather.lng + '&current=temperature_2m,wind_speed_10m,wind_direction_10m&hourly=wave_height&forecast_days=1&timezone=Europe%2FAthens\');\n' +
    '        const data = await res.json();\n' +
    '        const temp = Math.round(data.current.temperature_2m);\n' +
    '        const windKn = Math.round(data.current.wind_speed_10m * 0.539957);\n' +
    '        const windDir = data.current.wind_direction_10m;\n' +
    '        const waveHeight = data.hourly.wave_height ? data.hourly.wave_height[0] : null;\n' +
    '        document.getElementById(\'weatherTemp\').textContent = temp + \'\\u00B0C\';\n' +
    '        document.getElementById(\'weatherWind\').textContent = windKn + \'kn\';\n' +
    '        if (waveHeight !== null) document.getElementById(\'weatherSea\').textContent = waveHeight + \'m\';\n' +
    '        const dirs = [\'B\',\'BA\',\'A\',\'NA\',\'N\',\'N\\u0394\',\'\\u0394\',\'B\\u0394\'];\n' +
    '        document.getElementById(\'weatherNote\').textContent = \'Live \\u2014 \\u0386\\u03BD\\u03B5\\u03BC\\u03BF\\u03C2: \' + dirs[Math.round(windDir/45)%8] + \' \' + windKn + \'kn \\u2014 \\u0395\\u03BD\\u03B7\\u03BC\\u03B5\\u03C1\\u03CE\\u03B8\\u03B7\\u03BA\\u03B5 \\u03C4\\u03CE\\u03C1\\u03B1\';\n' +
    '      } catch(e) { document.getElementById(\'weatherNote\').textContent = \'\\u0395\\u03BD\\u03B4\\u03B5\\u03B9\\u03BA\\u03C4\\u03B9\\u03BA\\u03AD\\u03C2 \\u03C4\\u03B9\\u03BC\\u03AD\\u03C2 \\u2014 API \\u03BC\\u03B7 \\u03B4\\u03B9\\u03B1\\u03B8\\u03AD\\u03C3\\u03B9\\u03BC\\u03BF\'; }\n' +
    '    }\n' +
    '    fetchWeather();\n' +
    '  </' + 'script>\n';
}

// ========== COOKIE CONSENT ==========
function _buildCookieConsent() {
  return '\n  <div class="cookie-consent" id="cookieConsent" style="display:none;">\n' +
    '    <p>\u03A7\u03C1\u03B7\u03C3\u03B9\u03BC\u03BF\u03C0\u03BF\u03B9\u03BF\u03CD\u03BC\u03B5 cookies \u03B3\u03B9\u03B1 \u03C4\u03B7 \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03C4\u03BF\u03C5 \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF\u03C5 (Google Maps, Fonts). <a href="mailto:info@noalimou.gr?subject=Privacy">\u03A0\u03BF\u03BB\u03B9\u03C4\u03B9\u03BA\u03AE \u0391\u03C0\u03BF\u03C1\u03C1\u03AE\u03C4\u03BF\u03C5</a></p>\n' +
    '    <button class="cookie-consent__btn" onclick="document.getElementById(\'cookieConsent\').style.display=\'none\'; localStorage.setItem(\'noa_cookies\',\'1\');">\u0391\u03C0\u03BF\u03B4\u03BF\u03C7\u03AE</button>\n' +
    '  </div>\n' +
    '  <script>if(!localStorage.getItem(\'noa_cookies\')){document.getElementById(\'cookieConsent\').style.display=\'\';}</' + 'script>\n';
}
