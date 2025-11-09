# Git Security Cleanup - Step-by-Step Guide

## Problem Statement
Accidentally committed sensitive credentials (API keys, service account keys, tokens) to Git repository. GitHub Push Protection blocked the push due to exposed secrets.

---

## 🚨 Detected Secrets

1. **Google Cloud Service Account Credentials**
   - `GoogleVision/keyGoogle.json`
   - `Backend/serviceAccountkey.json`

2. **Hugging Face User Access Tokens**
   - `GoogleVision/Hugging_face.js`

---

## Solution Steps

### Step 1: Update `.gitignore` to Prevent Future Commits

**Why?** Prevent sensitive files from being tracked by Git in the future.

**Command:**
```bash
# Edit .gitignore file manually or use echo
# Add patterns to exclude sensitive files
```

**What to add:**
```gitignore
# Google Cloud / Firebase / API Keys
**/keyGoogle.json
**/serviceAccountKey.json
**/serviceAccountkey.json
google-credentials.json
firebase-adminsdk-*.json
gcp-credentials.json
credentials.json

# AWS Credentials
.aws/
aws-credentials.json

# SSL/TLS Certificates (Development)
*.key
*.crt
*.pem
*.csr
```

---

### Step 2: Remove Sensitive Files from Git Tracking

**Why?** Stop tracking sensitive files but keep them locally for development.

**Commands:**
```bash
# Navigate to repository
cd d:\Backend\BackendSelf

# Remove files from Git index (keeps local copy)
git rm --cached GoogleVision/keyGoogle.json
git rm --cached Backend/serviceAccountkey.json
```

**Output:**
```
rm 'GoogleVision/keyGoogle.json'
rm 'Backend/serviceAccountkey.json'
```

**What this does:**
- Removes files from Git staging area
- **Does NOT delete** the actual files from your computer
- Files remain in working directory for local use

---

### Step 3: Replace Hardcoded Secrets with Environment Variables

**Why?** Use environment variables instead of hardcoding sensitive data.

**Before:**
```javascript
const API_TOKEN = "hf_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX";  // Replace with actual token
```

**After:**
```javascript
const API_TOKEN = process.env.HUGGING_FACE_TOKEN;
```

**Manual Edit Required:**
- Update all files containing hardcoded secrets
- Replace with `process.env.VARIABLE_NAME`

---

### Step 4: Stage and Commit Changes

**Why?** Save the security improvements to Git history.

**Commands:**
```bash
# Stage all changes
git add -A

# Commit with descriptive message
git commit -m "Remove all sensitive credentials and replace with environment variables"
```

**Output:**
```
[main 56f3945] Remove all sensitive credentials and replace with environment variables
 2 files changed, 4 insertions(+), 21 deletions(-)
 delete mode 100644 Backend/serviceAccountkey.json
```

---

### Step 5: Remove Secrets from Entire Git History

**Why?** Simply deleting files in current commit is NOT enough. Secrets still exist in previous commits and can be accessed through Git history.

#### 5a. Remove Credential Files from History

**Command:**
```bash
git filter-branch --force \
  --index-filter "git rm --cached --ignore-unmatch GoogleVision/keyGoogle.json Backend/serviceAccountkey.json" \
  --prune-empty \
  --tag-name-filter cat \
  -- --all
```

**What this does:**
- `--force`: Overwrites existing backup
- `--index-filter`: Runs command on Git index (faster than tree-filter)
- `git rm --cached --ignore-unmatch`: Remove files, ignore if not found
- `--prune-empty`: Remove commits that become empty after filtering
- `--tag-name-filter cat`: Preserve tags
- `-- --all`: Apply to all branches and tags

**Output:**
```
Rewrite 265f108... (1/3)
rm 'Backend/serviceAccountkey.json'
rm 'GoogleVision/keyGoogle.json'
Rewrite 9805e6c... (2/3)
Ref 'refs/heads/main' was rewritten
```

#### 5b. Replace Hardcoded Tokens in History

**Command:**
```bash
git filter-branch --force \
  --tree-filter "if [ -f GoogleVision/Hugging_face.js ]; then sed -i 's/hf_[a-zA-Z0-9]*/HUGGING_FACE_TOKEN_REMOVED/g' GoogleVision/Hugging_face.js; fi" \
  --prune-empty \
  --tag-name-filter cat \
  -- --all
```

**What this does:**
- `--tree-filter`: Checks out each commit and runs command
- `sed -i 's/pattern/replacement/g'`: Replace all occurrences of Hugging Face tokens
- `hf_[a-zA-Z0-9]*`: Regex pattern matching Hugging Face token format

**Output:**
```
Rewrite 736d159... (1/3)
Rewrite 1769ff1... (2/3)
Ref 'refs/heads/main' was rewritten
```

---

### Step 6: Clean Up Git Database

**Why?** Rewriting history creates backup refs. We need to completely remove old objects from Git database.

#### 6a. Expire Reflog Entries

**Command:**
```bash
git reflog expire --expire=now --all
```

**What this does:**
- Reflog tracks when branch tips are updated
- `--expire=now`: Immediately expire all entries (default is 90 days)
- `--all`: Apply to all refs, not just current branch

#### 6b. Garbage Collect Old Objects

**Command:**
```bash
git gc --prune=now --aggressive
```

**What this does:**
- `git gc`: Cleanup unnecessary files and optimize repository
- `--prune=now`: Remove objects older than now (default is 2 weeks)
- `--aggressive`: More thorough optimization (slower but better compression)

**Output:**
```
Enumerating objects: 186, done.
Counting objects: 100% (186/186), done.
Delta compression using up to 12 threads
Compressing objects: 100% (169/169), done.
Writing objects: 100% (186/186), done.
Total 186 (delta 31), reused 0 (delta 0)
```

---

### Step 7: Force Push to Remote Repository

**Why?** Overwrite remote history with cleaned history. **Warning:** This is destructive!

**Command:**
```bash
git push origin main --force
```

**⚠️ Important Notes:**
- `--force`: Overwrites remote history (dangerous in team environments)
- Alternative: `--force-with-lease` (safer, fails if remote changed)
- Notify team members before force pushing

**Output:**
```
Enumerating objects: 179, done.
Counting objects: 100% (179/179), done.
Writing objects: 100% (179/179), 21.35 MiB | 386.00 KiB/s, done.
Total 179 (delta 24), reused 179 (delta 24)
To https://github.com/deluxDeepak/BackendTest-File.git
 * [new branch]      main -> main
```

---

## 🎉 Success Indicators

1. ✅ Push completed without GitHub Push Protection errors
2. ✅ Repository size may decrease after garbage collection
3. ✅ No sensitive data visible in `git log` or GitHub history
4. ✅ Files in `.gitignore` are not tracked

---

## 🔒 Post-Cleanup Security Steps

### 1. Revoke All Exposed Credentials

Even though removed from Git, secrets were exposed. **Must revoke immediately!**

#### Google Cloud Service Accounts:
```bash
# List service account keys
gcloud iam service-accounts keys list \
  --iam-account=deepak@daywise-db1s2.iam.gserviceaccount.com

# Delete compromised key
gcloud iam service-accounts keys delete KEY_ID \
  --iam-account=deepak@daywise-db1s2.iam.gserviceaccount.com
```

Or via Console:
1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
2. Select service account
3. Go to "Keys" tab
4. Delete old keys
5. Create new key

#### Hugging Face Tokens:
1. Go to: https://huggingface.co/settings/tokens
2. Revoke exposed tokens
3. Create new tokens with minimal permissions

---

### 2. Create `.env` File for Secrets

**Create file:** `.env` (already in .gitignore)

```env
# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=./GoogleVision/keyGoogle.json
GOOGLE_PROJECT_ID=daywise-db1s2

# Hugging Face
HUGGING_FACE_TOKEN=hf_YOUR_NEW_TOKEN_HERE

# Other APIs
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

**Install dotenv:**
```bash
npm install dotenv
```

**Load in code:**
```javascript
require('dotenv').config();

const token = process.env.HUGGING_FACE_TOKEN;
const projectId = process.env.GOOGLE_PROJECT_ID;
```

---

### 3. Verify Cleanup Success

**Check if secrets exist in history:**
```bash
# Search for patterns in all commits
git log -p -S "hf_" --all
git log -p -S "private_key" --all

# Should return empty or show only removed/replaced versions
```

**Check repository size:**
```bash
# Before and after should show size reduction
git count-objects -vH
```

**Verify .gitignore working:**
```bash
# Try to add sensitive file
git add GoogleVision/keyGoogle.json

# Should show: "The following paths are ignored by .gitignore"
```

---

## 📋 Quick Reference Commands

```bash
# Remove file from tracking (keep local)
git rm --cached path/to/file

# Stage all changes
git add -A

# Commit changes
git commit -m "Security: Remove sensitive files"

# Remove file from entire history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin main --force
```

---

## ⚠️ Important Warnings

1. **Force Push:** Rewrites history. Coordinate with team first!
2. **Revoke Credentials:** Removing from Git ≠ revoking access
3. **Backup:** Keep local backup before force operations
4. **Team Coordination:** All team members must `git pull --force` after cleanup
5. **Alternative Tools:** Consider `git-filter-repo` (faster, recommended by Git)

---

## 🛠️ Alternative: Using BFG Repo-Cleaner

**Faster and safer alternative to `git filter-branch`:**

```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy
git clone --mirror https://github.com/username/repo.git

# Remove specific file
java -jar bfg.jar --delete-files keyGoogle.json repo.git

# Replace text patterns
java -jar bfg.jar --replace-text passwords.txt repo.git

# Clean up
cd repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Push
git push
```

---

## 📚 Best Practices Going Forward

1. ✅ **Never commit credentials**
2. ✅ **Use environment variables**
3. ✅ **Use `.env` files** (add to .gitignore)
4. ✅ **Use secret management tools** (AWS Secrets Manager, HashiCorp Vault)
5. ✅ **Enable pre-commit hooks** to scan for secrets
6. ✅ **Regular security audits** of repository
7. ✅ **Rotate credentials regularly**

---

## 🔍 Tools for Prevention

### Pre-commit Hooks
```bash
# Install pre-commit
pip install pre-commit

# Add to .pre-commit-config.yaml
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
```

### Git-secrets by AWS
```bash
# Install
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
make install

# Setup
git secrets --install
git secrets --register-aws
```

---

## Summary

This cleanup process ensures:
- ✅ Sensitive files removed from current working tree
- ✅ Sensitive files removed from entire Git history
- ✅ Hardcoded secrets replaced with environment variables
- ✅ `.gitignore` configured to prevent future commits
- ✅ Repository pushed successfully to GitHub

**Remember:** Always revoke exposed credentials immediately!

---

**Last Updated:** November 6, 2025  
**Repository:** Backend-host  
**Branch:** main
