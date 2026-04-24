import { Workspace } from '@biomejs/wasm-nodejs'

let workspace = null
let projectKey = null

function initializeBiome() {
  if (workspace !== null) {
    return
  }

  workspace = new Workspace()
  const proj = workspace.openProject({
    path: '/',
    openUninitialized: true,
  })

  projectKey = proj.projectKey

  workspace.updateSettings({
    projectKey,
    configuration: {
      formatter: {
        // `mj-raw position="file-start"` can prepend arbitrary text before the
        // HTML document, which Biome reports as parse errors even though the
        // rest of the output is still a valid HTML email we want to beautify.
        formatWithErrors: true,
      },
      css: {
        formatter: {
          enabled: true,
          indentStyle: 'space',
          indentWidth: 2,
          lineWidth: 240,
        },
      },
      html: {
        formatter: {
          enabled: true,
          indentStyle: 'space',
          indentWidth: 2,
          lineWidth: 240,
          selfCloseVoidElements: 'always',
          whitespaceSensitivity: 'ignore',
        },
      },
    },
    workspace_directory: '/',
  })
}

/**
 * Format HTML using Biome WASM (Node.js only).
 * Content before <!doctype html> (from mj-raw position="file-start") is split
 * off before passing to Biome — Biome's parser panics (uncatchable WASM panic)
 * if the document root is not a valid HTML document starting with a doctype.
 * @param {string} html - HTML content to format (in-memory)
 * @returns {string} formatted HTML
 */
function formatHtml(html) {
  initializeBiome()

  // Strip any content before <!doctype html> so Biome always receives a valid
  // HTML document. mj-raw position="file-start" can inject template tags here.
  const doctypeIndex = html.search(/<!doctype\s/i)
  const prefix = doctypeIndex > 0 ? html.slice(0, doctypeIndex) : ''
  const body = doctypeIndex > 0 ? html.slice(doctypeIndex) : html

  const filename = 'email.html'

  try {
    workspace.closeFile({ path: filename, projectKey })
  } catch (e) {
    // Ignore: file may not be open yet
  }

  workspace.openFile({
    path: filename,
    projectKey,
    content: {
      type: 'fromClient',
      content: body,
      version: 0,
    },
  })

  try {
    const result = workspace.formatFile({ path: filename, projectKey })
    return prefix + result.code
  } finally {
    workspace.closeFile({ path: filename, projectKey })
  }
}

export default {
  formatHtml,
}