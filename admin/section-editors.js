/**
 * section-editors.js
 * Renders HTML editor forms for each site section.
 * All user values are escaped via e() before insertion into HTML attributes/content.
 */

function renderSectionEditor(sectionKey, sectionData, allData) {
  // --- HTML escape helper ---
  function e(val) {
    if (val === null || val === undefined) return '';
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  var s = sectionData || {};

  // --- Reusable sub-renderers ---

  function fieldGroup(label, fieldName, value, opts) {
    opts = opts || {};
    var tag = opts.textarea ? 'textarea' : 'input';
    var rows = opts.rows || 3;
    var hint = opts.hint ? '<div class="form__hint">' + opts.hint + '</div>' : '';
    var style = opts.style ? ' style="' + e(opts.style) + '"' : '';
    var placeholder = opts.placeholder ? ' placeholder="' + e(opts.placeholder) + '"' : '';
    var dataAttr = '';
    if (opts.dataArray) {
      dataAttr = ' data-array="' + e(opts.dataArray) + '" data-index="' + opts.dataIndex + '" data-key="' + e(opts.dataKey) + '"';
    } else if (opts.dataNestedArray) {
      dataAttr = ' data-nested="' + e(opts.dataNested) + '" data-nestedarray="' + e(opts.dataNestedArray) + '" data-index="' + opts.dataIndex + '" data-key="' + e(opts.dataKey) + '"';
    } else if (opts.dataObjArray) {
      dataAttr = ' data-object="' + e(opts.dataObject) + '" data-objarray="' + e(opts.dataObjArray) + '" data-index="' + opts.dataIndex + '" data-key="' + e(opts.dataKey) + '"';
    } else if (opts.dataNested) {
      dataAttr = ' data-nested="' + e(opts.dataNested) + '" data-key="' + e(opts.dataKey) + '"';
    } else if (opts.dataObject) {
      dataAttr = ' data-object="' + e(opts.dataObject) + '" data-key="' + e(opts.dataKey) + '"';
    } else {
      dataAttr = ' data-field="' + e(fieldName) + '"';
    }
    var onchange = opts.onchange ? ' onchange="' + e(opts.onchange) + '"' : '';

    if (tag === 'textarea') {
      return '<div class="form__group">' +
        '<label class="form__label">' + label + '</label>' +
        hint +
        '<textarea class="form__textarea"' + dataAttr + ' rows="' + rows + '"' + style + placeholder + onchange + '>' + e(value) + '</textarea>' +
        '</div>';
    }
    return '<div class="form__group">' +
      '<label class="form__label">' + label + '</label>' +
      hint +
      '<input class="form__input" type="text"' + dataAttr + ' value="' + e(value) + '"' + style + placeholder + onchange + '>' +
      '</div>';
  }

  function selectGroup(label, options, selectedVal, opts) {
    opts = opts || {};
    var dataAttr = '';
    if (opts.dataArray) {
      dataAttr = ' data-array="' + e(opts.dataArray) + '" data-index="' + opts.dataIndex + '" data-key="' + e(opts.dataKey) + '"';
    } else if (opts.dataField) {
      dataAttr = ' data-field="' + e(opts.dataField) + '"';
    }
    var optionsHtml = options.map(function(o) {
      var sel = (String(o.value) === String(selectedVal)) ? ' selected' : '';
      return '<option value="' + e(o.value) + '"' + sel + '>' + e(o.label) + '</option>';
    }).join('');
    return '<div class="form__group">' +
      '<label class="form__label">' + label + '</label>' +
      '<select class="form__select"' + dataAttr + '>' + optionsHtml + '</select>' +
      '</div>';
  }

  function imageGroup(label, value, previewId, fieldName, opts) {
    opts = opts || {};
    var dataAttr = '';
    if (opts.dataArray) {
      dataAttr = ' data-array="' + e(opts.dataArray) + '" data-index="' + opts.dataIndex + '" data-key="' + e(opts.dataKey) + '"';
    } else if (opts.dataNestedArray) {
      dataAttr = ' data-nested="' + e(opts.dataNested) + '" data-nestedarray="' + e(opts.dataNestedArray) + '" data-index="' + opts.dataIndex + '" data-key="' + e(opts.dataKey) + '"';
    } else {
      dataAttr = ' data-field="' + e(fieldName) + '"';
    }
    var previewContent = value ? '<img src="' + e(value) + '" alt="Preview">' : '\u03A7\u03C9\u03C1\u03AF\u03C2 \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1';
    var uploadFieldRef = opts.dataArray ? 'null' : "'" + e(fieldName) + "'";
    return '<div class="form__group">' +
      '<label class="form__label">' + label + '</label>' +
      '<div class="form__image-wrap">' +
        '<div class="form__image-preview" id="preview_' + e(previewId) + '">' + previewContent + '</div>' +
        '<div class="form__image-inputs">' +
          '<input class="form__input" type="text"' + dataAttr + ' value="' + e(value) + '" onchange="updateImagePreview(\'' + e(previewId) + '\', this.value)">' +
          '<label class="form__upload-btn">' +
            '\uD83D\uDCC1 \u0391\u03BD\u03AD\u03B2\u03B1\u03C3\u03BC\u03B1' +
            '<input type="file" class="form__upload-input" accept="image/*" onchange="handleImageUpload(this, \'' + e(previewId) + '\')">' +
          '</label>' +
        '</div>' +
      '</div>' +
      '</div>';
  }

  function arrayHeader(title, opts) {
    opts = opts || {};
    var moveButtons = opts.noMove ? '' :
      '<button type="button" class="form__array-btn" onclick="event.stopPropagation(); moveArrayItem(this, -1)">\u2191</button>' +
      '<button type="button" class="form__array-btn" onclick="event.stopPropagation(); moveArrayItem(this, 1)">\u2193</button>';
    return '<div class="form__array-header" onclick="toggleArrayItem(this)">' +
      '<span class="form__array-header-title">' + e(title) + '</span>' +
      '<div class="form__array-header-actions">' +
        moveButtons +
        '<button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)">\uD83D\uDDD1</button>' +
        '<span class="form__array-toggle">\u25BC</span>' +
      '</div>' +
    '</div>';
  }

  function saveButton() {
    return '<div class="form__actions">' +
      '<button type="button" class="form__save-btn" onclick="saveSectionData(\'' + e(sectionKey) + '\')">Αποθήκευση</button>' +
    '</div>';
  }

  // ====================================================================
  // SECTION RENDERERS
  // ====================================================================

  var renderers = {};

  // ---- 1. HERO ----
  renderers.hero = function() {
    var html = '';

    // Texts
    html += '<div class="form"><h3 style="margin-bottom:1rem;">Κείμενα</h3>';
    html += fieldGroup('Badge (\u03C0\u03AC\u03BD\u03C9 \u03B1\u03C0\u03CC \u03C4\u03BF\u03BD \u03C4\u03AF\u03C4\u03BB\u03BF)', 'badgeText', s.badgeText);
    html += '<div class="form__row">';
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2 \u2014 \u0393\u03C1\u03B1\u03BC\u03BC\u03AE 1', 'titleLine1', s.titleLine1);
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2 \u2014 Accent (\u03C7\u03C1\u03C5\u03C3\u03CC)', 'titleAccent', s.titleAccent);
    html += '</div>';
    html += fieldGroup('\u03A5\u03C0\u03CC\u03C4\u03B9\u03C4\u03BB\u03BF\u03C2', 'subtitle', s.subtitle, { textarea: true, rows: 3 });
    html += '</div>';

    // Background
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u03A6\u03CC\u03BD\u03C4\u03BF</h3>';
    html += fieldGroup('URL Video (MP4)', 'bgVideoUrl', s.bgVideoUrl, { hint: '\u0391\u03C6\u03AE\u03C3\u03C4\u03B5 \u03BA\u03B5\u03BD\u03CC \u03B1\u03BD \u03B4\u03B5\u03BD \u03B8\u03AD\u03BB\u03B5\u03C4\u03B5 video \u2014 \u03B8\u03B1 \u03B5\u03BC\u03C6\u03B1\u03BD\u03B9\u03C3\u03C4\u03B5\u03AF \u03B7 \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1' });
    html += imageGroup('URL \u0395\u03B9\u03BA\u03CC\u03BD\u03B1\u03C2 (fallback / poster)', s.bgImageUrl, 'bgImage', 'bgImageUrl');
    html += fieldGroup('Alt text \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1\u03C2', 'bgImageAlt', s.bgImageAlt);
    html += '</div>';

    // Actions
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u039A\u03BF\u03C5\u03BC\u03C0\u03B9\u03AC (Actions)</h3>';
    html += '<div class="form__array" id="actionsArray">';
    (s.actions || []).forEach(function(action, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader('\u039A\u03BF\u03C5\u03BC\u03C0\u03AF: ' + (action.label || ''), { noMove: true });
      html += '<div class="form__array-body">';
      html += '<div class="form__row--3" style="display:grid; grid-template-columns:1fr 1fr auto; gap:0.75rem;">';
      html += fieldGroup('\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF', null, action.label, { dataArray: 'actions', dataIndex: i, dataKey: 'label' });
      html += fieldGroup('Link (href)', null, action.href, { dataArray: 'actions', dataIndex: i, dataKey: 'href' });
      html += selectGroup('\u03A3\u03C4\u03C5\u03BB', [
        { value: 'primary', label: 'Primary' },
        { value: 'outline', label: 'Outline' },
        { value: 'gold', label: 'Gold' }
      ], action.style, { dataArray: 'actions', dataIndex: i, dataKey: 'style' });
      html += '</div></div></div>';
    });
    html += '</div></div>';

    // Stats
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u03A3\u03C4\u03B1\u03C4\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC (Stats)</h3>';
    html += '<div class="form__array" id="statsArray">';
    (s.stats || []).forEach(function(stat, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader((stat.value || '') + ' \u2014 ' + (stat.label || ''), { noMove: true });
      html += '<div class="form__array-body"><div class="form__row">';
      html += fieldGroup('\u03A4\u03B9\u03BC\u03AE', null, stat.value, { dataArray: 'stats', dataIndex: i, dataKey: 'value' });
      html += fieldGroup('\u0395\u03C4\u03B9\u03BA\u03AD\u03C4\u03B1', null, stat.label, { dataArray: 'stats', dataIndex: i, dataKey: 'label' });
      html += '</div></div></div>';
    });
    html += '</div></div>';

    html += saveButton();
    return html;
  };

  // ---- 2. ABOUT ----
  renderers.about = function() {
    var html = '';

    // Header
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0395\u03C0\u03B9\u03BA\u03B5\u03C6\u03B1\u03BB\u03AF\u03B4\u03B1</h3>';
    html += fieldGroup('\u0395\u03C4\u03B9\u03BA\u03AD\u03C4\u03B1 \u03B5\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2', 'sectionLabel', s.sectionLabel);
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2', 'title', s.title, { hint: '\u03A7\u03C1\u03AE\u03C3\u03B7 &lt;br&gt; \u03B3\u03B9\u03B1 \u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE\u03C2' });
    html += fieldGroup('\u03A0\u03B5\u03C1\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE', 'description', s.description, { textarea: true, rows: 4 });
    html += '</div>';

    // Image
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0395\u03B9\u03BA\u03CC\u03BD\u03B1</h3>';
    html += imageGroup('\u0395\u03B9\u03BA\u03CC\u03BD\u03B1 \u03B5\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2', s.imageUrl, 'aboutImage', 'imageUrl');
    html += fieldGroup('Alt \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1\u03C2', 'imageAlt', s.imageAlt);
    html += '</div>';

    // Values
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0391\u03BE\u03AF\u03B5\u03C2 (4 \u03BA\u03AC\u03C1\u03C4\u03B5\u03C2)</h3>';
    html += '<div class="form__array" id="valuesArray">';
    (s.values || []).forEach(function(val, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader((val.icon || '') + ' ' + (val.title || ''));
      html += '<div class="form__array-body">';
      html += '<div class="form__row" style="grid-template-columns:80px 1fr 1fr;">';
      html += fieldGroup('\u0395\u03B9\u03BA\u03BF\u03BD\u03AF\u03B4\u03B9\u03BF', null, val.icon, { dataArray: 'values', dataIndex: i, dataKey: 'icon', style: 'font-size:1.5rem; text-align:center;' });
      html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2', null, val.title, { dataArray: 'values', dataIndex: i, dataKey: 'title' });
      html += fieldGroup('\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF', null, val.text, { dataArray: 'values', dataIndex: i, dataKey: 'text' });
      html += '</div></div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'about\', \'values\')">+ \u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u0391\u03BE\u03AF\u03B1\u03C2</button>';
    html += '</div>';

    html += saveButton();
    return html;
  };

  // ---- 3. SPORTS ----
  renderers.sports = function() {
    var html = '';

    // Header
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0395\u03C0\u03B9\u03BA\u03B5\u03C6\u03B1\u03BB\u03AF\u03B4\u03B1</h3>';
    html += fieldGroup('\u0395\u03C4\u03B9\u03BA\u03AD\u03C4\u03B1 \u03B5\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2', 'sectionLabel', s.sectionLabel);
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2', 'title', s.title, { hint: '\u03A7\u03C1\u03AE\u03C3\u03B7 &lt;br&gt; \u03B3\u03B9\u03B1 \u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE\u03C2' });
    html += fieldGroup('\u03A5\u03C0\u03CC\u03C4\u03B9\u03C4\u03BB\u03BF\u03C2', 'subtitle', s.subtitle, { textarea: true, rows: 2 });
    html += '</div>';

    // Cards
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u039A\u03AC\u03C1\u03C4\u03B5\u03C2 \u0391\u03B8\u03BB\u03B7\u03BC\u03AC\u03C4\u03C9\u03BD</h3>';
    html += '<div class="form__array" id="cardsArray">';
    (s.cards || []).forEach(function(card, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader((card.icon || '') + ' ' + (card.name || ''));
      html += '<div class="form__array-body">';
      html += '<div class="form__row">';
      html += fieldGroup('\u038C\u03BD\u03BF\u03BC\u03B1 \u03B1\u03B8\u03BB\u03AE\u03BC\u03B1\u03C4\u03BF\u03C2', null, card.name, { dataArray: 'cards', dataIndex: i, dataKey: 'name' });
      html += fieldGroup('\u0395\u03B9\u03BA\u03BF\u03BD\u03AF\u03B4\u03B9\u03BF (emoji)', null, card.icon, { dataArray: 'cards', dataIndex: i, dataKey: 'icon', style: 'font-size:1.5rem;' });
      html += '</div>';
      html += fieldGroup('\u03A0\u03B5\u03C1\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE', null, card.description, { textarea: true, rows: 2, dataArray: 'cards', dataIndex: i, dataKey: 'description' });
      html += imageGroup('\u0395\u03B9\u03BA\u03CC\u03BD\u03B1', card.imageUrl, 'sport_' + i, null, { dataArray: 'cards', dataIndex: i, dataKey: 'imageUrl' });
      html += '<div class="form__row">';
      html += fieldGroup('Alt \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1\u03C2', null, card.imageAlt, { dataArray: 'cards', dataIndex: i, dataKey: 'imageAlt' });
      html += fieldGroup('\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF \u03C3\u03C5\u03BD\u03B4\u03AD\u03C3\u03BC\u03BF\u03C5', null, card.linkText, { dataArray: 'cards', dataIndex: i, dataKey: 'linkText' });
      html += '</div>';
      html += '</div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'sports\', \'cards\')">+ \u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u0391\u03B8\u03BB\u03AE\u03BC\u03B1\u03C4\u03BF\u03C2</button>';
    html += '</div>';

    // Quiz
    html += '<div class="form"><h3 style="margin-bottom:1rem;">Quiz \u2014 \u03A0\u03BF\u03B9\u03BF \u03AC\u03B8\u03BB\u03B7\u03BC\u03B1 \u03C3\u03BF\u03C5 \u03C4\u03B1\u03B9\u03C1\u03B9\u03AC\u03B6\u03B5\u03B9;</h3>';
    var quiz = s.quiz || {};
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2 quiz', null, quiz.title, { dataObject: 'quiz', dataKey: 'title' });
    html += fieldGroup('\u03A5\u03C0\u03CC\u03C4\u03B9\u03C4\u03BB\u03BF\u03C2 quiz', null, quiz.subtitle, { dataObject: 'quiz', dataKey: 'subtitle' });
    html += '<div class="form__array" id="quizOptionsArray">';
    (quiz.options || []).forEach(function(opt, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader((opt.label || '') + ' \u2192 ' + (opt.key || ''), { noMove: true });
      html += '<div class="form__array-body">';
      html += '<div class="form__row" style="grid-template-columns:120px 120px 1fr;">';
      html += fieldGroup('\u0395\u03C4\u03B9\u03BA\u03AD\u03C4\u03B1', null, opt.label, { dataObject: 'quiz', dataObjArray: 'options', dataIndex: i, dataKey: 'label' });
      html += fieldGroup('Key', null, opt.key, { dataObject: 'quiz', dataObjArray: 'options', dataIndex: i, dataKey: 'key' });
      html += fieldGroup('\u0391\u03C0\u03BF\u03C4\u03AD\u03BB\u03B5\u03C3\u03BC\u03B1', null, opt.result, { dataObject: 'quiz', dataObjArray: 'options', dataIndex: i, dataKey: 'result' });
      html += '</div></div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'sports\', \'quizOptions\')">+ \u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE\u03C2</button>';
    html += '</div>';

    html += saveButton();
    return html;
  };

  // ---- 4. ACADEMY ----
  renderers.academy = function() {
    var html = '';

    // Header
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0395\u03C0\u03B9\u03BA\u03B5\u03C6\u03B1\u03BB\u03AF\u03B4\u03B1</h3>';
    html += fieldGroup('\u0395\u03C4\u03B9\u03BA\u03AD\u03C4\u03B1 \u03B5\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2', 'sectionLabel', s.sectionLabel);
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2', 'title', s.title, { hint: '\u03A7\u03C1\u03AE\u03C3\u03B7 &lt;br&gt; \u03B3\u03B9\u03B1 \u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE\u03C2' });
    html += fieldGroup('\u03A5\u03C0\u03CC\u03C4\u03B9\u03C4\u03BB\u03BF\u03C2', 'subtitle', s.subtitle, { textarea: true, rows: 3 });
    html += '</div>';

    // Image & CTA
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0395\u03B9\u03BA\u03CC\u03BD\u03B1 & CTA</h3>';
    html += imageGroup('\u0395\u03B9\u03BA\u03CC\u03BD\u03B1', s.imageUrl, 'academyImg', 'imageUrl');
    html += fieldGroup('Alt \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1\u03C2', 'imageAlt', s.imageAlt);
    html += '<div class="form__row">';
    html += fieldGroup('\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF CTA', 'ctaLabel', s.ctaLabel);
    html += fieldGroup('URL CTA', 'ctaHref', s.ctaHref);
    html += '</div></div>';

    // Steps
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0392\u03AE\u03BC\u03B1\u03C4\u03B1 \u0391\u03BA\u03B1\u03B4\u03B7\u03BC\u03AF\u03B1\u03C2</h3>';
    html += '<div class="form__array" id="stepsArray">';
    (s.steps || []).forEach(function(step, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader('\u0392\u03AE\u03BC\u03B1 ' + (step.number || '') + ': ' + (step.title || ''));
      html += '<div class="form__array-body">';
      html += '<div class="form__row" style="grid-template-columns:60px 1fr 120px;">';
      html += fieldGroup('\u0391\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2', null, step.number, { dataArray: 'steps', dataIndex: i, dataKey: 'number' });
      html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2', null, step.title, { dataArray: 'steps', dataIndex: i, dataKey: 'title' });
      html += selectGroup('Badge class', [
        { value: 'beginner', label: '\u0391\u03C1\u03C7\u03AC\u03C1\u03B9\u03BF\u03B9' },
        { value: 'intermediate', label: '\u039C\u03AD\u03C3\u03BF\u03B9' },
        { value: 'advanced', label: '\u03A0\u03C1\u03BF\u03C7\u03C9\u03C1\u03B7\u03BC\u03AD\u03BD\u03BF\u03B9' }
      ], step.badgeClass, { dataArray: 'steps', dataIndex: i, dataKey: 'badgeClass' });
      html += '</div>';
      html += fieldGroup('Badge \u03BA\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF', null, step.badgeText, { dataArray: 'steps', dataIndex: i, dataKey: 'badgeText' });
      html += fieldGroup('\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF', null, step.text, { textarea: true, rows: 2, dataArray: 'steps', dataIndex: i, dataKey: 'text' });
      html += '</div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'academy\', \'steps\')">+ \u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u0392\u03AE\u03BC\u03B1\u03C4\u03BF\u03C2</button>';
    html += '</div>';

    html += saveButton();
    return html;
  };

  // ---- 5. CAMP ----
  renderers.camp = function() {
    var html = '';

    // Texts
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03B1</h3>';
    html += fieldGroup('\u0395\u03B9\u03BA\u03BF\u03BD\u03AF\u03B4\u03B9\u03BF', 'icon', s.icon, { style: 'font-size:1.5rem; width:80px;' });
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2', 'title', s.title, { hint: '\u03A7\u03C1\u03AE\u03C3\u03B7 &lt;br&gt; \u03B3\u03B9\u03B1 \u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE\u03C2' });
    html += fieldGroup('\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF', 'text', s.text, { textarea: true, rows: 3 });
    html += '</div>';

    // Background
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u03A6\u03CC\u03BD\u03C4\u03BF</h3>';
    html += imageGroup('\u0395\u03B9\u03BA\u03CC\u03BD\u03B1 \u03C6\u03CC\u03BD\u03C4\u03BF\u03C5', s.bgImageUrl, 'campBg', 'bgImageUrl');
    html += fieldGroup('Alt \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1\u03C2', 'bgImageAlt', s.bgImageAlt);
    html += '</div>';

    // Features
    html += '<div class="form"><h3 style="margin-bottom:1rem;">Features (\u03B1\u03B8\u03BB\u03AE\u03BC\u03B1\u03C4\u03B1)</h3>';
    html += '<div class="form__array" id="featuresArray">';
    (s.features || []).forEach(function(feat, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader((feat.icon || '') + ' ' + (feat.label || ''), { noMove: true });
      html += '<div class="form__array-body"><div class="form__row">';
      html += fieldGroup('\u0395\u03B9\u03BA\u03BF\u03BD\u03AF\u03B4\u03B9\u03BF', null, feat.icon, { dataArray: 'features', dataIndex: i, dataKey: 'icon', style: 'font-size:1.5rem;' });
      html += fieldGroup('\u0395\u03C4\u03B9\u03BA\u03AD\u03C4\u03B1', null, feat.label, { dataArray: 'features', dataIndex: i, dataKey: 'label' });
      html += '</div></div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'camp\', \'features\')">+ \u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 Feature</button>';
    html += '</div>';

    // CTA
    html += '<div class="form"><h3 style="margin-bottom:1rem;">CTA \u039A\u03BF\u03C5\u03BC\u03C0\u03AF</h3>';
    html += '<div class="form__row">';
    html += fieldGroup('\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF \u03BA\u03BF\u03C5\u03BC\u03C0\u03B9\u03BF\u03CD', 'ctaLabel', s.ctaLabel);
    html += fieldGroup('URL \u03BA\u03BF\u03C5\u03BC\u03C0\u03B9\u03BF\u03CD', 'ctaHref', s.ctaHref);
    html += '</div></div>';

    html += saveButton();
    return html;
  };

  // ---- 6. EVENTS ----
  renderers.events = function() {
    var html = '';

    // Header
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0395\u03C0\u03B9\u03BA\u03B5\u03C6\u03B1\u03BB\u03AF\u03B4\u03B1</h3>';
    html += fieldGroup('\u0395\u03C4\u03B9\u03BA\u03AD\u03C4\u03B1 \u03B5\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2', 'sectionLabel', s.sectionLabel);
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2', 'title', s.title, { hint: '\u03A7\u03C1\u03AE\u03C3\u03B7 &lt;br&gt; \u03B3\u03B9\u03B1 \u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE\u03C2' });
    html += fieldGroup('\u03A5\u03C0\u03CC\u03C4\u03B9\u03C4\u03BB\u03BF\u03C2', 'subtitle', s.subtitle, { textarea: true, rows: 2 });
    html += '</div>';

    // Cards
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0395\u03BA\u03B4\u03B7\u03BB\u03CE\u03C3\u03B5\u03B9\u03C2 / \u0391\u03B3\u03CE\u03BD\u03B5\u03C2</h3>';
    html += '<div class="form__array" id="cardsArray">';
    (s.cards || []).forEach(function(card, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader((card.dateDay || '') + '/' + (card.dateMonth || '') + ' \u2014 ' + (card.title || ''));
      html += '<div class="form__array-body">';
      html += '<div class="form__row" style="grid-template-columns:80px 80px 1fr;">';
      html += fieldGroup('\u0397\u03BC\u03AD\u03C1\u03B1', null, card.dateDay, { dataArray: 'cards', dataIndex: i, dataKey: 'dateDay', placeholder: '06' });
      html += fieldGroup('\u039C\u03AE\u03BD\u03B1\u03C2', null, card.dateMonth, { dataArray: 'cards', dataIndex: i, dataKey: 'dateMonth', placeholder: '\u039F\u03BA\u03C4' });
      html += fieldGroup('\u039A\u03B1\u03C4\u03B7\u03B3\u03BF\u03C1\u03AF\u03B1', null, card.category, { dataArray: 'cards', dataIndex: i, dataKey: 'category', placeholder: '\u03C0.\u03C7. Windsurf, \u0399\u03C3\u03C4\u03B9\u03BF\u03C0\u03BB\u03BF\u0390\u03B1' });
      html += '</div>';
      html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2 \u03B5\u03BA\u03B4\u03AE\u03BB\u03C9\u03C3\u03B7\u03C2', null, card.title, { dataArray: 'cards', dataIndex: i, dataKey: 'title' });
      html += fieldGroup('\u03A0\u03B5\u03C1\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE', null, card.description, { textarea: true, rows: 2, dataArray: 'cards', dataIndex: i, dataKey: 'description' });
      html += '<div class="form__row">';
      html += fieldGroup('Tag \u03BA\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF', null, card.tagText, { dataArray: 'cards', dataIndex: i, dataKey: 'tagText' });
      html += selectGroup('Tag \u03C7\u03C1\u03CE\u03BC\u03B1', [
        { value: 'sailing', label: '\u0399\u03C3\u03C4\u03B9\u03BF\u03C0\u03BB\u03BF\u0390\u03B1 (\u03BC\u03C0\u03BB\u03B5)' },
        { value: 'windsurf', label: 'Windsurf (\u03C0\u03BF\u03C1\u03C4\u03BF\u03BA\u03B1\u03BB\u03AF)' },
        { value: 'general', label: '\u0393\u03B5\u03BD\u03B9\u03BA\u03CC (\u03BC\u03C9\u03B2)' }
      ], card.tagClass, { dataArray: 'cards', dataIndex: i, dataKey: 'tagClass' });
      html += '</div>';
      html += '</div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'events\', \'cards\')">+ \u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u0395\u03BA\u03B4\u03AE\u03BB\u03C9\u03C3\u03B7\u03C2</button>';
    html += '</div>';

    html += saveButton();
    return html;
  };

  // ---- 7. NEWS ----
  renderers.news = function() {
    var html = '';

    // Header
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0395\u03C0\u03B9\u03BA\u03B5\u03C6\u03B1\u03BB\u03AF\u03B4\u03B1</h3>';
    html += fieldGroup('\u0395\u03C4\u03B9\u03BA\u03AD\u03C4\u03B1 \u03B5\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2', 'sectionLabel', s.sectionLabel);
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2', 'title', s.title);
    html += '<div class="form__row">';
    html += fieldGroup('\u039A\u03BF\u03C5\u03BC\u03C0\u03AF \u00AB\u038C\u03BB\u03B1 \u03C4\u03B1 \u039D\u03AD\u03B1\u00BB \u2014 \u03BA\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF', 'allNewsLabel', s.allNewsLabel);
    html += fieldGroup('\u039A\u03BF\u03C5\u03BC\u03C0\u03AF \u00AB\u038C\u03BB\u03B1 \u03C4\u03B1 \u039D\u03AD\u03B1\u00BB \u2014 URL', 'allNewsUrl', s.allNewsUrl);
    html += '</div></div>';

    // Cards
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0386\u03C1\u03B8\u03C1\u03B1 / \u039D\u03AD\u03B1</h3>';
    html += '<div class="form__array" id="cardsArray">';
    (s.cards || []).forEach(function(card, i) {
      var titlePreview = (card.title || '').length > 40 ? (card.title || '').substring(0, 40) + '...' : (card.title || '');
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader((card.date || '') + ' \u2014 ' + titlePreview);
      html += '<div class="form__array-body">';
      html += imageGroup('\u0395\u03B9\u03BA\u03CC\u03BD\u03B1 URL', card.imageUrl, 'card_' + i + '_image', null, { dataArray: 'cards', dataIndex: i, dataKey: 'imageUrl' });
      html += fieldGroup('Alt \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1\u03C2', null, card.imageAlt, { dataArray: 'cards', dataIndex: i, dataKey: 'imageAlt' });
      html += fieldGroup('\u0397\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1', null, card.date, { dataArray: 'cards', dataIndex: i, dataKey: 'date', placeholder: '\u03C0.\u03C7. 6 \u039F\u03BA\u03C4\u03C9\u03B2\u03C1\u03AF\u03BF\u03C5 2025' });
      html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2', null, card.title, { dataArray: 'cards', dataIndex: i, dataKey: 'title' });
      html += fieldGroup('\u03A0\u03B5\u03C1\u03AF\u03BB\u03B7\u03C8\u03B7', null, card.excerpt, { textarea: true, rows: 3, dataArray: 'cards', dataIndex: i, dataKey: 'excerpt' });
      html += '<div class="form__row">';
      html += fieldGroup('URL \u03C3\u03C5\u03BD\u03B4\u03AD\u03C3\u03BC\u03BF\u03C5', null, card.linkUrl, { dataArray: 'cards', dataIndex: i, dataKey: 'linkUrl' });
      html += fieldGroup('\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF \u03C3\u03C5\u03BD\u03B4\u03AD\u03C3\u03BC\u03BF\u03C5', null, card.linkText, { dataArray: 'cards', dataIndex: i, dataKey: 'linkText' });
      html += '</div>';
      html += '</div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'news\', \'cards\')">+ \u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u0386\u03C1\u03B8\u03C1\u03BF\u03C5</button>';
    html += '</div>';

    html += saveButton();
    return html;
  };

  // ---- 8. GALLERY ----
  renderers.gallery = function() {
    var html = '';

    // Header
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0395\u03C0\u03B9\u03BA\u03B5\u03C6\u03B1\u03BB\u03AF\u03B4\u03B1</h3>';
    html += fieldGroup('\u0395\u03C4\u03B9\u03BA\u03AD\u03C4\u03B1 \u03B5\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2', 'sectionLabel', s.sectionLabel);
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2', 'title', s.title, { hint: '\u03A7\u03C1\u03AE\u03C3\u03B7 &lt;br&gt; \u03B3\u03B9\u03B1 \u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE\u03C2' });
    html += fieldGroup('\u03A5\u03C0\u03CC\u03C4\u03B9\u03C4\u03BB\u03BF\u03C2', 'subtitle', s.subtitle, { textarea: true, rows: 2 });
    html += '</div>';

    // Images
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u03A6\u03C9\u03C4\u03BF\u03B3\u03C1\u03B1\u03C6\u03AF\u03B5\u03C2</h3>';
    html += '<div class="form__array" id="imagesArray">';
    (s.images || []).forEach(function(img, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader((img.alt || '') + (img.wide ? ' (\u03C0\u03BB\u03B1\u03C4\u03B9\u03AC)' : ''));
      html += '<div class="form__array-body">';
      html += imageGroup('\u0395\u03B9\u03BA\u03CC\u03BD\u03B1', img.url, 'gallery_' + i, null, { dataArray: 'images', dataIndex: i, dataKey: 'url' });
      html += fieldGroup('Alt \u03BA\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF', null, img.alt, { dataArray: 'images', dataIndex: i, dataKey: 'alt' });
      html += '<div class="form__row">';
      html += selectGroup('\u03A0\u03BB\u03B1\u03C4\u03B9\u03AC (2 \u03C3\u03C4\u03AE\u03BB\u03B5\u03C2)', [
        { value: 'false', label: '\u038C\u03C7\u03B9' },
        { value: 'true', label: '\u039D\u03B1\u03B9' }
      ], String(!!img.wide), { dataArray: 'images', dataIndex: i, dataKey: 'wide' });
      html += selectGroup('\u03A8\u03B7\u03BB\u03AE (2 \u03C3\u03B5\u03B9\u03C1\u03AD\u03C2)', [
        { value: 'false', label: '\u038C\u03C7\u03B9' },
        { value: 'true', label: '\u039D\u03B1\u03B9' }
      ], String(!!img.tall), { dataArray: 'images', dataIndex: i, dataKey: 'tall' });
      html += '</div>';
      html += '</div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'gallery\', \'images\')">+ \u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u0395\u03B9\u03BA\u03CC\u03BD\u03B1\u03C2</button>';
    html += '</div>';

    // Social - Instagram
    html += '<div class="form"><h3 style="margin-bottom:1rem;">Social \u2014 Instagram</h3>';
    var social = s.social || {};
    html += '<div class="form__row">';
    html += fieldGroup('Instagram Handle', null, social.instagramHandle, { dataNested: 'social', dataKey: 'instagramHandle' });
    html += fieldGroup('Instagram URL', null, social.instagramUrl, { dataNested: 'social', dataKey: 'instagramUrl' });
    html += '</div>';
    html += fieldGroup('\u038C\u03BD\u03BF\u03BC\u03B1 \u03C0\u03C1\u03BF\u03C6\u03AF\u03BB', null, social.instagramName, { dataNested: 'social', dataKey: 'instagramName' });

    html += '<h4 style="margin:1.5rem 0 0.75rem;">\u0395\u03B9\u03BA\u03CC\u03BD\u03B5\u03C2 Instagram (6 \u03C6\u03C9\u03C4\u03CC)</h4>';
    html += '<div class="form__array" id="instagramArray">';
    (social.instagramImages || []).forEach(function(img, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader('IG \u03C6\u03C9\u03C4\u03CC ' + (i + 1), { noMove: true });
      html += '<div class="form__array-body">';
      html += imageGroup('URL \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1\u03C2', img.url, 'ig_' + i, null, { dataNestedArray: 'instagramImages', dataNested: 'social', dataIndex: i, dataKey: 'url' });
      html += fieldGroup('Alt', null, img.alt, { dataNested: 'social', dataNestedArray: 'instagramImages', dataIndex: i, dataKey: 'alt' });
      html += '</div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'gallery\', \'instagramImages\')">+ \u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 IG \u03A6\u03C9\u03C4\u03CC</button>';
    html += '</div>';

    html += saveButton();
    return html;
  };

  // ---- 9. MEMBERSHIP ----
  renderers.membership = function() {
    var html = '';

    // Header
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0395\u03C0\u03B9\u03BA\u03B5\u03C6\u03B1\u03BB\u03AF\u03B4\u03B1</h3>';
    html += fieldGroup('\u0395\u03C4\u03B9\u03BA\u03AD\u03C4\u03B1 \u03B5\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2', 'sectionLabel', s.sectionLabel);
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2', 'title', s.title, { hint: '\u03A7\u03C1\u03AE\u03C3\u03B7 &lt;br&gt; \u03B3\u03B9\u03B1 \u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE\u03C2' });
    html += fieldGroup('\u03A5\u03C0\u03CC\u03C4\u03B9\u03C4\u03BB\u03BF\u03C2', 'subtitle', s.subtitle, { textarea: true, rows: 2 });
    html += '</div>';

    // Tiers
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u03A0\u03B1\u03BA\u03AD\u03C4\u03B1 \u0395\u03B3\u03B3\u03C1\u03B1\u03C6\u03AE\u03C2</h3>';
    html += '<div class="form__array" id="tiersArray">';
    (s.tiers || []).forEach(function(tier, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader((tier.icon || '') + ' ' + (tier.title || '') + (tier.featured ? ' \u2B50' : ''));
      html += '<div class="form__array-body">';
      html += '<div class="form__row" style="grid-template-columns:80px 1fr auto;">';
      html += fieldGroup('\u0395\u03B9\u03BA\u03BF\u03BD\u03AF\u03B4\u03B9\u03BF', null, tier.icon, { dataArray: 'tiers', dataIndex: i, dataKey: 'icon', style: 'font-size:1.5rem; text-align:center;' });
      html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2', null, tier.title, { dataArray: 'tiers', dataIndex: i, dataKey: 'title' });
      html += selectGroup('\u03A0\u03C1\u03BF\u03B2\u03B5\u03B2\u03BB\u03B7\u03BC\u03AD\u03BD\u03BF', [
        { value: 'false', label: '\u038C\u03C7\u03B9' },
        { value: 'true', label: '\u039D\u03B1\u03B9' }
      ], String(!!tier.featured), { dataArray: 'tiers', dataIndex: i, dataKey: 'featured' });
      html += '</div>';
      html += fieldGroup('\u03A0\u03B5\u03C1\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE', null, tier.description, { textarea: true, rows: 2, dataArray: 'tiers', dataIndex: i, dataKey: 'description' });
      var featuresText = (tier.features || []).join('\n');
      html += fieldGroup('\u03A7\u03B1\u03C1\u03B1\u03BA\u03C4\u03B7\u03C1\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC (\u03AD\u03BD\u03B1 \u03B1\u03BD\u03AC \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE)', null, featuresText, { textarea: true, rows: 4, dataArray: 'tiers', dataIndex: i, dataKey: 'featuresText' });
      html += '<div class="form__hint">\u0393\u03C1\u03AC\u03C8\u03C4\u03B5 \u03BA\u03AC\u03B8\u03B5 \u03C7\u03B1\u03C1\u03B1\u03BA\u03C4\u03B7\u03C1\u03B9\u03C3\u03C4\u03B9\u03BA\u03CC \u03C3\u03B5 \u03BD\u03AD\u03B1 \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE</div>';
      html += '<div class="form__row" style="grid-template-columns:1fr 1fr auto;">';
      html += fieldGroup('\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF CTA', null, tier.ctaLabel, { dataArray: 'tiers', dataIndex: i, dataKey: 'ctaLabel' });
      html += fieldGroup('URL CTA', null, tier.ctaHref, { dataArray: 'tiers', dataIndex: i, dataKey: 'ctaHref' });
      html += selectGroup('\u03A3\u03C4\u03C5\u03BB', [
        { value: 'primary', label: 'Primary' },
        { value: 'gold', label: 'Gold' }
      ], tier.ctaStyle, { dataArray: 'tiers', dataIndex: i, dataKey: 'ctaStyle' });
      html += '</div>';
      html += '</div></div>';
    });
    html += '</div></div>';

    html += saveButton();
    return html;
  };

  // ---- 10. WEATHER (+ sponsors) ----
  renderers.weather = function() {
    var html = '';
    var w = s; // weather data is sectionData
    var sp = (allData && allData.sponsors) || {};

    // Weather
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u039A\u03B1\u03B9\u03C1\u03CC\u03C2</h3>';
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2 widget', 'title', w.title);
    html += fieldGroup('\u03A4\u03BF\u03C0\u03BF\u03B8\u03B5\u03C3\u03AF\u03B1 (\u03BA\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF)', 'location', w.location);
    html += '<div class="form__row">';
    html += fieldGroup('\u0393\u03B5\u03C9\u03B3\u03C1. \u03C0\u03BB\u03AC\u03C4\u03BF\u03C2 (lat)', 'lat', w.lat);
    html += fieldGroup('\u0393\u03B5\u03C9\u03B3\u03C1. \u03BC\u03AE\u03BA\u03BF\u03C2 (lng)', 'lng', w.lng);
    html += '</div>';
    html += '<h4 style="margin:1.5rem 0 0.75rem;">\u0395\u03BD\u03B1\u03BB\u03BB\u03B1\u03BA\u03C4\u03B9\u03BA\u03AD\u03C2 \u03C4\u03B9\u03BC\u03AD\u03C2 (fallback)</h4>';
    var defaults = w.defaults || {};
    html += '<div class="form__row" style="grid-template-columns:1fr 1fr 1fr;">';
    html += fieldGroup('\u0398\u03B5\u03C1\u03BC\u03BF\u03BA\u03C1\u03B1\u03C3\u03AF\u03B1', null, defaults.temp, { dataNested: 'defaults', dataKey: 'temp' });
    html += fieldGroup('\u0386\u03BD\u03B5\u03BC\u03BF\u03C2', null, defaults.wind, { dataNested: 'defaults', dataKey: 'wind' });
    html += fieldGroup('\u039A\u03C5\u03BC\u03B1\u03C4\u03B9\u03C3\u03BC\u03CC\u03C2', null, defaults.sea, { dataNested: 'defaults', dataKey: 'sea' });
    html += '</div></div>';

    // Sponsors
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u03A5\u03C0\u03BF\u03C3\u03C4\u03B7\u03C1\u03B9\u03BA\u03C4\u03AD\u03C2 / \u03A7\u03BF\u03C1\u03B7\u03B3\u03BF\u03AF</h3>';
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2 \u03B5\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2', 'sponsorsTitle', sp.title);
    html += '<div class="form__array" id="sponsorsArray">';
    (sp.items || []).forEach(function(item, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader(item.name || '');
      html += '<div class="form__array-body"><div class="form__row">';
      html += fieldGroup('\u038C\u03BD\u03BF\u03BC\u03B1', null, item.name, { dataArray: 'items', dataIndex: i, dataKey: 'name' });
      html += fieldGroup('Logo URL', null, item.logoUrl, { dataArray: 'items', dataIndex: i, dataKey: 'logoUrl' });
      html += '</div></div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'weather\', \'sponsors\')">+ \u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03A5\u03C0\u03BF\u03C3\u03C4\u03B7\u03C1\u03B9\u03BA\u03C4\u03AE</button>';
    html += '</div>';

    html += saveButton();
    return html;
  };

  // ---- 11. FOOTER (+ floatingCta) ----
  renderers.footer = function() {
    var html = '';
    var fc = (allData && allData.floatingCta) || {};

    // Brand
    html += '<div class="form"><h3 style="margin-bottom:1rem;">Brand</h3>';
    html += fieldGroup('\u038C\u03BD\u03BF\u03BC\u03B1 (\u03C3\u03CD\u03BD\u03C4\u03BF\u03BC\u03BF)', 'brandName', s.brandName);
    html += fieldGroup('\u03A0\u03B5\u03C1\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE', 'brandDesc', s.brandDesc, { textarea: true, rows: 3 });
    html += '</div>';

    // Social Links
    html += '<div class="form"><h3 style="margin-bottom:1rem;">Social Links</h3>';
    html += '<div class="form__array" id="socialLinksArray">';
    (s.socialLinks || []).forEach(function(link, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader(link.platform || '', { noMove: true });
      html += '<div class="form__array-body"><div class="form__row">';
      html += selectGroup('Platform', [
        { value: 'facebook', label: 'Facebook' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'youtube', label: 'YouTube' }
      ], link.platform, { dataArray: 'socialLinks', dataIndex: i, dataKey: 'platform' });
      html += fieldGroup('URL', null, link.url, { dataArray: 'socialLinks', dataIndex: i, dataKey: 'url' });
      html += '</div></div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'footer\', \'socialLinks\')">+ \u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 Social</button>';
    html += '</div>';

    // Links
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u03A3\u03CD\u03BD\u03B4\u03B5\u03C3\u03BC\u03BF\u03B9</h3>';
    html += '<h4 style="margin-bottom:0.75rem;">\u0393\u03C1\u03AE\u03B3\u03BF\u03C1\u03BF\u03B9 \u03A3\u03CD\u03BD\u03B4\u03B5\u03C3\u03BC\u03BF\u03B9</h4>';
    html += '<div class="form__array" id="quickLinksArray">';
    (s.quickLinks || []).forEach(function(link, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader(link.label || '', { noMove: true });
      html += '<div class="form__array-body"><div class="form__row">';
      html += fieldGroup('\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF', null, link.label, { dataArray: 'quickLinks', dataIndex: i, dataKey: 'label' });
      html += fieldGroup('Link', null, link.href, { dataArray: 'quickLinks', dataIndex: i, dataKey: 'href' });
      html += '</div></div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'footer\', \'quickLinks\')">+ \u03A3\u03CD\u03BD\u03B4\u03B5\u03C3\u03BC\u03BF\u03C2</button>';

    html += '<h4 style="margin:1.5rem 0 0.75rem;">\u0391\u03B8\u03BB\u03AE\u03BC\u03B1\u03C4\u03B1 (Footer)</h4>';
    html += '<div class="form__array" id="sportLinksArray">';
    (s.sportLinks || []).forEach(function(link, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader(link.label || '', { noMove: true });
      html += '<div class="form__array-body"><div class="form__row">';
      html += fieldGroup('\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF', null, link.label, { dataArray: 'sportLinks', dataIndex: i, dataKey: 'label' });
      html += fieldGroup('Link', null, link.href, { dataArray: 'sportLinks', dataIndex: i, dataKey: 'href' });
      html += '</div></div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'footer\', \'sportLinks\')">+ \u0386\u03B8\u03BB\u03B7\u03BC\u03B1 Link</button>';
    html += '</div>';

    // Contact
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0395\u03C0\u03B9\u03BA\u03BF\u03B9\u03BD\u03C9\u03BD\u03AF\u03B1</h3>';
    var contact = s.contact || {};
    html += fieldGroup('\u0394\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7', null, contact.address, { textarea: true, rows: 3, dataNested: 'contact', dataKey: 'address', hint: '\u03A7\u03C1\u03B7\u03C3\u03B9\u03BC\u03BF\u03C0\u03BF\u03B9\u03AE\u03C3\u03C4\u03B5 Enter \u03B3\u03B9\u03B1 \u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE\u03C2' });
    html += '<div class="form__row">';
    html += fieldGroup('\u03A4\u03B7\u03BB\u03AD\u03C6\u03C9\u03BD\u03BF (\u03B5\u03BC\u03C6\u03AC\u03BD\u03B9\u03C3\u03B7)', null, contact.phone, { dataNested: 'contact', dataKey: 'phone' });
    html += fieldGroup('\u03A4\u03B7\u03BB\u03AD\u03C6\u03C9\u03BD\u03BF (href)', null, contact.phoneHref, { dataNested: 'contact', dataKey: 'phoneHref' });
    html += '</div>';
    html += fieldGroup('Email', null, contact.email, { dataNested: 'contact', dataKey: 'email' });
    html += '</div>';

    // Newsletter
    html += '<div class="form"><h3 style="margin-bottom:1rem;">Newsletter</h3>';
    var newsletter = s.newsletter || {};
    html += '<div class="form__row" style="grid-template-columns:1fr 80px 1fr;">';
    html += fieldGroup('Placeholder', null, newsletter.placeholder, { dataNested: 'newsletter', dataKey: 'placeholder' });
    html += fieldGroup('\u039A\u03BF\u03C5\u03BC\u03C0\u03AF', null, newsletter.buttonText, { dataNested: 'newsletter', dataKey: 'buttonText' });
    html += fieldGroup('\u039C\u03AE\u03BD\u03C5\u03BC\u03B1 \u03B5\u03C0\u03B9\u03C4\u03C5\u03C7\u03AF\u03B1\u03C2', null, newsletter.successMessage, { dataNested: 'newsletter', dataKey: 'successMessage' });
    html += '</div></div>';

    // Map & Bottom
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u03A7\u03AC\u03C1\u03C4\u03B7\u03C2 & \u039A\u03AC\u03C4\u03C9 \u03BC\u03AD\u03C1\u03BF\u03C2</h3>';
    html += fieldGroup('Google Maps Embed URL', 'mapEmbedUrl', s.mapEmbedUrl, { hint: '\u0391\u03BD\u03C4\u03B9\u03B3\u03C1\u03AC\u03C8\u03C4\u03B5 \u03C4\u03BF src= URL \u03B1\u03C0\u03CC \u03C4\u03BF Google Maps embed code' });
    html += fieldGroup('Copyright', 'copyrightText', s.copyrightText);
    html += fieldGroup('\u039C\u03B7\u03C4\u03C1\u03CE\u03BF / \u03A0\u03BB\u03B7\u03C1\u03BF\u03C6\u03BF\u03C1\u03AF\u03B5\u03C2', 'registryText', s.registryText);
    html += '</div>';

    // Floating CTA
    html += '<div class="form"><h3 style="margin-bottom:1rem;">Floating CTA (\u03C0\u03BB\u03C9\u03C4\u03AC \u03BA\u03BF\u03C5\u03BC\u03C0\u03B9\u03AC)</h3>';
    var phone = fc.phone || {};
    var email = fc.email || {};
    html += '<div class="form__row">';
    html += fieldGroup('\u03A4\u03B7\u03BB\u03AD\u03C6\u03C9\u03BD\u03BF href', 'floatingCta_phone_href', phone.href, { dataNested: 'floatingCta.phone', dataKey: 'href' });
    html += fieldGroup('\u03A4\u03B7\u03BB\u03AD\u03C6\u03C9\u03BD\u03BF tooltip', 'floatingCta_phone_tooltip', phone.tooltip, { dataNested: 'floatingCta.phone', dataKey: 'tooltip' });
    html += '</div>';
    html += '<div class="form__row">';
    html += fieldGroup('Email href', 'floatingCta_email_href', email.href, { dataNested: 'floatingCta.email', dataKey: 'href' });
    html += fieldGroup('Email tooltip', 'floatingCta_email_tooltip', email.tooltip, { dataNested: 'floatingCta.email', dataKey: 'tooltip' });
    html += '</div></div>';

    html += saveButton();
    return html;
  };

  // ---- 12. META ----
  renderers.meta = function() {
    var html = '';

    // Basic SEO
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0392\u03B1\u03C3\u03B9\u03BA\u03AC SEO</h3>';
    html += fieldGroup('\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2 \u03C3\u03B5\u03BB\u03AF\u03B4\u03B1\u03C2 (title tag)', 'title', s.title);
    html += fieldGroup('Meta Description', 'description', s.description, { textarea: true, rows: 2 });
    html += fieldGroup('Keywords', 'keywords', s.keywords, { textarea: true, rows: 2, hint: '\u03A7\u03C9\u03C1\u03B9\u03C3\u03BC\u03AD\u03BD\u03B1 \u03BC\u03B5 \u03BA\u03CC\u03BC\u03BC\u03B1' });
    html += fieldGroup('\u03A3\u03C5\u03B3\u03B3\u03C1\u03B1\u03C6\u03AD\u03B1\u03C2', 'author', s.author);
    html += fieldGroup('Canonical URL', 'canonicalUrl', s.canonicalUrl);
    html += '</div>';

    // Open Graph
    html += '<div class="form"><h3 style="margin-bottom:1rem;">Open Graph / Social</h3>';
    html += imageGroup('OG Image URL', s.ogImage, 'ogImage', 'ogImage');
    html += fieldGroup('OG Description', 'ogDescription', s.ogDescription, { textarea: true, rows: 2 });
    html += fieldGroup('Twitter Description', 'twitterDescription', s.twitterDescription, { textarea: true, rows: 2 });
    html += '</div>';

    // Appearance
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u0395\u03BC\u03C6\u03AC\u03BD\u03B9\u03C3\u03B7</h3>';
    html += '<div class="form__row">';
    html += fieldGroup('Theme Color', 'themeColor', s.themeColor);
    html += fieldGroup('Favicon Emoji', 'faviconEmoji', s.faviconEmoji, { style: 'font-size:1.5rem; width:80px;' });
    html += '</div></div>';

    // Structured Data
    html += '<div class="form"><h3 style="margin-bottom:1rem;">Structured Data (Schema.org)</h3>';
    var sd = s.structuredData || {};
    html += '<div class="form__row">';
    html += fieldGroup('\u03A4\u03B7\u03BB\u03AD\u03C6\u03C9\u03BD\u03BF', null, sd.telephone, { dataNested: 'structuredData', dataKey: 'telephone' });
    html += fieldGroup('Email', null, sd.email, { dataNested: 'structuredData', dataKey: 'email' });
    html += '</div>';
    var addr = sd.address || {};
    html += '<div class="form__row">';
    html += fieldGroup('\u039F\u03B4\u03CC\u03C2', null, addr.street, { dataNested: 'structuredData', dataKey: 'street' });
    html += fieldGroup('\u03A0\u03CC\u03BB\u03B7', null, addr.locality, { dataNested: 'structuredData', dataKey: 'locality' });
    html += '</div>';
    html += '<div class="form__row">';
    html += fieldGroup('\u03A0\u03B5\u03C1\u03B9\u03C6\u03AD\u03C1\u03B5\u03B9\u03B1', null, addr.region, { dataNested: 'structuredData', dataKey: 'region' });
    html += fieldGroup('\u03A7\u03CE\u03C1\u03B1', null, addr.country, { dataNested: 'structuredData', dataKey: 'country' });
    html += '</div>';
    var geo = sd.geo || {};
    html += '<div class="form__row">';
    html += fieldGroup('Geo Lat', null, geo.lat, { dataNested: 'structuredData', dataKey: 'geoLat' });
    html += fieldGroup('Geo Lng', null, geo.lng, { dataNested: 'structuredData', dataKey: 'geoLng' });
    html += '</div>';
    html += fieldGroup('Sports (\u03C7\u03C9\u03C1\u03B9\u03C3\u03BC\u03AD\u03BD\u03B1 \u03BC\u03B5 \u03BA\u03CC\u03BC\u03BC\u03B1)', null, (sd.sports || []).join(', '), { dataNested: 'structuredData', dataKey: 'sports', hint: '\u03A7\u03C9\u03C1\u03AF\u03C3\u03C4\u03B5 \u03BC\u03B5 \u03BA\u03CC\u03BC\u03BC\u03B1: Sailing, SUP, ...' });
    html += fieldGroup('sameAs URLs (\u03AD\u03BD\u03B1 \u03B1\u03BD\u03AC \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE)', null, (sd.sameAs || []).join('\n'), { textarea: true, rows: 3, dataNested: 'structuredData', dataKey: 'sameAs', hint: '\u0388\u03BD\u03B1 URL \u03B1\u03BD\u03AC \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE' });
    html += '</div>';

    html += saveButton();
    return html;
  };

  // ---- 13. HEADER ----
  renderers.header = function() {
    var html = '';

    // Logo & Brand
    html += '<div class="form"><h3 style="margin-bottom:1rem;">Logo & Brand</h3>';
    html += imageGroup('Logo URL', s.logoUrl, 'headerLogo', 'logoUrl');
    html += fieldGroup('Logo Alt', 'logoAlt', s.logoAlt);
    html += '<div class="form__row">';
    html += fieldGroup('\u038C\u03BD\u03BF\u03BC\u03B1 Brand', 'brandName', s.brandName);
    html += fieldGroup('\u03A5\u03C0\u03CC\u03C4\u03B9\u03C4\u03BB\u03BF\u03C2 Brand', 'brandSubtitle', s.brandSubtitle);
    html += '</div></div>';

    // Nav Links
    html += '<div class="form"><h3 style="margin-bottom:1rem;">\u03A3\u03CD\u03BD\u03B4\u03B5\u03C3\u03BC\u03BF\u03B9 \u03A0\u03BB\u03BF\u03AE\u03B3\u03B7\u03C3\u03B7\u03C2</h3>';
    html += '<div class="form__array" id="navLinksArray">';
    (s.navLinks || []).forEach(function(link, i) {
      html += '<div class="form__array-item" data-index="' + i + '">';
      html += arrayHeader(link.label || '');
      html += '<div class="form__array-body"><div class="form__row">';
      html += fieldGroup('\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF', null, link.label, { dataArray: 'navLinks', dataIndex: i, dataKey: 'label' });
      html += fieldGroup('Link (href)', null, link.href, { dataArray: 'navLinks', dataIndex: i, dataKey: 'href' });
      html += '</div></div></div>';
    });
    html += '</div>';
    html += '<button type="button" class="form__add-btn" onclick="addItem(\'header\', \'navLinks\')">+ \u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03A3\u03C5\u03BD\u03B4\u03AD\u03C3\u03BC\u03BF\u03C5</button>';
    html += '</div>';

    // CTA
    html += '<div class="form"><h3 style="margin-bottom:1rem;">CTA \u039A\u03BF\u03C5\u03BC\u03C0\u03AF</h3>';
    html += '<div class="form__row">';
    html += fieldGroup('\u039A\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF CTA', 'ctaLabel', s.ctaLabel);
    html += fieldGroup('URL CTA', 'ctaHref', s.ctaHref);
    html += '</div></div>';

    html += saveButton();
    return html;
  };

  // ====================================================================
  // DISPATCH
  // ====================================================================

  if (renderers[sectionKey]) {
    return renderers[sectionKey]();
  }

  return '<div class="form"><p>\u0394\u03B5\u03BD \u03B2\u03C1\u03AD\u03B8\u03B7\u03BA\u03B5 editor \u03B3\u03B9\u03B1 \u03C4\u03B7\u03BD \u03B5\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1: <strong>' + e(sectionKey) + '</strong></p></div>';
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderSectionEditor: renderSectionEditor };
}
