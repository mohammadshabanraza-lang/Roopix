/*
 * ROOPIX Exports — owner-editable content.
 * This file is intentionally kept separate from the rendering and enquiry logic.
 */

/* 1. CONTACT + CATALOGUE SETTINGS */
window.ROOPIX_EXPORTS_CONFIG = {
  email: 'roopix.in@gmail.com',
  whatsapp: '919639160626',
  /* Add a real catalogue PDF URL when one is available. */
  catalogueUrl: ''
};

/*
 * 2. PRODUCT CATALOGUE
 * A product is rendered only when both name and image are supplied.
 * Keep all specifications accurate and verified before publishing.
 * Images should live inside /assets/exports/.
 *
 * Template:
 * {
 *   code: 'RF-01',
 *   name: 'Bird Feeder',
 *   category: 'Bird Feeders',
 *   image: '../assets/exports/rf-01.webp',
 *   alt: 'Describe the actual product photograph',
 *   material: '',
 *   dimensions: '',
 *   finish: '',
 *   customisation: ''
 * }
 *
 * Known working catalogue codes from the original owner notes:
 * RF-01, RF-02, RWT04, RWT05, RWT06.
 *
 * No actual product records were present in the supplied ZIP, so this array
 * remains empty. Do not populate it with illustrative or invented products.
 */
window.ROOPIX_EXPORT_PRODUCTS = [];
