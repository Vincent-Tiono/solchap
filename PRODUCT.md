# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: diaspora/overseas buyer making a pre-order support purchase — motivated by the mission (artisan livelihoods, clean water access) as much as the fabric itself. Browses the story, picks a kain, checks out via WhatsApp or Line contact.

Secondary (leftover from GoCart multi-vendor template, not real personas for this brand): store/admin routes (`app/admin`, `app/store`, `create-store`) exist in code but the public-facing product is single-brand, not a multi-seller marketplace. Treat these as internal ops tooling, not a public surface to design for.

## Product Purpose

Kain Makna storefront: sells a pre-order collection of handwoven kain (traditional cloth) made by Mama artisans of West Lakekun Village, East Nusa Tenggara (NTT), Indonesia, under Solar Chapter Asia Pacific. Success = completed pre-order checkouts that fund artisan livelihoods and the brand's clean-water-access mission.

## Positioning

Not a generic batik/kain retailer: each purchase is framed as directly funding two things a neighboring shop can't truthfully claim — sustaining Mama artisans' livelihoods in West Lakekun Village, and contributing to clean water access in underserved villages. The product is fabric + a specific, named, place-based impact story.

## Operating Context

- Checkout is pre-order (not stock-and-ship): customer submits a Checkout Draft (local-storage-persisted, editable) that becomes an Order only once submitted/accepted.
- Contact Method (WhatsApp or Line) gates which contact fields are required.
- Shipping Method (Delivery vs Self Pick-up) gates which shipping fields are required.
- Buyers may be in Indonesia or overseas; delivery timing is communicated as a window, not a fixed date.
- See `CONTEXT.md` for the full domain-language glossary (Checkout Draft, Order, Contact Method, Shipping Method) — durable authority for these terms.

## Capabilities and Constraints

- Built on a repurposed GoCart (Next.js 15 + Tailwind v4 + Prisma) multi-vendor storefront template. `app/admin`, `app/store`, `create-store`, per-username `shop/[username]` routes are inherited multi-vendor scaffolding, not part of the confirmed single-brand product surface.
- Prisma models present: User, Product, Order, OrderItem, Address, Coupon, Store — broader than what the single-brand product currently needs; do not treat unused model breadth as a product requirement.
- **Known-stale fact, flag don't blindly copy:** README states pre-order period "May 9 - May 31, 2026" with delivery "late May and June" — this window is already in the past as of today. Future work touching this copy should flag/update it rather than propagating it as current.

## Brand Commitments

- Product name: **Kain Makna**. Parent brand: **Solar Chapter Asia Pacific**.
- Contact: solchap.makna@gmail.com.
- Named place/community commitment: West Lakekun Village, East Nusa Tenggara (NTT) — Mama artisans, by name, are the makers; this is a factual attribution, not a generic "handmade" claim.
- Mission commitment: proceeds support clean water access to underserved villages, in addition to artisan livelihoods.
- Logo asset: `assets/logo.png` / `public/assets.js`. Additional brand imagery in `public/` (`solchap_nenek.png`, `solchap_support.png`, `apac_map.png`, `makna_1.png`, `makna_2.png`, `hero_*`, `product_img*`).
- Tone per README: warm, mission-forward ("wear the story, support the change").

## Evidence on Hand

- README.md carries the confirmed brand story, mission framing, and contact info — usable as real copy, not placeholder.
- Real product photography exists in `public/` (16 `product_img*` assets, hero images, artisan/impact photography).
- No customer testimonials, press, case studies, or sales data on hand — do not fabricate any.
- Sensitive files present in repo root (`.env`, service-account JSON, `2fa-recovery-codes.txt`) — not product evidence, do not surface or reference in any design output.

## Product Principles

1. Mission and product are inseparable — every commerce surface should carry the artisan/clean-water story, not bury it as a footer afterthought.
2. Design for the overseas/diaspora buyer first: trust-building (who made this, where, why it matters) matters as much as product specs.
3. Respect the pre-order mental model — communicate timing honestly, don't dress it up as in-stock e-commerce.
4. Contact Method and Shipping Method branching is a core interaction, not an edge case — both paths need equal design care.
5. Don't design or extend the inherited multi-vendor surfaces (admin/store/create-store) as if they were public brand-facing product, unless a future request explicitly asks to activate that direction.

## Accessibility & Inclusion

No product-specific accessibility requirement established yet.
