#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const CLI_PACKAGE_PATH = path.join(__dirname, '../packages/mjml-cli');
const DIST_PATH = path.join(CLI_PACKAGE_PATH, 'dist');

// Test MJML template
const testMjml = `
<mjml>
  <mj-head>
    <mj-title>Test Email</mj-title>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          Hello World!
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

// Create test files
const testInputPath = path.join(__dirname, 'test-input.mjml');
const testOutputPath = path.join(__dirname, 'test-output.html');

fs.writeFileSync(testInputPath, testMjml);

console.log('Testing MJML executables...\n');

// Test each executable
const executables = [
    { name: 'Linux', file: 'mjml-linux-x64' },
    { name: 'Windows', file: 'mjml-win-x64.exe' },
    { name: 'macOS', file: 'mjml-macos-x64' }
];

executables.forEach(({ name, file }) => {
    const executablePath = path.join(DIST_PATH, file);

    if (!fs.existsSync(executablePath)) {
        console.log(`❌ ${name} executable not found: ${file}`);
        return;
    }

    try {
        console.log(`Testing ${name} executable...`);

        // Test help command
        const helpOutput = execSync(`"${executablePath}" --help`, {
            encoding: 'utf8',
            timeout: 10000
        });

        if (helpOutput.includes('MJML')) {
            console.log(`✅ ${name} help command works`);
        } else {
            console.log(`❌ ${name} help command failed`);
            return;
        }

        // Test version command
        const versionOutput = execSync(`"${executablePath}" --version`, {
            encoding: 'utf8',
            timeout: 10000
        });

        console.log(`✅ ${name} version: ${versionOutput.trim()}`);

        // Test compilation
        execSync(`"${executablePath}" "${testInputPath}" -o "${testOutputPath}"`, {
            timeout: 10000
        });

        if (fs.existsSync(testOutputPath)) {
            const output = fs.readFileSync(testOutputPath, 'utf8');
            if (output.includes('Hello World!')) {
                console.log(`✅ ${name} compilation works`);
            } else {
                console.log(`❌ ${name} compilation failed - output doesn't contain expected content`);
            }
            fs.unlinkSync(testOutputPath);
        } else {
            console.log(`❌ ${name} compilation failed - output file not created`);
        }

    } catch (error) {
        console.log(`❌ ${name} test failed: ${error.message}`);
    }

    console.log('');
});

// Cleanup
fs.unlinkSync(testInputPath);

console.log('🎉 Executable testing complete!'); 