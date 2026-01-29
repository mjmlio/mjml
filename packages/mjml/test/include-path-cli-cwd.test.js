// Removed: CWD-based sandbox test. Recommended approaches:
// - Set --config.filePath to project templates root
// - Or use --config.includePath to explicitly allow sibling directories
// This test was removed to avoid ambiguity in relative include resolution.
describe('CLI CWD sandbox allows sibling includes without includePath', function () {
  it('skipped - see include-path-cli.test.js for supported CLI usage', function () {})
})
