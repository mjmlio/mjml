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
      html: {
        formatter: {
          enabled: true,
          indentStyle: 'space',
          indentWidth: 2,
          lineWidth: 240,
          selfCloseVoidElements: 'never',
          whitespaceSensitivity: 'ignore',
        },
      },
    },
    workspace_directory: '/',
  })
}

/**
 * Format HTML using Biome WASM (Node.js only)
 * @param {string} html - HTML content to format (in-memory)
 * @returns {string} formatted HTML
 */
function formatHtml(html) {
  initializeBiome()

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
      content: html,
      version: 0,
    },
  })

  try {
    const result = workspace.formatFile({ path: filename, projectKey })
    return result.code
  } finally {
    workspace.closeFile({ path: filename, projectKey })
  }
}

export default {
  formatHtml,
}


