# This product (Event Model SaaS)

Load with `github-ci-loop`. Portable procedure is `SKILL.md` (spec-loop).

## Merge to main

After merge to `main`, GitHub Actions workflow `.github/workflows/ci.yml` job `deploy` runs `npx wrangler deploy --keep-vars`. That job `needs` `test`. Its `if` includes `github.event_name == 'push'` and `github.ref == 'refs/heads/main'`. Secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are repo environment facts. `package.json` script `deploy` stays `wrangler deploy`; CI does not run that script.
