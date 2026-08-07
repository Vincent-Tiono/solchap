# Unify order validation behind validateOrder(input)

The same rules (postal-code pattern, email pattern, WhatsApp-prefix check, required-field checks) were implemented twice: as live boolean flags in `lib/checkoutDraft.js` (client UX) and as fail-fast throws in `app/api/orders/route.js`'s `getOrderRows` (server enforcement). We're extracting a single deep module, `lib/validateOrder.js`, exporting `validateOrder(input)`, with one seam and two real adapters.

**Canonical vocabulary**: `validateOrder` speaks the Checkout Draft's vocabulary (enums `shippingMethod: 'delivery'|'self-pickup'`, `contactMethod: 'whatsapp'|'line'`, granular `whatsappCountryCode`/`whatsappNumber`) rather than the wire payload's label vocabulary (`"Delivery"`, `"WhatsApp"`, a flattened `contact` string). The server adapter normalizes labels to enums before calling in; no data is lost since the payload already carries the granular fields, `getOrderRows` just wasn't reading them.

**Return shape**: `{ valid, violations }`, where `violations` is an ordered array of `{ fields: string[], message }`. All violations are collected (not fail-fast), so the client adapter derives live, simultaneous per-field flags. Multi-field rules (e.g. "Delivery city, postal code, and address are required.") emit one violation per field, all sharing the original message text — the server adapter still throws a single `violations[0].message`, preserving today's toast copy and check ordering exactly. `validateOrder` normalizes (trims/stringifies) internally; adapters pass raw values through.

**Scope boundary**: personal-info and shipping-field rules move into `validateOrder`. Order-content integrity checks (items non-empty, totalPrice > 0) stay local to `route.js` — they guard a payload the client doesn't fully control and have no client-side equivalent.

## Consequences

- WhatsApp-prefix enforcement is tightened everywhere to the Checkout Draft's stricter rule (`+` must be followed by at least one character); the server previously accepted a bare `+`.
- The dead `"Address is required."` branch in `getOrderRows` (only reachable when `shippingMethod` arrives empty, which no caller does) is removed.
- The server adapter calls `validateOrder` first thing in `POST`, before `uploadPaymentProof` — invalid orders now fail fast instead of burning a Google Drive upload first.
