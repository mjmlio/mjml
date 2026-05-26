#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI_DIR="$ROOT_DIR/packages/mjml-cli"

cd "$ROOT_DIR"

echo "Building mjml-cli package..."
yarn workspace mjml-cli build >/dev/null

cd "$CLI_DIR"
PKG_TARBALL="$(npm pack --silent)"

echo "Created tarball: $PKG_TARBALL"

TMP_DIR="$(mktemp -d)"
cp "$PKG_TARBALL" "$TMP_DIR/"

cd "$TMP_DIR"
npm init -y >/dev/null
npm i "./$PKG_TARBALL" >/dev/null

echo "Installed tarball in temp project: $TMP_DIR"

./node_modules/.bin/mjml-cli --version

cat > smoke.mjml <<'EOF'
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>CLI package smoke test</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
EOF

./node_modules/.bin/mjml-cli smoke.mjml -o smoke.html >/dev/null

test -f smoke.html

echo "CLI pack smoke test passed"
echo "Artifact: $TMP_DIR/smoke.html"
