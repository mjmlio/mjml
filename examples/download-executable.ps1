# MJML Executable Downloader Script for Windows
# This script downloads the MJML executable for Windows

param(
    [string]$Version = "4.15.3"
)

$ErrorActionPreference = "Stop"

# Configuration
$BaseUrl = "https://github.com/mjmlio/mjml/releases/download/v$Version"
$Executable = "mjml-win-x64.exe"
$DownloadUrl = "$BaseUrl/$Executable"
$LocalPath = ".\mjml.exe"

Write-Host "Downloading MJML executable: $Executable" -ForegroundColor Green
Write-Host "From: $DownloadUrl" -ForegroundColor Cyan

try {
    # Download the executable
    Write-Host "Downloading..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $LocalPath
    
    Write-Host "✅ Downloaded MJML executable to: $LocalPath" -ForegroundColor Green
    
    # Test the executable
    Write-Host "Testing the executable..." -ForegroundColor Yellow
    $version = & $LocalPath --version 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MJML executable works correctly!" -ForegroundColor Green
        Write-Host "Version: $version" -ForegroundColor Cyan
    } else {
        Write-Host "❌ MJML executable test failed" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "Usage examples:" -ForegroundColor Yellow
    Write-Host "  .\mjml.exe input.mjml -o output.html"
    Write-Host "  .\mjml.exe input.mjml -o output.html -w  # Watch mode"
    Write-Host "  .\mjml.exe --help                         # Show all options"
    Write-Host ""
    Write-Host "The executable is now ready to use!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error downloading or testing executable: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} 