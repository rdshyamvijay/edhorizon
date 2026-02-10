---
description: Automatically add, commit, and push all changes to GitHub
---

// turbo-all
1. Add all changes to git
```bash
git add .
```

2. Create a commit with a timestamp or generic message
```bash
git commit -m "Auto-sync: $(date +'%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
```

3. Push to the main branch
```bash
git push origin main || git push origin master
```
