# MJML Executable Examples

This directory contains examples of how to download and use the standalone MJML executables in different environments.

## Quick Start

### Linux/macOS
```bash
# Download and setup MJML executable
./download-executable.sh

# Use the executable
./mjml input.mjml -o output.html
```

### Windows (PowerShell)
```powershell
# Download and setup MJML executable
.\download-executable.ps1

# Use the executable
.\mjml.exe input.mjml -o output.html
```

### Node.js
```javascript
const MJMLDownloader = require('./download-executable.js');

const downloader = new MJMLDownloader('4.15.3');
await downloader.compile('input.mjml', 'output.html');
```

## Examples

### 1. Shell Script (`download-executable.sh`)

A bash script that automatically detects your platform and downloads the appropriate MJML executable.

**Features:**
- Platform detection (Linux, macOS, Windows)
- Automatic download using curl or wget
- Executable permissions setup
- Basic functionality test

**Usage:**
```bash
chmod +x download-executable.sh
./download-executable.sh
```

### 2. PowerShell Script (`download-executable.ps1`)

A PowerShell script for Windows users to download and setup the MJML executable.

**Features:**
- Windows-specific implementation
- Error handling
- Version parameter support
- Automatic testing

**Usage:**
```powershell
# Default version
.\download-executable.ps1

# Specific version
.\download-executable.ps1 -Version "4.15.3"
```

### 3. Node.js Module (`download-executable.js`)

A Node.js class that provides programmatic access to download and use MJML executables.

**Features:**
- Cross-platform support
- Promise-based API
- File and string compilation
- Automatic version management

**Usage:**
```javascript
const MJMLDownloader = require('./download-executable.js');

// Create downloader instance
const downloader = new MJMLDownloader('4.15.3');

// Compile from file
await downloader.compile('input.mjml', 'output.html');

// Compile from string
const mjmlContent = '<mjml><mj-body><mj-text>Hello!</mj-text></mj-body></mjml>';
await downloader.compileString(mjmlContent, 'output.html');
```

## Integration Examples

### GitHub Actions

```yaml
name: Build Email Templates
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Download MJML executable
        run: |
          curl -L -o mjml https://github.com/mjmlio/mjml/releases/download/v4.15.3/mjml-linux-x64
          chmod +x mjml
      
      - name: Compile templates
        run: |
          ./mjml templates/*.mjml -o dist/
```

### Docker

```dockerfile
FROM alpine:latest

# Download MJML executable
RUN wget -O /usr/local/bin/mjml https://github.com/mjmlio/mjml/releases/download/v4.15.3/mjml-linux-x64 \
    && chmod +x /usr/local/bin/mjml

# Use MJML
WORKDIR /app
COPY templates/ ./templates/
RUN mjml templates/*.mjml -o dist/

CMD ["mjml", "--help"]
```

### CI/CD Pipeline

```bash
#!/bin/bash

# Download MJML executable
MJML_VERSION="4.15.3"
curl -L -o mjml "https://github.com/mjmlio/mjml/releases/download/v${MJML_VERSION}/mjml-linux-x64"
chmod +x mjml

# Compile all templates
./mjml templates/*.mjml -o dist/

# Optional: Watch for changes
./mjml templates/*.mjml -o dist/ -w &
```

## Testing

After downloading an executable, you can test it with a simple MJML template:

```bash
# Create test template
cat > test.mjml << EOF
<mjml>
  <mj-head>
    <mj-title>Test</mj-title>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Hello World!</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
EOF

# Compile
./mjml test.mjml -o test.html

# Check output
cat test.html
```

## Troubleshooting

### Permission Denied
```bash
chmod +x mjml
```

### Download Failed
- Check your internet connection
- Verify the version number is correct
- Try downloading manually from the GitHub releases page

### Executable Not Found
- Ensure you're using the correct executable for your platform
- Check that the file was downloaded completely
- Verify the file path is correct

### Security Warnings (macOS)
- Go to System Preferences > Security & Privacy
- Click "Allow Anyway" for the MJML executable

## Version Management

To use a different version of MJML:

1. **Shell Script**: Edit the `MJML_VERSION` variable
2. **PowerShell**: Use the `-Version` parameter
3. **Node.js**: Pass the version to the constructor

```bash
# Shell script
MJML_VERSION="4.15.4" ./download-executable.sh

# PowerShell
.\download-executable.ps1 -Version "4.15.4"

# Node.js
const downloader = new MJMLDownloader('4.15.4');
```

## Support

For issues with the examples:
1. Check the main [EXECUTABLES.md](../EXECUTABLES.md) file
2. Verify you're using the latest version
3. Test with the Node.js version to isolate issues
4. Check the [GitHub issues](https://github.com/mjmlio/mjml/issues) 