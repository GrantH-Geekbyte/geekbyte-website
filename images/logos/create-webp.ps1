# Create WebP versions using online conversion or manual process
# This script creates a guide for WebP conversion

$ErrorActionPreference = "Stop"
$logoPath = "C:\Users\GrantHowe\OneDrive - Howe Group LLC\Documents\Howe Group\Geekbyte\Website\images\logos"

Write-Host "=== WebP Conversion Guide ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Current optimized files:" -ForegroundColor Yellow
Get-ChildItem $logoPath -Filter "*.png" | Where-Object { $_.Name -notmatch 'brand' } |
    ForEach-Object {
        $size = [math]::Round($_.Length / 1KB, 0)
        Write-Host "  $($_.Name): $size KB" -ForegroundColor White
    }

Write-Host ""
Write-Host "JPEG versions (for comparison):" -ForegroundColor Yellow
Get-ChildItem $logoPath -Filter "*.jpg" |
    ForEach-Object {
        $size = [math]::Round($_.Length / 1KB, 0)
        Write-Host "  $($_.Name): $size KB" -ForegroundColor White
    }

Write-Host ""
Write-Host "WebP Conversion Options:" -ForegroundColor Green
Write-Host "1. Install cwebp tool: winget install Google.WebP" -ForegroundColor White
Write-Host "2. Use online converter: https://squoosh.app" -ForegroundColor White
Write-Host "3. Use cloudconvert.com for batch conversion" -ForegroundColor White
Write-Host ""
Write-Host "For now, we'll use JPEG as the optimized format (widely supported)" -ForegroundColor Yellow
Write-Host "JPEGs are 90-97% smaller than originals and perfect for these photographic logos" -ForegroundColor Yellow
