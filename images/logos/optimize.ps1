# Geekbyte Logo Optimization Script
# Optimizes PNG files by reducing dimensions while maintaining quality

$ErrorActionPreference = "Stop"
$logoPath = "C:\Users\GrantHowe\OneDrive - Howe Group LLC\Documents\Howe Group\Geekbyte\Website\images\logos"
$files = @("geekbyte-logo.png", "geekbyte-blue.png", "gator-matrix.png")

Write-Host "=== Geekbyte Logo Optimization ===" -ForegroundColor Cyan
Write-Host ""

# Load .NET assembly
Add-Type -AssemblyName System.Drawing

foreach ($file in $files) {
    Write-Host "Processing: $file" -ForegroundColor Yellow

    $sourcePath = Join-Path $logoPath "brand\$file"
    $targetPath = Join-Path $logoPath $file

    # Get original size
    $originalSize = (Get-Item $sourcePath).Length
    Write-Host "  Original: $([math]::Round($originalSize / 1MB, 2)) MB"

    # Load image
    $img = [System.Drawing.Image]::FromFile($sourcePath)

    # Target width (logos will be 600px max width on web)
    $targetWidth = 600
    $ratio = $targetWidth / $img.Width
    $targetHeight = [int]($img.Height * $ratio)

    Write-Host "  Resizing: $($img.Width)x$($img.Height) -> ${targetWidth}x${targetHeight}"

    # Create new bitmap
    $newImg = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($newImg)

    # Use high quality settings
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Draw resized image
    $graphics.DrawImage($img, 0, 0, $targetWidth, $targetHeight)

    # Save as PNG
    $newImg.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)

    # Clean up
    $graphics.Dispose()
    $newImg.Dispose()
    $img.Dispose()

    # Show result
    $newSize = (Get-Item $targetPath).Length
    $reduction = (($originalSize - $newSize) / $originalSize) * 100
    Write-Host "  Optimized: $([math]::Round($newSize / 1KB, 0)) KB (saved $([math]::Round($reduction, 1))%)" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Optimization complete!" -ForegroundColor Green
