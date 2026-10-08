# Troubleshooting

[← README](../README.md) · [Installation](INSTALLATION.md)

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Product panel never appears | Cartridge not first on the path, or `smart-commerce.js` not built | Check the path; run `npm run build` and upload `cartridge/static` |
| `Type does not exist: SmartPriceHistory` | Metadata not imported | Import `dist/smart-commerce-metadata.zip` |
| Store pickup missing from the panel | `smartPickupShippingMethodID` empty or not a site shipping method | Set it to your pickup method ID (SFRA demo: `005`) |
| "No nearby store has this item in stock" for a postal code | No Store Locator Data for the shopper's country, or no store inventory | Leave the postal code empty (uses location); check stores' `inventoryListId` and inventory records |
| Store Pickup Desk not in Business Manager | Cartridge not on the Business Manager path or module not granted | Add it to the BM site's cartridges; grant the module to the role |
| Add to Cart fails with `Unknown dynamic property` | Another cartridge in the chain reads a custom attribute whose metadata is missing | Import that cartridge's metadata or remove it from the path |
| No price history after the first run | First run records only the starting price | Change a price and run the job again |
| Alerts never sent | Job not scheduled, or alert expired | Check the job log; alerts expire after `smartAlertExpiryDays` |
| Email-code login refused | Account disabled or locked, or instance requires a registered provider | Check the customer; add OAuth2 provider `SmartEmailOtp` if needed |
| Order edit panel missing | Window closed, order exported or shipped, or not the owner | Expected; the window is `smartOrderEditWindowMinutes` from creation |
| Price lock discount missing | Lock expired or used by an earlier order, or price not above the locked price | Check `SmartPriceLock` status |
