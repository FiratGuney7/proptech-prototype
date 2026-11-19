# TEKCE Proptech: visual prototype

This is a static HTML/CSS prototype of the new **Corporate › Proptech** section. It is a visual reference only, not production code.

## Run it

```
python -m http.server 8765
```

Run it from the repository root, then open http://localhost:8765/ (it redirects to the Proptech overview). The pages also work when opened directly from disk.

The site is fully static, so it deploys to Vercel as-is: no build command, output directory = repository root.

The Peri logo concept board is at `concepts/peri-logo/index.html`.

## Structure

```
corporate/proptech/index.html          Landing page (Overview)
corporate/proptech/platform/           tekce.com + TEKCE App
corporate/proptech/keycost/            Purchase cost breakdown (name provisional)
corporate/proptech/teleproperty/       Remote purchase
corporate/proptech/telemortgage/       Remote mortgage
corporate/proptech/mytekce/            Dashboard: Buyer / Seller / Partner
corporate/proptech/peri/               AI transformation
assets/css/tekce-shell.css             Re-creation of the existing site chrome (already exists in production; do not port)
assets/css/proptech.css                Proptech design layer: tokens, components, per-product --accent
assets/css/pages/*.css                 Page-specific components
assets/js/proptech.js                  ~50 lines: mobile menu, reveal-on-scroll, accessible tabs
```

## Notes for development

- **Placement in Corporate.** Proptech is a Corporate subpage. A new **PROPTECH** pill sits in the Corporate tab band, and a sticky sub-navigation links the product pages.
- **Mockups are HTML/CSS, not images.** Names, locations and dashboard figures inside them are placeholders, and each mockup is labelled "illustrative" on the page.
- **KeyCost figures come from a real listing.** They are taken from listing ECN-00615 (North Cyprus). The Mersin listing COV-00298 shows purchase costs of 40.7% of the price, which looks like a data error. Check it before it is used anywhere.
- **Animation.** Scroll reveal only, switched off when the visitor prefers reduced motion. Expanders use native `<details>`.
- **Images.** Photos are hot-linked from Unsplash, and logos from static.tekce.com. Replace them with licensed or self-hosted assets.

## Open decisions (see PHASE-1_Research-and-Architecture.md §8)

1. Final name for KeyCost (alternatives: Unfold, DoorPrice, OpenTag, FullCost, TrueCost). Run a trademark check.
2. KeyCost launch date, which decides whether any "first" claim can be made.
3. WikiProperty: whether it exists and whether to include it.
4. TeleMortgage: partners beyond Habeno (Spain), and whether KYC still requires an office visit.
5. Whether to feature crypto payments. Currently they appear only in the timeline.
