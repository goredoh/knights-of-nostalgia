---
name: Vite base-path assets
description: How to reference public/ assets in Vite artifacts served under a non-root preview path.
---

When a Vite artifact is served under a path prefix (e.g. `/knights-web/`), the `base` config is set to that prefix. Files placed in `public/` are emitted at `${base}/<public-path>`. Hardcoding `src="/assets/..."` in JSX breaks because the browser resolves that relative to the domain root, not the artifact base.

**Why:** Replit's proxy routes each artifact by its configured path, and Vite's `base` option only rewrites assets it processes. Unprocessed absolute paths in JSX are left as-is.

**How to apply:** Use `import.meta.env.BASE_URL` to prefix public assets:
```tsx
<img src={`${import.meta.env.BASE_URL}assets/kon-hero.jpg`} />
```

This applies to any static asset in `public/` referenced directly in JSX, CSS, or HTML.
