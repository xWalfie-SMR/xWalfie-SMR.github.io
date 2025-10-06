# Favicon Setup Instructions

## What you need to add:

The HTML now references these favicon files that you need to create:

1. **favicon.png** (32x32 pixels) - Standard favicon
2. **apple-touch-icon.png** (180x180 pixels) - For iOS devices
3. **preview.jpg** (1200x630 pixels recommended) - For social media sharing preview

## How to create them:

### Option 1: Online Generator (Easiest)

1. Go to https://favicon.io/
2. Choose "Text", "Image", or "Emoji"
3. Design your favicon
4. Download the package
5. Place files in your web directory

### Option 2: Manual Creation

1. Create a square image (suggestion: Python logo or your initials)
2. Use an image editor (Photoshop, GIMP, Canva, etc.)
3. Export at these sizes:
   - 32x32px → save as `favicon.png`
   - 180x180px → save as `apple-touch-icon.png`
   - 1200x630px → save as `preview.jpg`

### Option 3: Use Emoji as Favicon (Quick!)

1. Go to https://favicon.io/emoji-favicons/
2. Search for "python" or "robot" or any tech emoji
3. Download and extract
4. Rename `favicon-32x32.png` to `favicon.png`
5. Rename `apple-touch-icon.png` (already correct)

## Suggested Design Ideas:

- 🐍 Python snake emoji
- 🤖 Robot emoji
- Your initials "XW"
- Python logo
- Brain/AI icon

## Where to place the files:

Put all favicon files in the same directory as `index.html`:

```
web/
├── index.html
├── style.css
├── script.js
├── favicon.png          ← Add this
├── apple-touch-icon.png ← Add this
└── preview.jpg          ← Add this
```

## Current Status:

✅ HTML is ready and references the files
❌ Need to create the actual image files

Once you add the files, your site will have:

- Professional favicon in browser tabs
- Nice preview cards when shared on social media
- iOS home screen icon support
