# Architecture and data model

[← README](../README.md) · [Code reference](CODE-REFERENCE.md)

## Layering

```text
plugin_smartcommerce            ← this cartridge, first on the path
  controllers/                  ← new routes only; no base route is replaced
  scripts/checkout/checkoutHelpers.js          ← module.superModule wrapper
  scripts/helpers/basketCalculationHelpers.js  ← module.superModule wrapper
  templates/default/account/…   ← three SFRA template copies, one include each
app_storefront_base             ← untouched
```

## Request flows

```text
Product page (cacheable)
  app.template.afterFooter hook → config div + smart-commerce.js (same for every shopper)
  smart-commerce.js → GET SmartProduct-Panel?pid=<selected SKU>   (uncached, CSRF token)
                    → reloads on product:afterAttributeSelect
  panel forms → POST SmartProduct-Subscribe | StorePickup-Reserve | PriceLock-Create (AJAX, CSRF)
  store search → GET StorePickup-Stores (postal code | browser lat/long | IP location)

Email-code login
  EmailOtp-Show → POST EmailOtp-Request (code hash in session.privacy, email sent)
               → POST EmailOtp-Verify → CustomerMgr.loginExternallyAuthenticatedCustomer

Guest tracking and edits
  OrderLookup-Show → POST OrderLookup-Request → POST OrderLookup-Verify → OrderLookup-Details
  account/orderDetails.isml → remote include OrderEdit-Panel → POST OrderEdit-Address|CancelItem|ChangeVariant|Cancel

Checkout
  basketCalculationHelpers.calculateTotals → priceLock.syncBasket → base calculation
  checkoutHelpers.createOrder → storePickup.enforce → base createOrder
  checkoutHelpers.placeOrder  → base placeOrder → exportAfter, price locks, pickup code email

Business Manager
  PickupDesk-Start / PickupDesk-Verify (bm_extensions.xml menu action, module permission)
```

## Data model

| Object | Key | Written by | Read by |
| --- | --- | --- | --- |
| `SmartPriceHistory` | `productID\|currency` | RecordPriceHistory job | Product panel, price-history API |
| `SmartProductAlert` | `type\|SKU\|email` | `SmartProduct-Subscribe` | SendProductAlerts job |
| `SmartPriceLock` | UUID | `PriceLock-Create`, order placement | Basket calculation, panel, ExpirePriceLocks job |
| Order `smartPickupCode*` | — | `placeOrder` wrapper | Store Pickup Desk |
| Order `exportAfter` | — | `placeOrder` wrapper | Order export |
| `session.privacy.smartOtp*` | — | `otp.issue` | `otp.verify` |
| `session.privacy.smartTrackedOrder*` | — | `OrderLookup-Verify` | Order lookup and edit routes |

## Security boundaries

- **Codes:** six digits from `SecureRandom`, stored as SHA-256 of a random salt and the code.
  Ten-minute expiry, five attempts, single use.
- **Enumeration:** login and order-lookup responses are identical whether or not an account or
  order exists.
- **Ownership:** order edits require the registered owner or the session that verified that order
  by code; checked again on every post.
- **CSRF:** every storefront post validates the SFRA CSRF token; the Business Manager desk
  validates `dw.web.CSRFProtection`.
- **Caching:** the product panel, edit panel and lookup pages are never cached; the compare page
  contains no shopper data and uses the promotion-sensitive page cache.
- **Order integrity:** edits never re-price; totals can only stay equal or decrease, so the
  existing payment authorization still covers them.
- **Transactions:** small `Transaction.wrap` blocks per object; emails are sent outside them.
