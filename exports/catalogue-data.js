* ============================================================
   ROOPIX Exports â€” owner-editable content (no coding needed)
   ============================================================ */

/* 1. CONTACT + CATALOGUE SETTINGS */
window.ROOPIX_EXPORTS_CONFIG = {
  email: 'roopix.in@gmail.com',
  whatsapp: '919639160626',
  // When you have a real catalogue PDF, upload it to /assets/exports/ and put its path here.
  // Example: 'https://roopix.in/assets/exports/roopix-exports-catalogue.pdf'
  // While this is empty, no download button is shown (so there is never a dead link).
  catalogueUrl: ''
};

/* 2. PRODUCT CATALOGUE
   A product is shown only if it has BOTH a name and an image.
   Details (code, material, dimensions, finish, customisation) are shown only if you fill them in.
   Never add prices; the site uses "Request a Quote".

   Image files go in /assets/exports/ (recommended 1000 x 750 px, JPG or WebP, under 200 KB).

   Template (copy, remove the comment markers, fill in real data):

   {
     code: 'RF-01',
     name: 'Bird Feeder (design name)',
     category: 'Bird Feeders',            // use one of the five category names
     image: '../assets/exports/rf-01.jpg',
     alt: 'Describe what the photo shows',
     material: '',
     dimensions: '',
     finish: '',
     customisation: ''
   },

   Working catalogue codes known so far: RF-01, RF-02, RWT04, RWT05, RWT06.
*/
window.ROOPIX_EXPORT_PRODUCTS = [
];
