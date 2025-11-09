# Git & GitHub Complete Guide

> **A practical guide for daily Git operations, common problems, and solutions**

---

## 📑 Table of Contents

1. [Initial Setup](#initial-setup)
2. [Daily Git Commands](#daily-git-commands)
3. [Branch Management](#branch-management)
4. [Push to GitHub](#push-to-github)
5. [Common Problems & Solutions](#common-problems--solutions)
6. [Best Practices](#best-practices)

---
---


## 🚀 Initial Setup

### First Time Git Setup

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"

# Check configuration
git config --list
```

---


### Case 1: Start New Project (Local → GitHub)

**Step 1: Initialize Git**
```bash
# Navigate to your project
cd D:\Backend\MyProject

# Initialize Git
git init
```

**Step 2: Create .gitignore**
```bash
# Create .gitignore file
New-Item .gitignore

# Add common patterns
node_modules/
.env
*.log
dist/
build/
```

**Step 3: First Commit**
```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit"
```

**Step 4: Connect to GitHub**
```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/username/repo-name.git

# Push to GitHub
git push -u origin main
```

---


### Case 2: Clone Existing Project (GitHub → Local)

```bash
# Clone repository
git clone https://github.com/username/repo-name.git

# Navigate to folder
cd repo-name

# Start working
git status
```

---


### Case 3: Fork and Clone

```bash
# 1. Fork on GitHub (click Fork button)

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/repo-name.git

# 3. Add upstream
cd repo-name
git remote add upstream https://github.com/ORIGINAL-OWNER/repo-name.git

# 4. Check remotes
git remote -v
```

---
---


## 💻 Daily Git Commands

### Check Status

```bash
# See what changed
git status

# Short format
git status -s
```

---


### Add Files

```bash
# Add specific file
git add filename.js

# Add all files
git add .

# Add all JS files
git add *.js

# Add folder
git add src/
```

---


### Commit Changes

```bash
# Commit with message
git commit -m "Add login feature"

# Commit all tracked files
git commit -am "Fix bug in authentication"

# Amend last commit
git commit --amend -m "Updated message"
```

**Good Commit Messages:**
- ✅ `Add user authentication`
- ✅ `Fix login button bug`
- ✅ `Update README with setup instructions`
- ❌ `fix`
- ❌ `changes`
- ❌ `asdf`

---


### View History

```bash
# See commits
git log

# Short format (one line per commit)
git log --oneline

# Last 5 commits
git log --oneline -5

# With graph
git log --oneline --graph --all
```

---


### Undo Changes

```bash
# Discard changes in file
git restore filename.js

# Unstage file
git restore --staged filename.js

# Discard all local changes
git restore .
```

---


### Pull Latest Changes

```bash
# Pull from current branch
git pull

# Pull from specific branch
git pull origin main

# Pull with rebase (cleaner history)
git pull --rebase
```

---


### Push Changes

```bash
# Push to current branch
git push

# Push to specific branch
git push origin main

# Force push (use carefully!)
git push --force
```

---
---


## 🌿 Branch Management

### Why Use Branches?

- **Isolation:** Work on features without affecting main code
- **Collaboration:** Multiple people work simultaneously
- **Experimentation:** Try ideas safely
- **Organization:** Keep main branch stable

---


### Branch Naming Convention

**Format:** `type/description`

**Types:**
- `feature/` - New feature
- `fix/` - Bug fix
- `hotfix/` - Urgent fix
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Adding tests

**Examples:**
- ✅ `feature/user-login`
- ✅ `fix/header-alignment`
- ✅ `docs/api-documentation`
- ✅ `refactor/database-queries`
- ❌ `new-branch`
- ❌ `test123`

---


### Create Branch

```bash
# Create new branch
git branch feature/user-profile

# Create and switch to new branch
git checkout -b feature/user-profile

# OR (newer syntax)
git switch -c feature/user-profile
```

---


### Switch Branch

```bash
# Switch to branch
git checkout main

# OR (newer syntax)
git switch main

# Switch to previous branch
git checkout -
```

---


### List Branches

```bash
# List local branches
git branch

# List all branches (local + remote)
git branch -a

# List remote branches
git branch -r
```

---


### Rename Branch

```bash
# Rename current branch
git branch -m new-name

# Rename specific branch
git branch -m old-name new-name

# Example
git branch -m feature/login feature/user-authentication
```

**Push renamed branch to GitHub:**
```bash
# Delete old branch on GitHub
git push origin --delete old-name

# Push new branch
git push origin -u new-name
```

---


### Delete Branch

```bash
# Delete local branch (safe - won't delete if unmerged)
git branch -d feature/old-feature

# Force delete local branch
git branch -D feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature
```

---


### Merge Branch

```bash
# 1. Switch to main branch
git checkout main

# 2. Merge feature branch
git merge feature/user-login

# 3. Push merged changes
git push
```

---
---


## 📤 Push to GitHub

### First Time Push (New Branch)

```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Make changes
# ... edit files ...

# Add and commit
git add .
git commit -m "Add new feature"

# Push to GitHub (creates remote branch)
git push -u origin feature/new-feature
```

**Why `-u`?** Sets upstream tracking (next time just use `git push`)

---


### Regular Push

```bash
# Add changes
git add .

# Commit
git commit -m "Update feature"

# Push
git push
```

---


### Push All Branches

```bash
# Push all local branches to GitHub
git push --all

# Push all tags
git push --tags
```

---


### Update Remote Branch List

```bash
# Fetch updates from GitHub
git fetch

# Fetch and prune deleted branches
git fetch --prune
```

---
---


## ⚠️ Common Problems & Solutions

### Problem 1: Push Rejected (Non-Fast-Forward)

**Error:**
```
! [rejected] main -> main (non-fast-forward)
error: failed to push some refs
```

**Why:** Remote has commits you don't have locally

**Solution:**
```bash
# Option 1: Pull and merge
git pull
git push

# Option 2: Pull with rebase (cleaner)
git pull --rebase
git push

# Option 3: Force push (DANGER - only if you're sure!)
git push --force
```

---


### Problem 2: GitHub Secret Scanning Blocked Push

**Error:**
```
- Push cannot contain secrets
- Hugging Face User Access Token
- Google Cloud Service Account Credentials
```

**Why:** GitHub detected API keys, tokens, or credentials in your code

**Solution:**

**Step 1: Remove secret from file**
```bash
# Replace with environment variable
# Before: const API_KEY = "sk_12345..."
# After:  const API_KEY = process.env.API_KEY
```

**Step 2: Add to .gitignore**
```
.env
*.key
*.pem
serviceAccountkey.json
```

**Step 3: Remove from Git history**
```bash
# Replace secret in all commits
git filter-branch --force --tree-filter \
  "if [ -f secret-file.js ]; then sed -i 's/sk_[a-zA-Z0-9]*/REMOVED/g' secret-file.js; fi" \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin main --force
```

**Step 4: Revoke the exposed secret**
- Generate new API key
- Update `.env` file locally
- Never commit `.env` again

---


### Problem 3: Merge Conflicts

**Error:**
```
CONFLICT (content): Merge conflict in file.js
Automatic merge failed; fix conflicts and then commit
```

**Solution:**

**Step 1: Check conflicted files**
```bash
git status
```

**Step 2: Open file and fix conflicts**
```javascript
<<<<<<< HEAD
const value = "your changes";
=======
const value = "their changes";
>>>>>>> feature-branch
```

**Fix to:**
```javascript
const value = "merged changes";
```

**Step 3: Mark as resolved**
```bash
git add file.js
git commit -m "Resolve merge conflicts"
git push
```

---


### Problem 4: Accidentally Committed to Wrong Branch

**Solution:**

```bash
# 1. See the commit hash
git log --oneline -1

# 2. Switch to correct branch
git checkout correct-branch

# 3. Cherry-pick the commit
git cherry-pick <commit-hash>

# 4. Go back to wrong branch
git checkout wrong-branch

# 5. Remove the commit
git reset --hard HEAD~1
```

---


### Problem 5: Forgot to Pull Before Making Changes

**Error:**
```
Your branch and 'origin/main' have diverged
```

**Solution:**

```bash
# Option 1: Stash, pull, apply
git stash
git pull
git stash pop

# Option 2: Commit, pull with rebase
git add .
git commit -m "My changes"
git pull --rebase
git push
```

---


### Problem 6: Large File Error

**Error:**
```
remote: error: File large-file.zip is 120.00 MB; exceeds GitHub's 100 MB limit
```

**Solution:**

```bash
# Remove from last commit
git rm --cached large-file.zip
echo "large-file.zip" >> .gitignore
git commit --amend -m "Remove large file"
git push --force

# OR use Git LFS for large files
git lfs install
git lfs track "*.zip"
git add .gitattributes
git add large-file.zip
git commit -m "Add large file with LFS"
git push
```

---


### Problem 7: Permission Denied (SSH)

**Error:**
```
Permission denied (publickey)
```

**Solution:**

**Generate SSH key:**
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"

# Press Enter for default location
# Add passphrase (optional)

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

**Add to GitHub:**
1. Go to GitHub → Settings → SSH and GPG keys
2. Click "New SSH key"
3. Paste the key
4. Save

**Test:**
```bash
ssh -T git@github.com
```

**Switch remote to SSH:**
```bash
git remote set-url origin git@github.com:username/repo.git
```

---


### Problem 8: Detached HEAD State

**Error:**
```
You are in 'detached HEAD' state
```

**Why:** Checked out a specific commit instead of a branch

**Solution:**

```bash
# Create branch from current position
git checkout -b new-branch-name

# OR discard and go back to branch
git checkout main
```

---


### Problem 9: Accidentally Deleted Branch

**Solution:**

```bash
# Find the commit hash
git reflog

# Recreate branch
git checkout -b recovered-branch <commit-hash>
```

---


### Problem 10: Wrong Commit Message

**Solution:**

```bash
# Change last commit message (not pushed yet)
git commit --amend -m "Correct message"

# If already pushed
git commit --amend -m "Correct message"
git push --force-with-lease
```

---
---


## ✅ Best Practices

### 1. Commit Often

```bash
# ✅ Good - Small, focused commits
git commit -m "Add login form"
git commit -m "Add form validation"
git commit -m "Connect to API"

# ❌ Bad - Large commit
git commit -m "Complete entire login feature"
```

---


### 2. Pull Before Push

```bash
# Always pull first
git pull
git push
```

---


### 3. Use Branches

```bash
# ❌ Bad - Work directly on main
git checkout main
# make changes
git push

# ✅ Good - Use feature branches
git checkout -b feature/new-feature
# make changes
git push
# Create Pull Request on GitHub
```

---


### 4. Write Meaningful Commit Messages

**Format:** `Type: Short description`

```bash
# Good examples
git commit -m "feat: Add user registration"
git commit -m "fix: Resolve login timeout issue"
git commit -m "docs: Update API documentation"
git commit -m "refactor: Improve database queries"
git commit -m "test: Add unit tests for auth"
```

---


### 5. Use .gitignore

```bash
# Always add .gitignore before first commit
# Common patterns:
node_modules/
.env
.env.local
*.log
dist/
build/
.DS_Store
*.key
*.pem
```

---


### 6. Review Before Committing

```bash
# Check what you're committing
git status
git diff

# Then commit
git add .
git commit -m "Your message"
```

---


### 7. Sync Regularly

```bash
# Pull latest changes daily
git pull

# Push your changes regularly
git push
```

---


### 8. Clean Up Branches

```bash
# Delete merged branches
git branch -d feature/completed-feature

# Delete remote branch
git push origin --delete feature/completed-feature
```

---
---


## 🎯 Quick Reference

### Daily Workflow

```bash
# 1. Start your day
git pull

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Make changes
# ... edit files ...

# 4. Check changes
git status
git diff

# 5. Stage and commit
git add .
git commit -m "Add my feature"

# 6. Push to GitHub
git push -u origin feature/my-feature

# 7. Create Pull Request on GitHub
# 8. After merge, clean up
git checkout main
git pull
git branch -d feature/my-feature
```

---


### Common Commands Cheat Sheet

| Task | Command |
|------|---------|
| Initialize repo | `git init` |
| Clone repo | `git clone <url>` |
| Check status | `git status` |
| Add files | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push` |
| Pull | `git pull` |
| Create branch | `git checkout -b branch-name` |
| Switch branch | `git checkout branch-name` |
| List branches | `git branch` |
| Delete branch | `git branch -d branch-name` |
| Merge branch | `git merge branch-name` |
| View history | `git log --oneline` |
| Undo changes | `git restore filename` |
| Discard all changes | `git restore .` |

---


### Emergency Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Stash changes temporarily
git stash
git stash pop

# Discard all local changes
git restore .
git clean -fd

# Reset to remote state
git fetch origin
git reset --hard origin/main
```

---
---


## 🔗 Useful Resources

- **Git Documentation:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com
- **Interactive Git Tutorial:** https://learngitbranching.js.org
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf

---


## 📝 Summary

**Key Takeaways:**

1. **Always pull before push** - Avoid conflicts
2. **Use branches** - Keep main stable
3. **Commit often** - Small, focused changes
4. **Write good messages** - Future you will thank you
5. **Never commit secrets** - Use .env and .gitignore
6. **Review before push** - Check `git status` and `git diff`
7. **Clean up branches** - Delete after merge
8. **Sync regularly** - Pull and push daily

---

**🎉 Happy Coding!**
