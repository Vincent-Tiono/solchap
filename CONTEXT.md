# Solchap

Storefront for Kain Makna — browsing, cart, and checkout for Solar Chapter.

## Language

**Checkout Draft**:
The customer's in-progress, unsubmitted checkout form state, persisted to local storage while they fill it in. Editable at every field; not yet validated for submission.
_Avoid_: cart (the cart is the pre-checkout item selection, a separate concept), order state

**Order**:
The finalized set of customer, contact, shipping, and payment details submitted to and accepted by the server. Distinct from the Checkout Draft it was built from.
_Avoid_: purchase, transaction, checkout

**Contact Method**:
Which channel (WhatsApp or Line) the customer chooses to be reached at. Governs which contact fields are required.
_Avoid_: contact type, channel

**Shipping Method**:
Whether the order is Delivery or Self Pick-up. Governs which shipping fields (delivery city/postal code/address, or pickup location) are required.
_Avoid_: shipping type, fulfillment method
