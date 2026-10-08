# Attribution and terms

This repository contains the `plugin_smartcommerce` extension developed by Vedesh Reddy for
Salesforce Storefront Reference Architecture (SFRA) storefronts, plus three template overlays
derived from SFRA. It is an SFRA extension, not an official Salesforce product.

The following overlays are adapted from SFRA templates, each adding one include or link:

- `account/orderDetails.isml`
- `account/components/oauth.isml`
- `account/components/trackOrderFormBillingZipCode.isml`

The cartridge also wraps SFRA's `checkoutHelpers` and `basketCalculationHelpers` through
`module.superModule` and uses SFRA's `server` module, middleware, models and helpers.
The applicable Salesforce terms are preserved in [SFRA-TERMS.txt](licenses/SFRA-TERMS.txt).

No MIT, Apache, or other open-source license is granted by this repository.
The npm package is marked private and `UNLICENSED`; it is not intended for npm publication.

Screenshots were captured on the author's sandbox on October 7–8, 2026.
Salesforce and Commerce Cloud names belong to their respective owners.
