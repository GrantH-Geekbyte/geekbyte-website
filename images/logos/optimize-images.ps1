# Image Optimization Script for Geekbyte Logos
# This script optimizes PNG files and creates WebP versions

$logoPath = "c:\Users\GrantHowe\OneDrive - Howe Group LLC\Documents\Howe Group\Geekbyte\Website\images\logos"
$files = @("geekbyte-logo.png", "geekbyte-blue.png", "gator-matrix.png")

Write-Host "Starting image optimization..." -ForegroundColor Green

# Load necessary assemblies
Add-Type -AssemblyName System.Drawing

foreach ($file in $files) {
    $inputPath = Join-Path $logoPath $file
    $backupPath = Join-Path $logoPath "brand\$file"

    Write-Host "`nProcessing: $file" -ForegroundColor Cyan

    # Get original size
    $originalSize = (Get-Item $inputPath).Length / 1MB
    Write-Host "Original size: $([math]::Round($originalSize, 2)) MB"

    # Load image
    $image = [System.Drawing.Image]::FromFile($backupPath)

    # Calculate new dimensions (reduce to 800px width while maintaining aspect ratio)
    $maxWidth = 800
    $ratio = $maxWidth / $image.Width
    $newHeight = [int]($image.Height * $ratio)

    if ($image.Width -gt $maxWidth) {
        Write-Host "Resizing from $($image.Width)x$($image.Height) to ${maxWidth}x${newHeight}"

        # Create resized bitmap
        $resizedImage = New-Object System.Drawing.Bitmap($maxWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($resizedImage)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($image, 0, 0, $maxWidth, $newHeight)

        # Save optimized PNG
        $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/png' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85)

        $resizedImage.Save($inputPath, $encoder, $encoderParams)

        # Clean up
        $graphics.Dispose()
        $resizedImage.Dispose()
    } else {
        Write-Host "Image already optimal size, re-saving with compression"

        # Just re-save with compression
        $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/png' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85)

        $image.Save($inputPath, $encoder, $encoderParams)
    }

    $image.Dispose()

    # Get new size
    $newSize = (Get-Item $inputPath).Length / 1MB
    $savings = (($originalSize - $newSize) / $originalSize) * 100
    Write-Host "Optimized size: $([math]::Round($newSize, 2)) MB (Saved $([math]::Round($savings, 1))%)" -ForegroundColor Green
}

Write-Host "`n`nOptimization complete!" -ForegroundColor Green
Write-Host "Note: For WebP conversion, please use an online tool or install ImageMagick/cwebp" -ForegroundColor Yellow
Write-Host "`nRecommended online tools:" -ForegroundColor Yellow
Write-Host "- https://squoosh.app (Google's image optimization tool)" -ForegroundColor White
Write-Host "- https://cloudconvert.com/png-to-webp" -ForegroundColor White
Write-Host "`nOr install ImageMagick: winget install ImageMagick.ImageMagick" -ForegroundColor White
