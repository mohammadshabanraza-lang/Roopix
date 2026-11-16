# Technical changes in this update

## Asset accuracy and brand presentation
- Removed the generated ROOPIX-labelled cosmetics artwork from category cards because it could be mistaken for ROOPIX-manufactured products.
- Replaced Beauty category artwork with neutral SVG illustrations and editorial colour fields.
- Replaced the checkerboard-background raster brand marks with typographic brand names.
- Added dedicated square SVG/PNG favicon and Apple touch icon assets.

## Code and media cleanup
- Removed duplicate `exports/scroll-experience.js`; `exports/catalogue-data.js` is the single editable source for product records and configuration.
- Removed the retired bird-feeder image sequence because the current page does not use it.
- Removed unreferenced Beauty brand and category graphics.
- Added a shared refinement stylesheet after the existing premium stylesheet.

## User experience
- Beauty uses a warm ivory and muted-rose editorial palette while shared navigation and footer remain dark.
- Homepage introductory copy and division descriptions remain visible on mobile.
- Export catalogue empty state now explains the buyer brief and enquiry route without looking like a temporary under-construction message.
- Export enquiry validates an optional company website URL and includes a basic honeypot field.
- Product cards support weight and packaging specification fields when real data is supplied.

## Important content limitations
- No export product records were added because the provided repository did not include verified product photographs and complete product-specific data.
- No Beauty product cards or prices were fabricated. The existing external Vyapar store link remains the source for current retail assortment and checkout.
- No server-side enquiry endpoint or CRM was configured. Email and WhatsApp remain visitor-controlled handoff options.

## Animation simplification
- Removed the older overlapping `motion.css` / `motion.js` layer. The site now uses `base.js` for accessible section reveal state, `roopix-effects.css` for native CSS scroll-driven reveals, and `roopix-effects.js` for the GSAP image clip and Exports parallax experiences.
- Reduced duplicate animation state and the extra IntersectionObserver/parallax work previously applied to hero imagery.
