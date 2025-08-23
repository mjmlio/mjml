#!/bin/bash

# MJML Executable Downloader Script
# This script downloads the appropriate MJML executable for your platform

set -e

# Configuration
MJML_VERSION="4.15.3"
BASE_URL="https://github.com/mjmlio/mjml/releases/download/v${MJML_VERSION}"

# Detect platform
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLATFORM="linux"
    EXECUTABLE="mjml-linux-x64"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macos"
    EXECUTABLE="mjml-macos-x64"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    PLATFORM="win"
    EXECUTABLE="mjml-win-x64.exe"
else
    echo "Unsupported platform: $OSTYPE"
    exit 1
fi

DOWNLOAD_URL="${BASE_URL}/${EXECUTABLE}"
LOCAL_PATH="./mjml"

echo "Platform detected: $PLATFORM"
echo "Downloading MJML executable: $EXECUTABLE"
echo "From: $DOWNLOAD_URL"

# Download the executable
if command -v curl >/dev/null 2>&1; then
    curl -L -o "$LOCAL_PATH" "$DOWNLOAD_URL"
elif command -v wget >/dev/null 2>&1; then
    wget -O "$LOCAL_PATH" "$DOWNLOAD_URL"
else
    echo "Error: Neither curl nor wget is installed"
    exit 1
fi

# Make executable on Unix systems
if [[ "$PLATFORM" != "win" ]]; then
    chmod +x "$LOCAL_PATH"
fi

echo "✅ Downloaded MJML executable to: $LOCAL_PATH"

# Test the executable
echo "Testing the executable..."
if ./mjml --version >/dev/null 2>&1; then
    echo "✅ MJML executable works correctly!"
    echo "Version: $(./mjml --version)"
else
    echo "❌ MJML executable test failed"
    exit 1
fi

echo ""
echo "Usage examples:"
echo "  ./mjml input.mjml -o output.html"
echo "  ./mjml input.mjml -o output.html -w  # Watch mode"
echo "  ./mjml --help                         # Show all options"
echo ""
echo "The executable is now ready to use!" 