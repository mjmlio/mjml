#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { pipeline } = require('stream');
const { promisify } = require('util');

const pipelineAsync = promisify(pipeline);

class MJMLDownloader {
    constructor(version = '4.15.3') {
        this.version = version;
        this.baseUrl = `https://github.com/mjmlio/mjml/releases/download/v${version}`;
        this.platform = this.getPlatform();
        this.executableName = this.getExecutableName();
        this.executablePath = path.join(__dirname, this.executableName);
    }

    getPlatform() {
        const platform = process.platform;
        if (platform === 'win32') return 'win';
        if (platform === 'darwin') return 'macos';
        return 'linux';
    }

    getExecutableName() {
        const extension = this.platform === 'win' ? '.exe' : '';
        return `mjml-${this.platform}-x64${extension}`;
    }

    async download() {
        const url = `${this.baseUrl}/${this.executableName}`;

        console.log(`Downloading MJML executable from: ${url}`);

        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(this.executablePath);

            https.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download: ${response.statusCode}`));
                    return;
                }

                response.pipe(file);

                file.on('finish', () => {
                    file.close();
                    // Make executable on Unix systems
                    if (this.platform !== 'win') {
                        fs.chmodSync(this.executablePath, '755');
                    }
                    console.log(`✅ Downloaded: ${this.executablePath}`);
                    resolve(this.executablePath);
                });
            }).on('error', (err) => {
                fs.unlink(this.executablePath, () => { }); // Delete file on error
                reject(err);
            });
        });
    }

    async ensureExecutable() {
        if (!fs.existsSync(this.executablePath)) {
            await this.download();
        }
        return this.executablePath;
    }

    async compile(inputFile, outputFile) {
        const executable = await this.ensureExecutable();

        console.log(`Compiling ${inputFile} to ${outputFile}...`);

        try {
            execSync(`"${executable}" "${inputFile}" -o "${outputFile}"`, {
                stdio: 'inherit'
            });
            console.log(`✅ Compiled successfully: ${outputFile}`);
        } catch (error) {
            console.error(`❌ Compilation failed: ${error.message}`);
            throw error;
        }
    }

    async compileString(mjmlContent, outputFile) {
        const executable = await this.ensureExecutable();

        console.log(`Compiling MJML string to ${outputFile}...`);

        try {
            execSync(`echo '${mjmlContent.replace(/'/g, "'\"'\"'")}' | "${executable}" -i -o "${outputFile}"`, {
                stdio: 'inherit',
                shell: true
            });
            console.log(`✅ Compiled successfully: ${outputFile}`);
        } catch (error) {
            console.error(`❌ Compilation failed: ${error.message}`);
            throw error;
        }
    }
}

// Example usage
async function main() {
    const downloader = new MJMLDownloader('4.15.3');

    // Example 1: Compile a file
    const testMjml = `
<mjml>
  <mj-head>
    <mj-title>Test Email</mj-title>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="20px" color="#333">
          Hello from MJML!
        </mj-text>
        <mj-button background-color="#007cba" color="white">
          Click me!
        </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
  `;

    // Write test file
    const inputFile = path.join(__dirname, 'test.mjml');
    const outputFile = path.join(__dirname, 'test.html');

    fs.writeFileSync(inputFile, testMjml);

    try {
        // Compile from file
        await downloader.compile(inputFile, outputFile);

        // Compile from string
        const outputFile2 = path.join(__dirname, 'test2.html');
        await downloader.compileString(testMjml, outputFile2);

        console.log('\n🎉 All examples completed successfully!');
        console.log(`Generated files: ${outputFile}, ${outputFile2}`);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        // Cleanup
        [inputFile, outputFile, path.join(__dirname, 'test2.html')].forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });
    }
}

if (require.main === module) {
    main();
}

module.exports = MJMLDownloader; 