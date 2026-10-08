# Contributing

Start from `main` and create a focused `feature/`, `fix/`, or `docs/` branch. Keep behavior changes and documentation accurate together.

```sh
npm ci
npm run validate
npm run package:metadata
```

CI mocks cannot validate price books, inventory, mail delivery, order placement, Business Manager modules or metadata installation. For a platform behavior change, exercise the affected feature on a sandbox, following the sandbox checks in [docs/TESTING.md](docs/TESTING.md), and say in the PR which checks were automated and which were manual.

Script API objects throw on unknown properties and are strict about argument types (for example, `ProductPriceModel.getPrice` needs a `dw.value.Quantity`). Add a unit test that reproduces such behavior when you fix a regression.

Preserve these rules:

- one-time codes are stored only as salted hashes;
- every storefront post validates CSRF and re-checks ownership server-side;
- orders are never re-priced during edits;
- job iterators are closed in `finally`.

Keep credentials and generated output out of Git. Add new attributes to both the metadata and the installation guide, and new text to `smartcommerce.properties`.

See [NOTICE.md](NOTICE.md) for attribution and terms.
