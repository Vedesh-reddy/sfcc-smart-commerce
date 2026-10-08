# Installation

[← README](../README.md) · [Merchant guide](MERCHANT-GUIDE.md) · [Troubleshooting](TROUBLESHOOTING.md)

## Requirements

- An SFCC sandbox with an SFRA storefront (tested on SFRA 8 with Bootstrap 5) and permission to
  upload code, change cartridge paths, import site archives and edit roles.
- Node.js 22 or later for the build.

## 1. Build

```sh
npm ci
npm run validate
```

`validate` lints JavaScript, ISML and documentation links, runs the unit tests and compiles
`client/default/js/smart-commerce.js` into `cartridge/static/default/js`.

## 2. Upload

Upload `cartridges/plugin_smartcommerce` (with `cartridge/static`) to your code version, for
example with your IDE, `sgmf-scripts --uploadCartridge` or the `b2c` CLI, using credentials
modelled on [`dw.example.json`](../dw.example.json).

## 3. Cartridge paths

**Storefront** — Administration → Sites → Manage Sites → your site → Settings. Put the cartridge first:

```text
plugin_smartcommerce:app_storefront_base:modules
```

Keep your site's other cartridges. Set the path before importing the jobs: job step types are
registered from `steptypes.json` in cartridges on the path.

**Business Manager** (for the Store Pickup Desk) — Administration → Sites → Manage Sites →
*Manage the Business Manager site* → Settings. Add `plugin_smartcommerce` to the cartridges.
Then in Administration → Organization → Roles & Permissions → your store-staff role →
Business Manager Modules, select the site and tick **Smart Commerce → Store Pickup Desk**.

## 4. Metadata

Change `site-id` in `metadata/smart-commerce/jobs.xml` to your site ID, then:

```sh
npm run package:metadata
```

Import `dist/smart-commerce-metadata.zip` through Administration → Site Development →
Site Import & Export.

| File | Imports |
| --- | --- |
| `meta/custom-objecttype-definitions.xml` | `SmartPriceHistory`, `SmartProductAlert` (90-day retention), `SmartPriceLock` (90-day retention) |
| `meta/system-objecttype-extensions.xml` | **Smart Commerce** site preferences; Order pickup-code attributes; SFRA in-store pickup attributes (`ProductLineItem.fromStoreId`, `Shipment.fromStoreId`, `Shipment.shipmentType`, `Store.inventoryListId`, `ShippingMethod.storePickupEnabled`) |
| `jobs.xml` | `SmartCommerce-PriceHistory` (daily 01:00 UTC), `SmartCommerce-Hourly` |

The pickup attributes use the same IDs as SFRA's in-store pickup plugin, which base basket
validation already reads; importing them again is harmless.

## 5. Site preferences

Merchant Tools → Site Preferences → Custom Preferences → **Smart Commerce**:

| Preference | Default | Purpose |
| --- | --- | --- |
| `smartOrderEditWindowMinutes` | 15 | Minutes after placement during which orders can change |
| `smartAlertExpiryDays` | 30 | Lifetime of price-drop and back-in-stock subscriptions |
| `smartCompareAttributes` | — | Comma-separated product attribute IDs for the compare page |
| `smartPickupShippingMethodID` | — | Pickup shipping method; empty hides store pickup |
| `smartPriceLockHours` | 24 | Lock duration |
| `smartPriceLockFreeGroups` | — | Customer groups that lock prices for free |
| `smartPriceLockFeeProductID` | — | Product bought as the lock fee; empty offers free locks only |

The sender of all emails is the existing `customerServiceEmail` preference.

## 6. Store pickup data

- **Shipping method:** in Merchant Tools → Ordering → Shipping Methods, choose the pickup method
  (SFRA demo data has `005` Store Pickup), tick **Store pickup enabled**, and set its ID in
  `smartPickupShippingMethodID`.
- **Store inventory:** give every pickup store its own inventory list, and set the store's
  **Inventory list ID** custom attribute (`inventoryListId`) to it.
- **Store search:** postal-code search needs Store Locator Data for the shopper's country
  (Administration → Global Preferences → Store Locator Data). Without it, shoppers leave the
  postal code empty and their browser location is used.

## 7. Jobs

Administration → Operations → Jobs: run `SmartCommerce-PriceHistory` once to record today's
prices, and check that both jobs are scheduled.

## 8. Email-code login

No configuration is needed. Verified customers get an external profile with provider ID
`SmartEmailOtp`. If your instance refuses external logins for unknown providers, add an OAuth2
provider with that ID in Administration → Global Preferences → OAuth2 Providers. On the author's
sandbox no provider was needed.
