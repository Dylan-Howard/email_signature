# Email Signature Builder

Automated build process for converting Google Font icons to GitHub-hosted PNGs in email signatures.

## Project Structure

```
email_signature/
├── signature.html          # Your source signature (input)
├── build.js               # Build script
├── package.json
├── .gitignore
├── output/                # Generated signatures (git-ignored)
│   └── signature.html
└── assets/               # Committed to GitHub
    └── icons/            # PNG icons
        ├── mail.png
        ├── call.png
        └── ...
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure GitHub settings in build.js:**
   - `GITHUB_USER`: Your GitHub username
   - `GITHUB_REPO`: Your repository name
   - `GITHUB_BRANCH`: Branch name (usually 'main')

3. **Create your source signature:**
   - Save your HTML signature as `signature.html` in the project root

## Usage

**Build the signature:**
```bash
npm run build
```

This will:
1. Scan `signature.html` for Google Fonts icon URLs
2. Download and convert SVGs to PNGs
3. Save PNGs to `assets/icons/`
4. Update icon URLs to point to GitHub
5. Output the updated signature to `output/signature.html`

**Clean generated files:**
```bash
npm run clean
```

## Workflow

1. Edit `signature.html` with your content
2. Run `npm run build`
3. Review `output/signature.html`
4. Commit and push `assets/icons/*.png` to GitHub
5. Copy `output/signature.html` to your email client

## Configuration

Edit these constants in `build.js`:

- `INPUT_FILE`: Source HTML file (default: `./signature.html`)
- `OUTPUT_DIR`: Where to save processed signature (default: `./output`)
- `ASSETS_DIR`: Where to save PNG icons (default: `./assets/icons`)
- `ICON_SIZE`: PNG dimensions in pixels (default: `24`)
- `GITHUB_USER`: Your GitHub username
- `GITHUB_REPO`: Repository name
- `GITHUB_BRANCH`: Branch name

## Notes

- Gmail strips `background-size` CSS, so ensure your background image is exactly 480×240px
- The script only processes Material Icons from `fonts.gstatic.com`
- Output directory is git-ignored; only commit source and assets
- Always test in Gmail after making changes