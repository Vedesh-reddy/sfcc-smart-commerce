# Testing and validation

[← README](../README.md) · [Code reference](CODE-REFERENCE.md)

## Repeatable local checks

```sh
npm ci
npm run validate          # lint (JS, ISML, docs links) + tests + build
npm run package:metadata  # dist/smart-commerce-metadata.zip
```

CI runs the same on Node 22 and 24 for every push and pull request.

## Unit tests (23)

| File | Covers |
| --- | --- |
| `otp.js` | Six-digit codes, hash-only storage, single use, purpose binding, resend throttle, attempt limit, expiry |
| `priceHistory.js` | Change-only recording, master skipping, 30-day lowest including the price at the window start, 90-day pruning |
| `productAlerts.js` | Variant-only and in-stock rejection, deduplication, send-once, expiry, mail failure |
| `priceLock.js` | Discount amount × quantity, removal when not applicable, currency and guest guards, `Quantity` argument |
| `orderSelfService.js` | Lookup by email or phone, unplaced orders, owner and OTP authorization, window and status rules |
| `productCompare.js` | Product limits, enum/collection/markup values, undefined attribute IDs |

The tests mock Script API classes with `proxyquire`. Two Script API behaviors found on the
sandbox are reproduced: strict argument types and exceptions on unknown properties.

## Sandbox checks behind the screenshots

Performed on sandbox `zyeu-002`, site `RefArch_Practice`, October 7–8, 2026:

| Feature | Check | Result |
| --- | --- | --- |
| Email OTP | Wrong code, then the emailed code for an existing password account | Rejected, then signed in |
| Price history | Job at $99, price book to $79, job again | Two points, lowest $79 |
| Price-drop alert | Subscribe at $99, drop to $79, run job | One email |
| Back-in-stock alert | Allocation 0, subscribe twice, allocation 10, hourly job | Second subscription deduplicated; one email |
| Compare | Toggle three tiles, open compare | Configured attributes, price, availability, delivery |
| Store pickup | Near-me search, reserve, checkout with a home address | Order 00000103 kept the store address and pickup method |
| Pickup desk | Order 00000103 with the emailed code | Marked collected |
| Price lock | Lock at $135, price to $150, place order | Order 00000202 paid $135 |
| Guest tracking | Order 00000201 with the emailed code | Order details with edit panel |
| Modification window | Address change, item cancel; order cancel on 00000202 | All applied; order CANCELLED |

Not exercised live: the variant swap, because no same-price sibling was in stock.
