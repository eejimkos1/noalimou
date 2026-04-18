/* NOA CMS — Client-side Admin JS */

// ============ FORM SERIALIZATION ============

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('sectionForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = collectFormData();
    document.getElementById('jsonData').value = JSON.stringify(data);
    form.submit();
  });
});

/**
 * Collects form data from data-field and data-array elements
 * into a JSON object matching the section's data structure.
 */
function collectFormData() {
  const data = {};

  // Simple fields: data-field="key"
  document.querySelectorAll('[data-field]').forEach(function(el) {
    const key = el.dataset.field;
    if (el.type === 'checkbox') {
      data[key] = el.checked;
    } else if (el.tagName === 'SELECT') {
      data[key] = el.value;
    } else {
      data[key] = el.value;
    }
  });

  // Array fields: data-array="cards" data-index="0" data-key="title"
  document.querySelectorAll('[data-array]').forEach(function(el) {
    const arrayName = el.dataset.array;
    const index = parseInt(el.dataset.index, 10);
    const key = el.dataset.key;

    if (!data[arrayName]) data[arrayName] = [];
    while (data[arrayName].length <= index) data[arrayName].push({});

    if (el.type === 'checkbox') {
      data[arrayName][index][key] = el.checked;
    } else {
      data[arrayName][index][key] = el.value;
    }
  });

  // Nested object fields: data-object="quiz" data-key="title"
  document.querySelectorAll('[data-object]').forEach(function(el) {
    const objName = el.dataset.object;
    const key = el.dataset.key;
    if (!data[objName]) data[objName] = {};
    data[objName][key] = el.value;
  });

  // Nested array-in-object: data-object="quiz" data-objarray="options" data-index="0" data-key="label"
  document.querySelectorAll('[data-objarray]').forEach(function(el) {
    const objName = el.dataset.object;
    const arrayName = el.dataset.objarray;
    const index = parseInt(el.dataset.index, 10);
    const key = el.dataset.key;

    if (!data[objName]) data[objName] = {};
    if (!data[objName][arrayName]) data[objName][arrayName] = [];
    while (data[objName][arrayName].length <= index) data[objName][arrayName].push({});
    data[objName][arrayName][index][key] = el.value;
  });

  // Nested object-in-object: data-nested="contact" data-key="phone"
  document.querySelectorAll('[data-nested]').forEach(function(el) {
    const parentKey = el.dataset.nested;
    const key = el.dataset.key;
    if (!data[parentKey]) data[parentKey] = {};
    data[parentKey][key] = el.value;
  });

  // Nested array-in-nested: data-nested="social" data-nestedarray="items" data-index="0" data-key="url"
  document.querySelectorAll('[data-nestedarray]').forEach(function(el) {
    const parentKey = el.dataset.nested;
    const arrayName = el.dataset.nestedarray;
    const index = parseInt(el.dataset.index, 10);
    const key = el.dataset.key;

    if (!data[parentKey]) data[parentKey] = {};
    if (!data[parentKey][arrayName]) data[parentKey][arrayName] = [];
    while (data[parentKey][arrayName].length <= index) data[parentKey][arrayName].push({});
    data[parentKey][arrayName][index][key] = el.value;
  });

  // Features arrays: data-features-array="features" data-index="0"
  document.querySelectorAll('[data-features-array]').forEach(function(el) {
    const arrayName = el.dataset.featuresArray;
    const index = parseInt(el.dataset.index, 10);
    if (!data[arrayName]) data[arrayName] = [];
    while (data[arrayName].length <= index) data[arrayName].push('');
    data[arrayName][index] = el.value;
  });

  return data;
}


// ============ ARRAY ITEM MANAGEMENT ============

/**
 * Toggle collapse/expand of array item body
 */
function toggleArrayItem(headerEl) {
  const item = headerEl.closest('.form__array-item');
  item.classList.toggle('open');
}

/**
 * Move array item up (-1) or down (+1)
 */
function moveArrayItem(btnEl, direction) {
  const item = btnEl.closest('.form__array-item');
  const container = item.parentElement;
  const items = Array.from(container.querySelectorAll('.form__array-item'));
  const idx = items.indexOf(item);
  const newIdx = idx + direction;

  if (newIdx < 0 || newIdx >= items.length) return;

  if (direction === -1) {
    container.insertBefore(item, items[newIdx]);
  } else {
    container.insertBefore(item, items[newIdx].nextSibling);
  }

  reindexArray(container);
}

/**
 * Remove an array item with confirmation
 */
function removeArrayItem(btnEl) {
  if (!confirm('Διαγραφή στοιχείου;')) return;
  const item = btnEl.closest('.form__array-item');
  const container = item.parentElement;
  item.remove();
  reindexArray(container);
}

/**
 * Re-index all data-index attributes within an array container
 */
function reindexArray(container) {
  container.querySelectorAll('.form__array-item').forEach(function(item, i) {
    item.dataset.index = i;
    item.querySelectorAll('[data-index]').forEach(function(el) {
      el.dataset.index = i;
    });
  });
}


// ============ ADD ITEM FUNCTIONS ============

function addEvent() {
  const container = document.getElementById('cardsArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέα εκδήλωση</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn" onclick="event.stopPropagation(); moveArrayItem(this, -1)" title="Πάνω">↑</button>
          <button type="button" class="form__array-btn" onclick="event.stopPropagation(); moveArrayItem(this, 1)" title="Κάτω">↓</button>
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)" title="Διαγραφή">🗑</button>
          <span class="form__array-toggle" style="cursor:pointer;">▼</span>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__row" style="grid-template-columns:80px 80px 1fr;">
          <div class="form__group">
            <label class="form__label">Ημέρα</label>
            <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="dateDay" placeholder="06">
          </div>
          <div class="form__group">
            <label class="form__label">Μήνας</label>
            <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="dateMonth" placeholder="Οκτ">
          </div>
          <div class="form__group">
            <label class="form__label">Κατηγορία</label>
            <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="category" placeholder="π.χ. Windsurf, Ιστιοπλοΐα">
          </div>
        </div>
        <div class="form__group">
          <label class="form__label">Τίτλος εκδήλωσης</label>
          <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="title">
        </div>
        <div class="form__group">
          <label class="form__label">Περιγραφή</label>
          <textarea class="form__textarea" data-array="cards" data-index="${idx}" data-key="description" rows="2"></textarea>
        </div>
        <div class="form__row">
          <div class="form__group">
            <label class="form__label">Tag κείμενο</label>
            <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="tagText">
          </div>
          <div class="form__group">
            <label class="form__label">Tag χρώμα</label>
            <select class="form__select" data-array="cards" data-index="${idx}" data-key="tagClass">
              <option value="sailing">Ιστιοπλοΐα (μπλε)</option>
              <option value="windsurf">Windsurf (πορτοκαλί)</option>
              <option value="general">Γενικό (μωβ)</option>
            </select>
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addNews() {
  const container = document.getElementById('cardsArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέο άρθρο</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn" onclick="event.stopPropagation(); moveArrayItem(this, -1)" title="Πάνω">↑</button>
          <button type="button" class="form__array-btn" onclick="event.stopPropagation(); moveArrayItem(this, 1)" title="Κάτω">↓</button>
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)" title="Διαγραφή">🗑</button>
          <span class="form__array-toggle" style="cursor:pointer;">▼</span>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__group">
          <label class="form__label">Εικόνα URL</label>
          <div class="form__image-wrap">
            <div class="form__image-preview" id="preview_card_${idx}_image">Χωρίς εικόνα</div>
            <div class="form__image-inputs">
              <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="imageUrl" onchange="updateImagePreview('card_${idx}_image', this.value)">
              <label class="form__upload-btn">
                📁 Ανέβασμα
                <input type="file" class="form__upload-input" accept="image/*" onchange="uploadImageToField(this, null, 'card_${idx}_image')">
              </label>
            </div>
          </div>
        </div>
        <div class="form__group">
          <label class="form__label">Alt εικόνας</label>
          <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="imageAlt">
        </div>
        <div class="form__group">
          <label class="form__label">Ημερομηνία</label>
          <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="date" placeholder="π.χ. 6 Οκτωβρίου 2025">
        </div>
        <div class="form__group">
          <label class="form__label">Τίτλος</label>
          <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="title">
        </div>
        <div class="form__group">
          <label class="form__label">Περίληψη</label>
          <textarea class="form__textarea" data-array="cards" data-index="${idx}" data-key="excerpt" rows="3"></textarea>
        </div>
        <div class="form__row">
          <div class="form__group">
            <label class="form__label">URL συνδέσμου</label>
            <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="linkUrl">
          </div>
          <div class="form__group">
            <label class="form__label">Κείμενο συνδέσμου</label>
            <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="linkText" value="Διάβασε περισσότερα">
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addSportCard() {
  const container = document.getElementById('cardsArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέο άθλημα</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn" onclick="event.stopPropagation(); moveArrayItem(this, -1)" title="Πάνω">↑</button>
          <button type="button" class="form__array-btn" onclick="event.stopPropagation(); moveArrayItem(this, 1)" title="Κάτω">↓</button>
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)" title="Διαγραφή">🗑</button>
          <span class="form__array-toggle" style="cursor:pointer;">▼</span>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__row">
          <div class="form__group">
            <label class="form__label">Όνομα αθλήματος</label>
            <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="name">
          </div>
          <div class="form__group">
            <label class="form__label">Εικονίδιο (emoji)</label>
            <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="icon" style="font-size:1.5rem;">
          </div>
        </div>
        <div class="form__group">
          <label class="form__label">Περιγραφή</label>
          <textarea class="form__textarea" data-array="cards" data-index="${idx}" data-key="description" rows="2"></textarea>
        </div>
        <div class="form__group">
          <label class="form__label">Εικόνα</label>
          <div class="form__image-wrap">
            <div class="form__image-preview" id="preview_sport_${idx}">Χωρίς εικόνα</div>
            <div class="form__image-inputs">
              <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="imageUrl" onchange="updateImagePreview('sport_${idx}', this.value)">
              <label class="form__upload-btn">
                📁 Ανέβασμα
                <input type="file" class="form__upload-input" accept="image/*" onchange="uploadImageToField(this, null, 'sport_${idx}')">
              </label>
            </div>
          </div>
        </div>
        <div class="form__row">
          <div class="form__group">
            <label class="form__label">Alt εικόνας</label>
            <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="imageAlt">
          </div>
          <div class="form__group">
            <label class="form__label">Κείμενο συνδέσμου</label>
            <input class="form__input" type="text" data-array="cards" data-index="${idx}" data-key="linkText" value="Μάθε Περισσότερα">
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addGalleryImage() {
  const container = document.getElementById('imagesArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέα εικόνα</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn" onclick="event.stopPropagation(); moveArrayItem(this, -1)" title="Πάνω">↑</button>
          <button type="button" class="form__array-btn" onclick="event.stopPropagation(); moveArrayItem(this, 1)" title="Κάτω">↓</button>
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)" title="Διαγραφή">🗑</button>
          <span class="form__array-toggle" style="cursor:pointer;">▼</span>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__group">
          <label class="form__label">Εικόνα</label>
          <div class="form__image-wrap">
            <div class="form__image-preview" id="preview_gallery_${idx}">Χωρίς εικόνα</div>
            <div class="form__image-inputs">
              <input class="form__input" type="text" data-array="images" data-index="${idx}" data-key="url" onchange="updateImagePreview('gallery_${idx}', this.value)">
              <label class="form__upload-btn">
                📁 Ανέβασμα
                <input type="file" class="form__upload-input" accept="image/*" onchange="uploadImageToField(this, null, 'gallery_${idx}')">
              </label>
            </div>
          </div>
        </div>
        <div class="form__group">
          <label class="form__label">Alt κείμενο</label>
          <input class="form__input" type="text" data-array="images" data-index="${idx}" data-key="alt">
        </div>
        <div class="form__row">
          <div class="form__group">
            <label class="form__label">Πλατιά (2 στήλες)</label>
            <select class="form__select" data-array="images" data-index="${idx}" data-key="wide">
              <option value="false">Όχι</option>
              <option value="true">Ναι</option>
            </select>
          </div>
          <div class="form__group">
            <label class="form__label">Ψηλή (2 σειρές)</label>
            <select class="form__select" data-array="images" data-index="${idx}" data-key="tall">
              <option value="false">Όχι</option>
              <option value="true">Ναι</option>
            </select>
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addInstagramImage() {
  const container = document.getElementById('instagramArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">IG φωτό ${idx + 1}</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)" title="Διαγραφή">🗑</button>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__group">
          <label class="form__label">URL εικόνας</label>
          <div class="form__image-wrap">
            <div class="form__image-preview" id="preview_ig_${idx}">Χωρίς εικόνα</div>
            <div class="form__image-inputs">
              <input class="form__input" type="text" data-nested="social" data-nestedarray="instagramImages" data-index="${idx}" data-key="url" onchange="updateImagePreview('ig_${idx}', this.value)">
              <label class="form__upload-btn">
                📁 Ανέβασμα
                <input type="file" class="form__upload-input" accept="image/*" onchange="uploadImageToField(this, null, 'ig_${idx}')">
              </label>
            </div>
          </div>
        </div>
        <div class="form__group">
          <label class="form__label">Alt</label>
          <input class="form__input" type="text" data-nested="social" data-nestedarray="instagramImages" data-index="${idx}" data-key="alt">
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addHeroAction() {
  const container = document.getElementById('actionsArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέο κουμπί</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)">🗑</button>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__row--3" style="display:grid; grid-template-columns:1fr 1fr auto; gap:0.75rem;">
          <div class="form__group">
            <label class="form__label">Κείμενο</label>
            <input class="form__input" type="text" data-array="actions" data-index="${idx}" data-key="label">
          </div>
          <div class="form__group">
            <label class="form__label">Link (href)</label>
            <input class="form__input" type="text" data-array="actions" data-index="${idx}" data-key="href">
          </div>
          <div class="form__group">
            <label class="form__label">Στυλ</label>
            <select class="form__select" data-array="actions" data-index="${idx}" data-key="style">
              <option value="primary">Primary</option>
              <option value="outline">Outline</option>
              <option value="gold">Gold</option>
            </select>
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addHeroStat() {
  const container = document.getElementById('statsArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέο στατιστικό</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)">🗑</button>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__row">
          <div class="form__group">
            <label class="form__label">Τιμή</label>
            <input class="form__input" type="text" data-array="stats" data-index="${idx}" data-key="value">
          </div>
          <div class="form__group">
            <label class="form__label">Ετικέτα</label>
            <input class="form__input" type="text" data-array="stats" data-index="${idx}" data-key="label">
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addAboutValue() {
  const container = document.getElementById('valuesArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέα αξία</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)">🗑</button>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__row" style="grid-template-columns:80px 1fr 1fr;">
          <div class="form__group">
            <label class="form__label">Εικονίδιο</label>
            <input class="form__input" type="text" data-array="values" data-index="${idx}" data-key="icon" style="font-size:1.5rem; text-align:center;">
          </div>
          <div class="form__group">
            <label class="form__label">Τίτλος</label>
            <input class="form__input" type="text" data-array="values" data-index="${idx}" data-key="title">
          </div>
          <div class="form__group">
            <label class="form__label">Κείμενο</label>
            <input class="form__input" type="text" data-array="values" data-index="${idx}" data-key="text">
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addAcademyStep() {
  const container = document.getElementById('stepsArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Βήμα ${idx + 1}</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)">🗑</button>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__row" style="grid-template-columns:60px 1fr 120px;">
          <div class="form__group">
            <label class="form__label">Αριθμός</label>
            <input class="form__input" type="text" data-array="steps" data-index="${idx}" data-key="number" value="${idx + 1}">
          </div>
          <div class="form__group">
            <label class="form__label">Τίτλος</label>
            <input class="form__input" type="text" data-array="steps" data-index="${idx}" data-key="title">
          </div>
          <div class="form__group">
            <label class="form__label">Badge class</label>
            <select class="form__select" data-array="steps" data-index="${idx}" data-key="badgeClass">
              <option value="beginner">Αρχάριοι</option>
              <option value="intermediate">Μέσοι</option>
              <option value="advanced">Προχωρημένοι</option>
            </select>
          </div>
        </div>
        <div class="form__group">
          <label class="form__label">Badge κείμενο</label>
          <input class="form__input" type="text" data-array="steps" data-index="${idx}" data-key="badgeText">
        </div>
        <div class="form__group">
          <label class="form__label">Κείμενο</label>
          <textarea class="form__textarea" data-array="steps" data-index="${idx}" data-key="text" rows="2"></textarea>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addCampFeature() {
  const container = document.getElementById('featuresArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέο feature</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)">🗑</button>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__row">
          <div class="form__group">
            <label class="form__label">Εικονίδιο</label>
            <input class="form__input" type="text" data-array="features" data-index="${idx}" data-key="icon" style="font-size:1.5rem;">
          </div>
          <div class="form__group">
            <label class="form__label">Ετικέτα</label>
            <input class="form__input" type="text" data-array="features" data-index="${idx}" data-key="label">
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addMembershipFeature(tierIdx) {
  const container = document.getElementById('features_' + tierIdx);
  const idx = container.querySelectorAll('.form__array-feature-item').length;
  const html = `
    <div class="form__array-feature-item" style="display:flex; gap:0.5rem; align-items:center; margin-bottom:0.5rem;">
      <input class="form__input" type="text" data-tier="${tierIdx}" data-feature-index="${idx}" style="flex:1;">
      <button type="button" class="form__array-btn form__array-btn--delete" onclick="this.parentElement.remove()" style="flex-shrink:0;">🗑</button>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addSponsor() {
  const container = document.getElementById('sponsorsArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέος υποστηρικτής</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)">🗑</button>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__row">
          <div class="form__group">
            <label class="form__label">Όνομα</label>
            <input class="form__input" type="text" data-array="items" data-index="${idx}" data-key="name">
          </div>
          <div class="form__group">
            <label class="form__label">Logo URL</label>
            <input class="form__input" type="text" data-array="items" data-index="${idx}" data-key="logoUrl">
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addNavLink() {
  const container = document.getElementById('navLinksArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέος σύνδεσμος</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)">🗑</button>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__row">
          <div class="form__group">
            <label class="form__label">Κείμενο</label>
            <input class="form__input" type="text" data-array="navLinks" data-index="${idx}" data-key="label">
          </div>
          <div class="form__group">
            <label class="form__label">Link (href)</label>
            <input class="form__input" type="text" data-array="navLinks" data-index="${idx}" data-key="href">
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addQuizOption() {
  const container = document.getElementById('quizOptionsArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέα επιλογή</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)">🗑</button>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__row" style="grid-template-columns:120px 120px 1fr;">
          <div class="form__group">
            <label class="form__label">Ετικέτα</label>
            <input class="form__input" type="text" data-object="quiz" data-objarray="options" data-index="${idx}" data-key="label">
          </div>
          <div class="form__group">
            <label class="form__label">Key</label>
            <input class="form__input" type="text" data-object="quiz" data-objarray="options" data-index="${idx}" data-key="key">
          </div>
          <div class="form__group">
            <label class="form__label">Αποτέλεσμα</label>
            <input class="form__input" type="text" data-object="quiz" data-objarray="options" data-index="${idx}" data-key="result">
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addSocialLink() {
  const container = document.getElementById('socialLinksArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέο social</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)">🗑</button>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__row">
          <div class="form__group">
            <label class="form__label">Platform</label>
            <select class="form__select" data-array="socialLinks" data-index="${idx}" data-key="platform">
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>
          <div class="form__group">
            <label class="form__label">URL</label>
            <input class="form__input" type="text" data-array="socialLinks" data-index="${idx}" data-key="url">
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addQuickLink() {
  const container = document.getElementById('quickLinksArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέος σύνδεσμος</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)">🗑</button>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__row">
          <div class="form__group">
            <label class="form__label">Κείμενο</label>
            <input class="form__input" type="text" data-array="quickLinks" data-index="${idx}" data-key="label">
          </div>
          <div class="form__group">
            <label class="form__label">Link</label>
            <input class="form__input" type="text" data-array="quickLinks" data-index="${idx}" data-key="href">
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addSportLink() {
  const container = document.getElementById('sportLinksArray');
  const idx = container.querySelectorAll('.form__array-item').length;
  const html = `
    <div class="form__array-item open" data-index="${idx}">
      <div class="form__array-header" onclick="toggleArrayItem(this)">
        <span class="form__array-header-title">Νέο άθλημα link</span>
        <div class="form__array-header-actions">
          <button type="button" class="form__array-btn form__array-btn--delete" onclick="event.stopPropagation(); removeArrayItem(this)">🗑</button>
        </div>
      </div>
      <div class="form__array-body">
        <div class="form__row">
          <div class="form__group">
            <label class="form__label">Κείμενο</label>
            <input class="form__input" type="text" data-array="sportLinks" data-index="${idx}" data-key="label">
          </div>
          <div class="form__group">
            <label class="form__label">Link</label>
            <input class="form__input" type="text" data-array="sportLinks" data-index="${idx}" data-key="href">
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}


// ============ IMAGE HANDLING ============

/**
 * Update image preview when URL changes
 */
function updateImagePreview(previewId, url) {
  const container = document.getElementById('preview_' + previewId);
  if (!container) return;
  if (url && url.trim()) {
    container.innerHTML = '<img src="' + url + '" alt="Preview">';
  } else {
    container.innerHTML = 'Χωρίς εικόνα';
  }
}

/**
 * Upload image file via AJAX, then set the URL to the sibling text input
 * and update the preview
 */
function uploadImageToField(fileInput, fieldName, previewId) {
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  fetch('/admin/upload', {
    method: 'POST',
    body: formData
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.url) {
      // Find the text input (sibling of the upload label)
      const wrap = fileInput.closest('.form__image-inputs');
      const textInput = wrap.querySelector('.form__input');
      textInput.value = data.url;

      // Also set data-field input if provided
      if (fieldName) {
        const fieldInput = document.querySelector('[data-field="' + fieldName + '"]');
        if (fieldInput) fieldInput.value = data.url;
      }

      // Update preview
      if (previewId) {
        updateImagePreview(previewId, data.url);
      }
    }
  })
  .catch(function(err) {
    alert('Σφάλμα ανέβασμα: ' + err.message);
  });
}


// ============ PUBLISH ============

function publishSite() {
  if (!confirm('Δημοσίευση τώρα;')) return;

  fetch('/admin/build', {
    method: 'POST'
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.error) {
      alert('Σφάλμα: ' + data.error);
    } else if (data.pushed === false) {
      alert('Build OK αλλά αποτυχία push στο GitHub:\n' + (data.gitError || 'Άγνωστο σφάλμα'));
      window.location.href = '/admin?published=1';
    } else {
      window.location.href = '/admin?published=1';
    }
  })
  .catch(function(err) {
    alert('Σφάλμα δημοσίευσης: ' + err.message);
  });
}
