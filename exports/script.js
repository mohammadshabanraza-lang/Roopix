/* ROOPIX Exports — catalogue rendering and the buyer-enquiry handoff.
   There is no backend: the form opens the visitor's email app (mailto:) or WhatsApp. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var CFG = Object.assign({ email: 'roopix.in@gmail.com', whatsapp: '919639160626', catalogueUrl: '' }, window.ROOPIX_EXPORTS_CONFIG || {});

  /* ---------- Catalogue download (only if a real file is configured) ---------- */
  var dl = $('#catalogueDownload');
  if (dl && CFG.catalogueUrl) { dl.href = CFG.catalogueUrl; dl.hidden = false; }

  /* ---------- Catalogue grid ---------- */
  var grid = $('#catalogueGrid');
  var empty = $('#catalogueEmpty');
  var filters = $('#catalogueFilters');
  var productSelect = $('#f-product');
  var products = (Array.isArray(window.ROOPIX_EXPORT_PRODUCTS) ? window.ROOPIX_EXPORT_PRODUCTS : [])
    .filter(function (p) { return p && p.name && p.image; });

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function label(p) { return (p.code ? p.code + ' – ' : '') + p.name; }

  if (grid && products.length) {
    if (empty) empty.hidden = true;
    grid.hidden = false;

    var specs = [['Material', 'material'], ['Dimensions', 'dimensions'], ['Finish', 'finish'], ['Customisation', 'customisation']];
    products.forEach(function (p) {
      var card = el('article', 'product-card');
      card.dataset.category = p.category || '';
      var media = el('div', 'product-media');
      var img = el('img');
      img.src = p.image; img.alt = p.alt || p.name; img.loading = 'lazy'; img.width = 800; img.height = 600;
      img.addEventListener('error', function () { card.hidden = true; });
      media.appendChild(img);
      var body = el('div', 'product-body');
      if (p.code) body.appendChild(el('p', 'product-code', p.code));
      body.appendChild(el('h4', null, p.name));
      if (p.category) body.appendChild(el('p', 'product-cat', p.category));
      var dl2 = el('dl', 'product-specs');
      specs.forEach(function (s) {
        if (p[s[1]]) { dl2.appendChild(el('dt', null, s[0])); dl2.appendChild(el('dd', null, p[s[1]])); }
      });
      if (dl2.children.length) body.appendChild(dl2);
      var cta = el('a', 'btn btn-ghost', 'Request a Quote');
      cta.href = '#enquiry';
      cta.addEventListener('click', function () { selectProduct(label(p)); });
      body.appendChild(cta);
      card.appendChild(media); card.appendChild(body);
      grid.appendChild(card);
    });

    /* Add each product to the form's dropdown */
    if (productSelect) {
      products.forEach(function (p) {
        var o = document.createElement('option'); o.textContent = label(p); productSelect.insertBefore(o, productSelect.lastElementChild);
      });
    }

    /* Category filter chips */
    var cats = [];
    products.forEach(function (p) { if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category); });
    if (filters && cats.length > 1) {
      filters.hidden = false;
      ['All'].concat(cats).forEach(function (c, i) {
        var b = el('button', 'chip', c); b.type = 'button'; b.setAttribute('aria-pressed', String(i === 0));
        b.addEventListener('click', function () {
          Array.prototype.forEach.call(filters.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          Array.prototype.forEach.call(grid.children, function (card) { card.hidden = !(c === 'All' || card.dataset.category === c); });
        });
        filters.appendChild(b);
      });
    }
  }

  function selectProduct(value) {
    if (!productSelect) return;
    for (var i = 0; i < productSelect.options.length; i++) {
      if (productSelect.options[i].text === value) { productSelect.selectedIndex = i; return; }
    }
  }

  /* ---------- Enquiry form ---------- */
  var form = $('#enquiryForm');
  if (!form) return;
  var status = $('#formStatus');
  var fallback = $('#fallback');
  var enquiryText = $('#enquiryText');

  function val(id) { return ($('#' + id).value || '').trim(); }
  function showError(fieldId, errId, show) {
    var f = $('#' + fieldId), e = $('#' + errId);
    e.hidden = !show;
    if (show) f.setAttribute('aria-invalid', 'true'); else f.removeAttribute('aria-invalid');
  }

  function validate() {
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('f-email'));
    var checks = [
      ['f-name', 'e-name', val('f-name').length > 0],
      ['f-country', 'e-country', val('f-country').length > 0],
      ['f-email', 'e-email', emailOk],
      ['f-message', 'e-message', val('f-message').length >= 5]
    ];
    var firstBad = null;
    checks.forEach(function (c) {
      showError(c[0], c[1], !c[2]);
      if (!c[2] && !firstBad) firstBad = $('#' + c[0]);
    });
    if (firstBad) { firstBad.focus(); return false; }
    return true;
  }

  function collect() {
    return {
      name: val('f-name'), company: val('f-company'), country: val('f-country'), email: val('f-email'),
      product: $('#f-product').value, quantity: val('f-qty'), message: val('f-message')
    };
  }

  function subject(d) {
    return 'Export enquiry: ' + (d.product || 'General') + (d.company ? ' – ' + d.company : ' – ' + d.name);
  }

  function bodyText(d) {
    return [
      'Hello ROOPIX Exports,', '',
      'I would like to request a quote.', '',
      'Name: ' + d.name,
      'Company: ' + (d.company || '-'),
      'Country: ' + d.country,
      'Work email: ' + d.email,
      'Product of interest: ' + (d.product || '-'),
      'Estimated quantity: ' + (d.quantity || '-'), '',
      'Message:', d.message, '',
      'Sent from the enquiry form at roopix.in/exports/'
    ].join('\n');
  }

  ['f-name', 'f-country', 'f-email', 'f-message'].forEach(function (id) {
    $('#' + id).addEventListener('input', function () { showError(id, 'e-' + id.slice(2), false); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    var d = collect(), text = bodyText(d);
    enquiryText.value = 'To: ' + CFG.email + '\nSubject: ' + subject(d) + '\n\n' + text;
    fallback.hidden = false;
    status.textContent = 'Your email app should now open with your enquiry. Please press send there to complete it. Nothing has been sent yet.';
    window.location.href = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent(subject(d)) + '&body=' + encodeURIComponent(text.replace(/\n/g, '\r\n'));
  });

  $('#sendWa').addEventListener('click', function () {
    if (!validate()) return;
    var d = collect();
    var msg = 'Hello ROOPIX Exports, I would like to request a quote.\n\nName: ' + d.name + '\nCompany: ' + (d.company || '-') + '\nCountry: ' + d.country +
      '\nEmail: ' + d.email + '\nProduct: ' + (d.product || '-') + '\nQuantity: ' + (d.quantity || '-') + '\n\n' + d.message;
    status.textContent = 'WhatsApp should open in a new tab. Please press send there to complete your enquiry.';
    window.open('https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  $('#copyText').addEventListener('click', function () {
    enquiryText.select();
    var done = function () { status.textContent = 'Enquiry text copied. Paste it into an email to ' + CFG.email + '.'; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(enquiryText.value).then(done, function () { document.execCommand('copy'); done(); });
    else { document.execCommand('copy'); done(); }
  });
})();
