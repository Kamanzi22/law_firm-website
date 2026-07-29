# Image Manifest

All images in this folder are generated SVG placeholders (solid navy gradient
+ subtle gold pattern), not stock photography. Replace each file in place
(keep the same filename and aspect ratio) with the real photo when available
— every page reference stays correct automatically.

| File | Used on | Recommended aspect ratio |
|---|---|---|
| `hero-office.svg` | Home hero background | 1920×1080 (16:9) |
| `about-story.svg` | About page — "Our Story" section | 1200×900 (4:3) |
| `office-exterior.svg` | Contact page — office photo | 1200×800 (3:2) |
| `map-placeholder.svg` | Contact page — map embed placeholder (swap for a real Google Maps embed) | 1200×700 |
| `og/default-og.svg` | Open Graph / social share image (referenced in `Seo.tsx`) | 1200×630 |
| `team/eric-mugisha.svg` | Team grid + bio — Eric Mugisha | 480×480 (1:1) |
| `team/aline-uwase.svg` | Team grid + bio — Aline Uwase | 480×480 (1:1) |
| `team/jean-paul-nshimiyimana.svg` | Team grid + bio — Jean Paul Nshimiyimana | 480×480 (1:1) |
| `team/claudine-ingabire.svg` | Team grid + bio — Claudine Ingabire | 480×480 (1:1) |
| `team/patrick-habimana.svg` | Team grid + bio — Patrick Habimana | 480×480 (1:1) |
| `team/diane-mukamana.svg` | Team grid + bio — Diane Mukamana | 480×480 (1:1) |
| `insights/foreign-investment.svg` | Insights card + article cover | 1200×630 |
| `insights/employment-contract.svg` | Insights card + article cover | 1200×630 |
| `insights/arbitration-litigation.svg` | Insights card + article cover | 1200×630 |

To add a new team member or article, add an entry to the relevant data file
(`src/data/team.ts` or `src/data/insights.ts`) and drop a same-named image in
the appropriate subfolder here.
