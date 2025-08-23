#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const CLI_PACKAGE_PATH = path.join(__dirname, '../packages/mjml-cli');
const DIST_PATH = path.join(CLI_PACKAGE_PATH, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(DIST_PATH)) {
    fs.mkdirSync(DIST_PATH, { recursive: true });
}

console.log('Building MJML CLI package...');
execSync('yarn build', { cwd: CLI_PACKAGE_PATH, stdio: 'inherit' });

console.log('Installing pkg globally...');
execSync('npm install -g pkg', { stdio: 'inherit' });

console.log('Building executables...');
const targets = [
    'node18-linux-x64',
    'node18-win-x64',
    'node18-macos-x64'
];

targets.forEach(target => {
    const platform = target.includes('linux') ? 'linux' :
        target.includes('win') ? 'win' : 'macos';
    const extension = platform === 'win' ? '.exe' : '';
    const outputName = `mjml-${platform}-x64${extension}`;

    console.log(`Building for ${platform}...`);

    try {
        execSync(`pkg . --targets ${target} --output ${outputName}`, {
            cwd: CLI_PACKAGE_PATH,
            stdio: 'inherit'
        });

        // Move to dist directory
        const sourcePath = path.join(CLI_PACKAGE_PATH, outputName);
        const destPath = path.join(DIST_PATH, outputName);

        if (fs.existsSync(sourcePath)) {
            fs.renameSync(sourcePath, destPath);
            console.log(`✅ Built ${outputName}`);
        }
    } catch (error) {
        console.error(`❌ Failed to build for ${platform}:`, error.message);
    }
});

console.log('\n🎉 Build complete! Executables are available in packages/mjml-cli/dist/');
console.log('\nFiles created:');
fs.readdirSync(DIST_PATH).forEach(file => {
    console.log(`  - ${file}`);
}); 