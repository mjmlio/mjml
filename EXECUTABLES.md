# MJML Standalone Executables

This document explains how to build and use standalone MJML executables that don't require Node.js to be installed on the target machine.

## Building Executables

### Using GitHub Actions (Recommended)

The easiest way to get standalone executables is through GitHub Actions:

1. **Automatic builds on releases**: When you create a new tag (e.g., `v4.15.3`), the workflow automatically builds executables for all platforms.

2. **Manual builds**: You can trigger a manual build by:
   - Going to the "Actions" tab in the GitHub repository
   - Selecting "Build Standalone Executables"
   - Clicking "Run workflow"
   - Entering the version number

### Building Locally

To build executables locally:

```bash
# Install dependencies
yarn install

# Build all packages
yarn build

# Build executables
yarn build-executables
```

The executables will be created in `packages/mjml-cli/dist/`:
- `mjml-linux-x64` - Linux executable
- `mjml-win-x64.exe` - Windows executable  
- `mjml-macos-x64` - macOS executable

## Using the Executables

### Downloading from GitHub Releases

1. Go to the [GitHub releases page](https://github.com/mjmlio/mjml/releases)
2. Download the appropriate executable for your platform
3. Make the file executable (Linux/macOS): `chmod +x mjml-linux-x64`

### Usage

The standalone executables work exactly like the Node.js version:

```bash
# Basic usage
./mjml-linux-x64 input.mjml -o output.html

# Watch mode
./mjml-linux-x64 input.mjml -o output.html -w

# Multiple files
./mjml-linux-x64 *.mjml -o dist/

# From stdin
cat input.mjml | ./mjml-linux-x64 -i -o output.html

# Help
./mjml-linux-x64 --help
```

### Integration in Other Projects

#### Downloading in CI/CD

```yaml
# GitHub Actions example
- name: Download MJML executable
  run: |
    curl -L -o mjml https://github.com/mjmlio/mjml/releases/download/v4.15.3/mjml-linux-x64
    chmod +x mjml

- name: Use MJML
  run: ./mjml input.mjml -o output.html
```

#### Downloading in Docker

```dockerfile
# Dockerfile example
FROM alpine:latest

# Download MJML executable
RUN wget -O /usr/local/bin/mjml https://github.com/mjmlio/mjml/releases/download/v4.15.3/mjml-linux-x64 \
    && chmod +x /usr/local/bin/mjml

# Use MJML
CMD ["mjml", "--help"]
```

#### Downloading in Node.js Projects

```javascript
// Download and use MJML executable
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const mjmlUrl = 'https://github.com/mjmlio/mjml/releases/download/v4.15.3/mjml-linux-x64';
const mjmlPath = path.join(__dirname, 'mjml');

// Download if not exists
if (!fs.existsSync(mjmlPath)) {
  execSync(`curl -L -o ${mjmlPath} ${mjmlUrl}`);
  execSync(`chmod +x ${mjmlPath}`);
}

// Use MJML
execSync(`${mjmlPath} input.mjml -o output.html`);
```

#### Downloading in Shell Scripts

```bash
#!/bin/bash

# Download MJML executable
MJML_VERSION="4.15.3"
MJML_URL="https://github.com/mjmlio/mjml/releases/download/v${MJML_VERSION}/mjml-linux-x64"

if [ ! -f "./mjml" ]; then
  echo "Downloading MJML executable..."
  curl -L -o mjml "$MJML_URL"
  chmod +x mjml
fi

# Use MJML
./mjml input.mjml -o output.html
```

## Platform-Specific Notes

### Linux
- Works on most Linux distributions
- Requires glibc 2.17 or later
- Tested on Ubuntu 18.04+, CentOS 7+, Alpine Linux

### Windows
- Works on Windows 10/11 and Windows Server 2016+
- No additional dependencies required
- Can be run from Command Prompt or PowerShell

### macOS
- Works on macOS 10.15 (Catalina) and later
- May require allowing execution from unidentified developers
- To allow: `sudo spctl --master-disable` (use with caution)

## Troubleshooting

### Permission Denied
```bash
chmod +x mjml-linux-x64
```

### Security Warnings (macOS)
- Go to System Preferences > Security & Privacy
- Click "Allow Anyway" for the MJML executable

### File Not Found
- Ensure you're using the correct executable for your platform
- Check that the file was downloaded completely

### Performance
- Standalone executables are larger than the Node.js version
- They include the entire Node.js runtime
- Performance should be similar to the Node.js version

## Building Custom Executables

If you need to build executables with custom configurations:

1. Modify the `pkg` configuration in `packages/mjml-cli/package.json`
2. Run the build script: `yarn build-executables`
3. The executables will be in `packages/mjml-cli/dist/`

## Support

For issues with the standalone executables:
1. Check the [GitHub issues](https://github.com/mjmlio/mjml/issues)
2. Ensure you're using the latest version
3. Try the Node.js version to isolate if it's a packaging issue 