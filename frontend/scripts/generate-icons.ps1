Add-Type -AssemblyName System.Drawing
$sourcePath = 'C:\Users\amaan\Desktop\New folder\Manthan\AI-MANTHAN\frontend\public\logos\image.png'
$source = [System.Drawing.Image]::FromFile($sourcePath)

$sizes = @(72, 96, 128, 144, 152, 180, 192, 384, 512)
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#06080d'))

foreach ($sz in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.FillRectangle($bgBrush, 0, 0, $sz, $sz)
    
    $pad = [int]($sz * 0.08)
    $destW = $sz - ($pad * 2)
    $destH = [int](($source.Height / $source.Width) * $destW)
    $destY = [int](($sz - $destH) / 2)
    $g.DrawImage($source, $pad, $destY, $destW, $destH)
    $g.Dispose()
    
    $name = if ($sz -eq 180) { 'apple-touch-icon.png' } else { "icon-$($sz)x$($sz).png" }
    $outPath = "C:\Users\amaan\Desktop\New folder\Manthan\AI-MANTHAN\frontend\public\icons\$name"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

foreach ($sz in @(192, 512)) {
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.FillRectangle($bgBrush, 0, 0, $sz, $sz)
    
    $pad = [int]($sz * 0.18)
    $destW = $sz - ($pad * 2)
    $destH = [int](($source.Height / $source.Width) * $destW)
    $destY = [int](($sz - $destH) / 2)
    $g.DrawImage($source, $pad, $destY, $destW, $destH)
    $g.Dispose()
    
    $outPath = "C:\Users\amaan\Desktop\New folder\Manthan\AI-MANTHAN\frontend\public\icons\icon-maskable-$($sz)x$($sz).png"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

$source.Dispose()
$bgBrush.Dispose()
Write-Output "Icons generated successfully"
