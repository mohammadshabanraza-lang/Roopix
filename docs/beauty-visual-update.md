# ROOPIX Beauty visual update

## What changed

- Added `assets/beauty-luxe.css` as the final Beauty visual layer.
- Re-aligned the Beauty palette with the ROOPIX wordmark: ink black, plum, white and signature magenta/pink, with restrained translucent glass effects.
- Refined the Beauty header, hero frame, buttons, category cards, brand tiles, information cards and store-photo treatment.
- Added five visible category-image assets under `assets/beauty-categories/` and wired them into the Beauty category cards.
- Explicitly set the homepage division-card image layers so photography is above the card background and below the overlay/content.
- Kept the current Beauty and Exports division content and existing external store/WhatsApp destinations.

## Image-content note

The category-card images are crops from the existing unbranded editorial beauty still-life (`assets/hero-banner.webp`). They are decorative category visuals, not photographs of individual saleable SKUs and not proof of a specific product being in stock. Product listings should use actual, current product photographs and stock data supplied by ROOPIX.

The original `lips-banner.webp`, `face-banner.webp`, `eye-banner.webp`, `skincare-banner.webp` and `accessories-banner.webp` were not used for category cards because they contain fabricated ROOPIX-branded packaging/claims that could be mistaken for real branded products or product claims.

## Deployment

Upload the full repository folder while preserving the existing directory structure. The new styles and images are local assets and require no new runtime dependency. Clear the hosting/CDN cache after deployment if the previous stylesheet is cached.
