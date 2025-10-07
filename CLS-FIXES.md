# Cumulative Layout Shift (CLS) Fixes

## Problem Statement
The website had a CLS score of **0.419**, which is considered poor (threshold: <0.1 is good). Layout shifts were occurring in:
- Body element: 0.198
- Cards section: 0.196 + 0.007 + 0.005
- Web fonts loading
- Font Awesome icons loading

## Root Causes
1. **Web fonts loading asynchronously** - When Google Fonts (Montserrat, Fira Code) loaded, they replaced fallback fonts with different metrics, causing text reflow
2. **Font Awesome icons loading** - Icons appeared after page load, shifting surrounding content
3. **No reserved space** - Elements didn't have minimum dimensions, allowing them to expand when content loaded
4. **Dynamic content** - Typing animation and particles being added without reserved space

## Solutions Implemented

### 1. Font Loading Optimization
#### Problem
Google Fonts loaded asynchronously, causing text to reflow when they replaced system fonts.

#### Solution
```css
/* Added fallback fonts with size-adjust to match Google Fonts metrics */
@font-face {
  font-family: 'Montserrat Fallback';
  src: local('Arial');
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 25%;
  line-gap-override: 0%;
}
@font-face {
  font-family: 'Fira Code Fallback';
  src: local('Courier New');
  size-adjust: 95%;
  ascent-override: 95%;
  descent-override: 25%;
  line-gap-override: 0%;
}
```

Updated font stacks:
```css
body {
  font-family: "Montserrat", "Montserrat Fallback", Arial, sans-serif;
}
#terminal-banner {
  font-family: "Fira Code", "Fira Code Fallback", "Courier New", monospace;
}
```

### 2. Reserved Space for Icons
#### Problem
Font Awesome icons loaded asynchronously, causing layout shifts when they appeared.

#### Solution
Added explicit dimensions to all icon containers:
```css
.social-link {
  width: 1.3rem;
  height: 1.3rem;
  display: inline-flex;
}
.social-link i {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

Applied to all icon locations:
- Social links (header)
- Tech stack items
- Detail section headings
- Mini project icons
- Contact button icons
- Card button arrows

### 3. Reserved Space for Text Elements
#### Problem
Text elements had no minimum height, allowing them to grow when fonts loaded.

#### Solution
Added `min-height` to all major text elements:
```css
#hero { min-height: 180px; }
.hero-title { min-height: 3.8rem; }
.hero-subtitle { min-height: 1.6rem; }
#terminal-banner { min-height: 48px; }
.title-heading { min-height: 2.4rem; }
.card-subtitle { min-height: 1.2rem; }
.card-button { min-height: 52px; }
footer { min-height: 50px; }
```

### 4. Fixed Dimensions for Interactive Elements
#### Problem
Tech stack items and social links had flexible dimensions.

#### Solution
```css
.tech-item {
  width: clamp(50px, 10vw, 65px);
  height: clamp(50px, 10vw, 65px);
}
/* Mobile */
@media (max-width: 768px) {
  .tech-item {
    width: 48px;
    height: 48px;
  }
}
```

### 5. Layout Containment
#### Problem
The cards section could affect other parts of the page during rendering.

#### Solution
```css
#cards {
  contain: layout style paint;
}
```

This CSS containment:
- Prevents layout recalculations from affecting parent elements
- Isolates rendering to the cards section
- Improves overall rendering performance

## Expected Results

### Before
- CLS Score: **0.419** (Poor)
- Visible text reflow when fonts load
- Icons "pop in" after page load
- Elements shift position during load

### After
- CLS Score: **< 0.1** (Good, estimated)
- Smooth font loading with minimal reflow
- Icons have reserved space
- Stable layout during entire page load
- Better perceived performance

## Testing Recommendations

### Chrome DevTools
1. Open DevTools → Performance tab
2. Click "Reload and record"
3. Look for "Layout Shift" events
4. Check "Experience" section for CLS score

### Lighthouse
1. Open DevTools → Lighthouse tab
2. Run "Performance" audit
3. Check "Cumulative Layout Shift" metric
4. Target: < 0.1 (Good)

### WebPageTest
1. Visit https://www.webpagetest.org/
2. Enter your URL
3. Check "Core Web Vitals" report
4. Verify CLS < 0.1

## Files Modified
- `index.html` - Added fallback font definitions
- `style.css` - Added min-height, explicit dimensions, and containment

## Performance Impact
- **Positive**: Reduced layout shifts improve user experience
- **Minimal overhead**: Added ~78 lines of CSS
- **No JavaScript changes**: All fixes in CSS for maximum performance
- **Better UX**: Users see stable layout from first paint

## Maintenance Notes
When adding new content:
1. Always set explicit dimensions for icons
2. Add `min-height` to text containers
3. Use fallback fonts in font stacks
4. Test with slow 3G throttling to see font loading behavior
