# Development phases

[← README](../README.md)

The working implementation is organized into five reviewable delivery phases. These branches describe the repository's packaging and review structure; they do not claim to reproduce the original chronological development history.

Each phase has a dedicated feature branch and PR targeting `main`. Phases are merged in order, keeping their branches and merge commits for reference.

| Phase | Feature branch | Scope | Pull request |
| --- | --- | --- | --- |
| 01 · Foundation | `feature/phase-01-foundation` | Cartridge identity, job step types, Business Manager menu, custom objects, preferences, pickup attributes, jobs | [PR #1](https://github.com/Vedesh-reddy/sfcc-smart-commerce/pull/1) |
| 02 · Domain and jobs | `feature/phase-02-domain-jobs` | OTP, price history, alerts, price lock, store pickup, order self-service, compare, job steps, unit tests | [PR #2](https://github.com/Vedesh-reddy/sfcc-smart-commerce/pull/2) |
| 03 · Storefront | `feature/phase-03-storefront` | Controllers, templates, checkout wrappers, browser module, Store Pickup Desk | [PR #3](https://github.com/Vedesh-reddy/sfcc-smart-commerce/pull/3) |
| 04 · Tooling and quality | `feature/phase-04-tooling-quality` | npm dependencies, build, lint checks, metadata ZIP, GitHub Actions, PR template, contributing guide | [PR #4](https://github.com/Vedesh-reddy/sfcc-smart-commerce/pull/4) |
| 05 · Documentation | `feature/phase-05-documentation` | Per-feature README with highlighted screenshots, guides, attribution | [PR #5](https://github.com/Vedesh-reddy/sfcc-smart-commerce/pull/5) |

The same cartridge is integrated in [SFCC-RefArch](https://github.com/Vedesh-reddy/SFCC-RefArch) through PRs #13–#16 and #18.

## Review order

Start with the metadata, then `otp.js` and `orderSelfService.js` for the security rules, then the checkout wrappers. Review controllers' early returns and CSRF middleware before the templates and browser code. Use the screenshots to follow each feature end to end.

The final `main` branch contains all five phases. Build output is generated locally or downloaded from a successful GitHub Actions run; it is not committed.
