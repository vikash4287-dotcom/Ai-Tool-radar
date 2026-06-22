# Hostinger Deployment Guide

This guide explains how to successfully build and deploy this React Vite application to **Hostinger** (Shared Hosting, Cloud Hosting, or VPS).

---

## Why React/Vite Deployments Fail on Hostinger (and How We Fixed It)

When deploying a modern React single-page application (SPA) to shared hosting, two common issues arise:

1. **Direct URL / Refresh 404s**: When navigating to a page like `https://yoursite.com/trending` or `https://yoursite.com/collections` and refreshing the browser, the server returns a "404 Not Found" error. This happens because Hostinger tries to look for a physical folder on the disk.
2. **Broken asset paths in subdirectories**: If you deploy your app inside a subdirectory of `public_html` (e.g., `https://yoursite.com/portfolio/`), asset paths generated with absolute URLs (`/assets/...`) will break.

### What We Have Done to Fix This:
* **Relative Base Paths (`base: './'`)**: In `vite.config.ts`, we set the base path to `./`. This tells the builder to generate relative asset paths. Your app will load perfectly whether it is deployed to the root domain (`public_html/`) or a subdirectory (`public_html/subfolder/`).
* **Apache URL Rewrite (`.htaccess`)**: In `/public/.htaccess`, we've added professional Apache rewrite rules that automatically direct all direct route loads back to `index.html` so that client-side routing resolves them properly. It also configures performance-boosting **Gzip compression** and **Browser Expiry headers** to pass PageSpeed checks flawlessly!

---

## How to Deploy Your App (Step-by-Step)

### Option 1: Manual Upload via Hostinger File Manager (Recommended & Easy)

1. **Build the Application Locally**:
   Open a terminal in your project directory and run:
   ```bash
   npm run build
   ```
   This compiles your entire app into a ready-to-host `dist/` directory.

2. **Zip the Compiled Files**:
   Go inside the newly created `dist/` folder, select all its contents (`index.html`, `assets/`, `.htaccess`, etc.), and compress them into a `.zip` archive (e.g., `dist.zip`).
   > ⚠️ **Important**: Do *not* zip the `dist` folder itself, zipped should be the files *inside* it!

3. **Upload to Hostinger**:
   * Log into your **Hostinger hPanel**.
   * Go to **Websites** -> **Manage** -> **File Manager** (or connect via FTP client like FileZilla).
   * Open the target directory (usually `public_html`, or a subfolder if deploying to a subdirectory).
   * Upload your custom `dist.zip` file.
   * Right-click the `.zip` file inside hPanel and select **Extract**. Use `.` as the target path.
   * Delete the `.zip` file after extraction.

Your app is now Live! 🎉

---

## Option 2: Automated Deployment via GitHub Actions (The Developer Way)

If you have shared this project on GitHub, you can set up continuous deployment so that every time you push to the `main` branch, it automatically builds and uploads to Hostinger over FTP.

1. Create a folder in your project root named `.github/workflows/`.
2. Inside that directory, create a file named `deploy.yml`.
3. Add the following content to `deploy.yml`:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches:
      - main # Or your default branch name

jobs:
  web-deploy:
    name: Build & Upload to Hostinger
    runs-on: ubuntu-latest
    steps:
    - name: Get latest code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'

    - name: Install dependencies
      run: npm install

    - name: Build Project
      run: npm run build

    - name: Sync Files over SFTP/FTP
      uses: SamKirkland/FTP-Deploy-Action@v4.3.5
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/
        # Set server-dir to the absolute path where Hostinger hosts your files
        server-dir: public_html/ # Or public_html/subdirectory/
```

4. Go to your **GitHub Repository** -> **Settings** -> **Secrets and variables** -> **Actions**.
5. Add the following repository secrets:
   * `FTP_SERVER`: Your Hostinger FTP Host (e.g., `ftp.yoursite.com`).
   * `FTP_USERNAME`: Your FTP Account username.
   * `FTP_PASSWORD`: Your FTP Account password.

Every time you push new code to GitHub, the app builds and deploys itself automatically!

---

## Troubleshooting Checklist

* **Blank White Page**: Open the browser's developer console (F12). Check for any `404 Not Found` messages. If assets are not found, make sure you uploaded the files *inside* the `dist/` directory, rather than putting the `dist/` folder itself inside `public_html/`.
* **Database Connection Issues**: This application integrates with Firebase Firestore. Ensure that any env secrets are correctly formatted, and that your Firestore Security Rules (defined in `firestore.rules`) allow reads and writes from your deployment origin!
