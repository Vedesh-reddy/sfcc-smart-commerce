# Code reference

[← README](../README.md) · [Architecture](ARCHITECTURE.md) · [Testing](TESTING.md)

All paths are relative to `cartridges/plugin_smartcommerce/cartridge`.

## Controllers

| Route | Method | Purpose |
| --- | --- | --- |
| `EmailOtp-Show` | GET | Sign-in (`mode=login`) or registration (`mode=register`) form |
| `EmailOtp-Request` | POST | Validates the email (and names), issues and emails a code |
| `EmailOtp-Verify` | POST | Verifies the code, links or creates the profile, signs in |
| `SmartProduct-Panel` | GET | Product panel for one SKU (uncached) |
| `SmartProduct-Subscribe` | POST (AJAX) | Price-drop or back-in-stock subscription |
| `SmartProduct-PriceHistory` | GET | Public JSON price history |
| `ProductCompare-Show` | GET | Compare page for `pids=a,b,c,d` |
| `StorePickup-Stores` | GET | Stores with stock near a postal code or coordinates |
| `StorePickup-Reserve` | POST (AJAX) | Adds the SKU to a pickup shipment |
| `PriceLock-Create` | POST (AJAX) | Creates a free or paid lock |
| `OrderLookup-Show / Request / Verify / Details` | GET / POST | Guest order tracking by code |
| `OrderEdit-Panel` | GET (include) | Modification panel on order details |
| `OrderEdit-Address / CancelItem / ChangeVariant / Cancel` | POST | Order edits within the window |
| `PickupDesk-Start / Verify` | Business Manager | Pickup code verification |

## Scripts

| Module | Exports |
| --- | --- |
| `scripts/otp.js` | `generateCode`, `generateSalt`, `hash`, `issue`, `verify`, `pendingSubject`, `MAX_ATTEMPTS` |
| `scripts/smartMail.js` | `send`, `sendCode` (through `emailHelpers.sendEmail`) |
| `scripts/priceHistory.js` | `currentPrice`, `record`, `summary` |
| `scripts/productAlerts.js` | `subscribe`, `isTriggered`, `setStatus`, `TYPE` |
| `scripts/productCompare.js` | `build` |
| `scripts/storePickup.js` | `pickupMethod`, `withStock`, `reserve`, `enforce`, `issueCode`, `verifyCode` |
| `scripts/priceLock.js` | `viewFor`, `create`, `syncBasket`, `onOrderPlaced`, `TYPE` |
| `scripts/orderSelfService.js` | `findForLookup`, `rememberTracked`, `trackedOrder`, `authorizedOrder`, `editableUntil`, `isEditable`, `toEditView`, `updateAddress`, `cancelItem`, `changeVariant`, `cancelOrder` |
| `scripts/hooks/afterFooter.js` | `afterFooter` (`app.template.afterFooter`) |
| `scripts/checkout/checkoutHelpers.js` | Base exports, with `createOrder` and `placeOrder` wrapped |
| `scripts/helpers/basketCalculationHelpers.js` | Base exports, with `calculateTotals` wrapped |

## Job steps (`steptypes.json`)

| Step type | Module | Behavior |
| --- | --- | --- |
| `custom.SmartCommerce.RecordPriceHistory` | `scripts/jobs/recordPriceHistory.js` | Records changed prices for all online products |
| `custom.SmartCommerce.SendProductAlerts` | `scripts/jobs/sendProductAlerts.js` | Sends triggered alerts, expires old ones |
| `custom.SmartCommerce.ExpirePriceLocks` | `scripts/jobs/expirePriceLocks.js` | Marks expired locks |

Each step returns `ERROR` when any item failed and logs a summary to `smart-commerce`.

## Templates

`smart/otp/*`, `smart/order/*`, `smart/product/*`, `smart/compare/page.isml`,
`smart/email/*`, `smart/bm/pickup-desk.isml`, and the three `account/` overlays listed in
[NOTICE.md](../NOTICE.md). Text lives in `templates/resources/smartcommerce.properties`.

## Browser module

`client/default/js/smart-commerce.js` inserts and reloads the product panel, submits panel forms
by AJAX, runs the store search (with browser geolocation), keeps the compare selection in
`localStorage` and renders the compare tray.
