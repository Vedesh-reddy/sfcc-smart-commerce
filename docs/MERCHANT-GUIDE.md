# Merchant guide

[← README](../README.md) · [Installation](INSTALLATION.md) · [Troubleshooting](TROUBLESHOOTING.md)

## Settings at a glance

All settings live in Merchant Tools → Site Preferences → Custom Preferences → **Smart Commerce**.
See the [installation guide](INSTALLATION.md#5-site-preferences) for defaults.

## Jobs

| Job | Steps | Schedule | What to check |
| --- | --- | --- | --- |
| `SmartCommerce-PriceHistory` | RecordPriceHistory, SendProductAlerts | Daily 01:00 UTC | Log line `Price history recorded: N changed, M failed` |
| `SmartCommerce-Hourly` | SendProductAlerts, ExpirePriceLocks | Hourly | `Product alerts: N sent, N expired, N failed`, `Price locks expired: N` |

Logs are written to `custom-smart-commerce-*.log` (Administration → Site Development → Development Setup → Log Files).
The first price-history run records every product; later runs record only changes.

## Custom objects

Merchant Tools → Custom Objects → Custom Object Editor:

| Type | One record per | Useful fields |
| --- | --- | --- |
| `SmartPriceHistory` | SKU and currency | `priceHistory` (JSON change points) |
| `SmartProductAlert` | Alert type, SKU and email | `status`, `expiresAt`, `notifiedAt` |
| `SmartPriceLock` | Lock | `status`, `lockedPrice`, `expiresAt`, `feeOrderNo`, `usedOrderNo` |

Alerts and locks are deleted automatically 90 days after creation.

## Price changes and alerts

Change prices in price books as usual. A drop is reported the next time `SendProductAlerts`
runs after `RecordPriceHistory` (daily job) or within the hour (hourly job). Promotions do not
count as price changes.

## Store pickup desk

Merchant Tools → **Smart Commerce → Store Pickup Desk**. Enter the order number and the code the
customer shows from the pickup email:

| Result | Meaning |
| --- | --- |
| Code correct … marked collected | Hand the order over; the order is marked shipped and collected |
| Wrong code | Do not hand over; five wrong codes lock the order |
| Cannot be handed over here | Locked, cancelled or not open; contact customer service |
| Already collected | The order was handed over before |
| Not a store pickup order | The order has no pickup shipment |

## Order modification window

Orders are held from export until the window closes (`exportAfter`), so your OMS or export job
receives the final version. Customer cancellations within the window set the cancel code
`customer`. Refund or void the payment in your payment back office.

## Price lock

Members of `smartPriceLockFreeGroups` lock for free. To charge a fee, create a product (for
example "Price lock fee") priced in your price books and set its ID in `smartPriceLockFeeProductID`.
The lock activates when the fee order is placed.
