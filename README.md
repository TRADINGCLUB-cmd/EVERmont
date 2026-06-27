# EVERmont

Static website deployment for the EVERMONT advisory site.

## Contents

- `index.html`
- `about.html`
- `services.html`
- `case-studies.html`
- `contact.html`
- `assets/`
- `vercel.json`

## Local Preview

Use Python to preview locally:

```powershell
python -m http.server --directory "C:\Users\Hp\Downloads\Website preview request (6)\uploads\INVESTO Final\site" 8001
```

Then open `http://127.0.0.1:8001/index.html`.

## Vercel Deployment

This repo is configured for a static Vercel deployment using `@vercel/static`.

1. Sign in to Vercel.
2. Import the GitHub repo: `TRADINGCLUB-cmd/EVERmont`.
3. Choose `Other` as the framework.
4. Leave build/output settings blank.
5. Deploy.

## Notes

- No build step is required for this static site.
- The `vercel.json` file is included to ensure Vercel serves all files correctly.
