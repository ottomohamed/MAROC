# التحقق من وجود الملف
if (Test-Path "src/vite-env.d.ts") {
    Write-Host "✅ الملف موجود" -ForegroundColor Green
    Write-Host "`n=== المحتوى الحالي ===" -ForegroundColor Cyan
    Get-Content "src/vite-env.d.ts"
} else {
    Write-Host "❌ الملف غير موجود، سيتم إنشاؤه" -ForegroundColor Yellow
}