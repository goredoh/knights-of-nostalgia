---
name: Expo Metro watch errors
description: Recovering from ENOENT errors thrown by Metro's file watcher.
---

During Metro bundling, you may see:

```
Error: ENOENT: no such file or directory, watch '.../node_modules/.pnpm/<pkg>@<version>/node_modules/<pkg>_tmp_.../dist'
```

The `_tmp_...` path is a pnpm extraction temporary directory that may be removed while Metro is scanning `node_modules`.

**Why:** Metro's fallback watcher recursively watches `node_modules` and can race with pnpm's temporary extraction directories. The directory is not part of the package's real contents.

**How to apply:**
1. Confirm the temporary directory is gone (`find ... -type d -name '*_tmp_*'`).
2. Restart the artifact's managed Expo workflow (`artifacts/mobile: expo`).
3. Do not create custom `metro.config.js` or try to blacklist node_modules unless the error persists across multiple restarts.
