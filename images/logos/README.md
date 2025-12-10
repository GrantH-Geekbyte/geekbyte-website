# Geekbyte Logo Files - Quick Reference

## File Structure

### Production Files (Optimized for Web)
```
geekbyte-logo.webp    67 KB  - Modern browsers (best compression)
geekbyte-logo.jpg     67 KB  - Universal fallback
geekbyte-logo.png    405 KB  - Legacy browser fallback

geekbyte-blue.webp    85 KB  - Modern browsers
geekbyte-blue.jpg     85 KB  - Universal fallback
geekbyte-blue.png    431 KB  - Legacy browser fallback

gator-matrix.webp     44 KB  - Modern browsers
gator-matrix.jpg      44 KB  - Universal fallback
gator-matrix.png     332 KB  - Legacy browser fallback
```

### Original Files (Brand Assets)
```
brand/geekbyte-logo.png   1.85 MB - Original high-res
brand/geekbyte-blue.png   1.95 MB - Original high-res
brand/gator-matrix.png    1.51 MB - Original high-res
```

## Key Statistics
- **Original Total:** 5.4 MB
- **Optimized Total (WebP/JPEG):** 196 KB
- **Size Reduction:** 96.3%
- **Dimensions:** 400x400 pixels (down from 1024x1024)

## HTML Implementation
All logos use the modern `<picture>` element with format fallbacks:

```html
<picture>
    <source srcset="images/logos/geekbyte-logo.webp" type="image/webp">
    <source srcset="images/logos/geekbyte-logo.jpg" type="image/jpeg">
    <img src="images/logos/geekbyte-logo.png" alt="Geekbyte LLC Logo" class="logo-image">
</picture>
```

## Browser Support
- **WebP:** Chrome 23+, Firefox 65+, Safari 14+, Edge 18+ (96%+ coverage)
- **JPEG:** All browsers (100% coverage)
- **PNG:** All browsers (100% coverage)

## Usage Guidelines

### DO
✓ Use optimized files (webp/jpg/png) for all web pages
✓ Keep original files in brand/ folder for future editing
✓ Maintain the picture element structure when adding to new pages
✓ Add lazy loading to footer logos (`loading="lazy"`)

### DON'T
✗ Edit the optimized files directly
✗ Delete the brand/ folder (originals)
✗ Use original files directly on web pages
✗ Remove the picture element fallback chain

## Files Overview

| Purpose | Use These Files |
|---------|----------------|
| **Website (Production)** | .webp, .jpg, .png (optimized) |
| **Editing/Printing** | brand/*.png (originals) |
| **Email Signatures** | .jpg or .png (optimized) |
| **Social Media** | .jpg or .png (optimized) |
| **Print Materials** | brand/*.png (originals) |

## Performance Impact
- **Load Time Improvement:** 27x faster
- **Data Savings:** 5.1 MB per page load
- **Mobile Experience:** Significantly improved
- **SEO Benefit:** Better Core Web Vitals scores

## Maintenance
When adding new logos:
1. Save original to brand/ folder
2. Run `optimize-aggressive.ps1`
3. Update HTML with picture element
4. Test in multiple browsers

## Documentation
- **Full Report:** OPTIMIZATION-REPORT.md
- **Scripts:** optimize.ps1, optimize-aggressive.ps1

---

**Last Updated:** November 5, 2025
**Optimization Tool:** PowerShell + .NET System.Drawing
