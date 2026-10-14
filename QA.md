# Verification — 15 October 2026

## Checks completed

- Seven Node tests passed: complete audited product/package/service price rows; unique product/variant IDs and all referenced image files present; variant merging and totals; untrusted saved cart validation; SOLD/COMING SOON rejection; unknown prices and partial subtotal; WhatsApp units/destination/encoding; incomplete checkout rejection (grouped into seven test cases).
- JavaScript syntax checked for app, products, and commerce modules.
- Browser checked home, catalogue, product detail, business, and checkout at 360px, 768px and 1440px. No horizontal document overflow and no loaded broken images. Results: `qa/responsive.json`.
- Browser actions verified: inline search Gradasi → one result; select Creamy Nude → image and cart variant update; add product → Rp99,000; open drawer → checkout; add Reseller A package → mixed subtotal Rp544,000; remove both test items → empty cart. Mobile filter opens with all categories, colors, max-price and sort controls. Desktop product thumbnail changes select the corresponding official photograph.
- Business page rendered all 14 packages and 22 service rows. No browser console errors captured.
- No WhatsApp message was sent; URL/encoding and target were tested in the local commerce tests. Test cart was cleared through the UI.
- Screenshots: `qa/home-desktop.jpg`, `qa/catalog-mobile.jpg`, `qa/home-mobile.jpg` (where present). Desktop screenshot in a narrow app panel may be scaled by the browser capture surface; layout measurements were taken at actual requested viewport widths.

## Source completeness and honest limits

All 24 product records, 317 color/series/consultation choices, 14 bundles and 22 service rows from the audit are included. All 44 initially unclassified color/size reference files are available as local gallery images. All selected variant source images were materialized locally; the four PDF-only entries without an unambiguous source photograph use a labeled placeholder: Inner Tali, Armani Lasercut, Armani Panel Printing, Segenggam Motif.

Not a live inventory integration. Some numbered image cards have no verified individual color label and remain reference-gallery images plus admin consultation. Archived promotional videos are inventoried, not treated as new current sellable products. Four photographed collections require price confirmation; Segenggam Motif is marked coming soon. The full audit explains these cases. Wholesale tier prices are displayed but retail totals remain provisional pending admin confirmation of wholesale eligibility.

Preview is local at http://127.0.0.1:4320/ . No production deployment, payment processing, or external message sending was performed.
