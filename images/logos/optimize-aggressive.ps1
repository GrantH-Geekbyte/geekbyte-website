# Geekbyte Logo Aggressive Optimization Script
# Reduces file size dramatically while maintaining acceptable quality

$ErrorActionPreference = "Stop"
$logoPath = "C:\Users\GrantHowe\OneDrive - Howe Group LLC\Documents\Howe Group\Geekbyte\Website\images\logos"
$files = @("geekbyte-logo.png", "geekbyte-blue.png", "gator-matrix.png")

Write-Host "=== Aggressive Logo Optimization ===" -ForegroundColor Cyan
Write-Host ""

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

    # More aggressive size reduction (400px is plenty for web logos)
    $targetWidth = 400
    $ratio = $targetWidth / $img.Width
    $targetHeight = [int]($img.Height * $ratio)

    Write-Host "  Resizing: $($img.Width)x$($img.Height) -> ${targetWidth}x${targetHeight}"

    # Create new bitmap with 24-bit color
    $newImg = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($newImg)

    # High quality resizing
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    # Draw on white background
    $graphics.Clear([System.Drawing.Color]::White)
    $graphics.DrawImage($img, 0, 0, $targetWidth, $targetHeight)

    # Save as JPEG with 90% quality (much smaller than PNG for photos)
    $jpegPath = $targetPath -replace '\.png$', '.jpg'

    # Get JPEG encoder
    $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq 'image/jpeg' }

    # Set quality to 90%
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality, 90L)

    $newImg.Save($jpegPath, $jpegCodec, $encoderParams)

    # Also save PNG for backup
    $newImg.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)

    # Clean up
    $graphics.Dispose()
    $newImg.Dispose()
    $img.Dispose()

    # Show results
    $pngSize = (Get-Item $targetPath).Length
    $jpegSize = (Get-Item $jpegPath).Length
    $reduction = (($originalSize - $jpegSize) / $originalSize) * 100

    Write-Host "  PNG: $([math]::Round($pngSize / 1KB, 0)) KB" -ForegroundColor Yellow
    Write-Host "  JPEG: $([math]::Round($jpegSize / 1KB, 0)) KB (saved $([math]::Round($reduction, 1))%)" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Aggressive optimization complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Note: JPEG files are much smaller but don't support transparency." -ForegroundColor Yellow
Write-Host "For WebP conversion with transparency, we'll need additional tools." -ForegroundColor Yellow
