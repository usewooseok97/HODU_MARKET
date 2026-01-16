import { resolve } from 'path'
import { readFileSync, existsSync } from 'fs'

/**
 * Vite plugin for automatically importing and registering web components
 * based on custom element tags (folder-file format) found in HTML files.
 */
export function autoComponentsPlugin(options = {}) {
  const prefix = options.tagPrefix !== undefined ? options.tagPrefix : ''
  const componentDir = options.componentDir || 'src/component'
  const debug = options.debug || false

  // Cache for virtual modules (for HMR)
  const virtualModuleCache = new Map()

  return {
    name: 'vite-plugin-auto-components',

    // 1. Transform HTML: inject virtual module before <script> tags
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const htmlPath = ctx.filename
        const tags = parseCustomComponents(html, prefix)

        if (tags.length === 0) {
          if (debug) {
            console.log(`[auto-components] No components found in ${htmlPath}`)
          }
          return html
        }

        if (debug) {
          console.log(
            `[auto-components] Found components in ${htmlPath}:`,
            tags
          )
        }

        // Check if this is build mode (ctx.server is only available in dev mode)
        const isBuild = !ctx.server

        if (isBuild) {
          // Build mode: generate actual import statements
          const projectRoot = process.cwd()
          const importStatements = generateImports(
            htmlPath,
            projectRoot,
            componentDir,
            prefix,
            debug
          )

          // Inject import statements as inline script
          const injectedHtml = html.replace(
            /(<script[^>]+type=["']module["'][^>]*>)/,
            `<script type="module">\n${importStatements}</script>\n    $1`
          )

          return injectedHtml
        } else {
          // Dev mode: use virtual module
          const virtualId = `virtual:auto-components-${htmlPath}`

          // Inject virtual module import before <script type="module">
          const injectedHtml = html.replace(
            /(<script[^>]+type=["']module["'][^>]*>)/,
            `<script type="module">import '${virtualId}';</script>\n    $1`
          )

          return injectedHtml
        }
      },
    },

    // 2. Resolve virtual module IDs
    resolveId(id) {
      if (id.startsWith('virtual:auto-components-')) {
        // \0 prefix signals to Vite that this is a virtual module
        return '\0' + id
      }
    },

    // 3. Load virtual module content
    load(id) {
      if (id.startsWith('\0virtual:auto-components-')) {
        // Extract HTML path from virtual module ID
        const htmlPath = id.replace('\0virtual:auto-components-', '')
        const projectRoot = process.cwd()

        // Generate import statements
        const importCode = generateImports(
          htmlPath,
          projectRoot,
          componentDir,
          prefix,
          debug
        )

        // Cache for HMR
        virtualModuleCache.set(id, importCode)

        return importCode
      }
    },

    // 4. HMR support
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.html')) {
        if (debug) {
          console.log(`[auto-components] HTML file changed: ${file}`)
        }

        // Find and invalidate the corresponding virtual module
        const virtualId = '\0virtual:auto-components-' + file
        const module = server.moduleGraph.getModuleById(virtualId)

        if (module) {
          server.moduleGraph.invalidateModule(module)
          if (debug) {
            console.log(
              `[auto-components] Invalidated virtual module for ${file}`
            )
          }
          return [module]
        }
      }
    },
  }
}

/**
 * Parse HTML and extract custom element tags (folder-file format)
 * @param {string} html - HTML content
 * @param {string} prefix - Tag prefix to search for (default: '' - no prefix)
 * @returns {string[]} Array of unique tag names
 */
function parseCustomComponents(html, prefix = '') {
  // If prefix is empty, match all custom elements (must contain hyphen)
  // If prefix exists, match tags starting with that prefix
  const regex = prefix
    ? new RegExp(`<(${prefix}[\\w-]+)[^>]*>`, 'g')
    : new RegExp(`<([a-z][\\w]*-[\\w-]+)[^>]*>`, 'g')

  const tags = new Set()
  let match

  while ((match = regex.exec(html)) !== null) {
    const tagName = match[1]

    // Validate tag name format
    if (validateTagName(tagName, prefix)) {
      tags.add(tagName)
    }
  }

  return Array.from(tags)
}

/**
 * Validate tag name format
 * @param {string} tagName - Tag name to validate
 * @param {string} prefix - Expected prefix
 * @returns {boolean} True if valid
 */
function validateTagName(tagName, prefix) {
  // If prefix is empty, validate as standard custom element (must contain hyphen)
  // If prefix exists, validate with that prefix
  const pattern = prefix
    ? new RegExp(`^${prefix}[a-z][a-z0-9]*(-[a-z0-9]+)*$`)
    : new RegExp(`^[a-z][a-z0-9]*(-[a-z0-9]+)+$`)

  if (!pattern.test(tagName)) {
    console.warn(
      `[auto-components] Invalid tag name: <${tagName}>. ` +
        `Tag names must follow pattern: ${prefix ? prefix + '{name}' : '{folder-file}'} (lowercase, hyphens only)`
    )
    return false
  }

  return true
}

/**
 * Convert tag name to component file path
 * @param {string} tagName - Tag name (e.g., 'imput-button')
 * @param {string} prefix - Tag prefix
 * @returns {object} Object with kebab, pascal, and path properties
 */
function tagNameToPath(tagName, prefix) {
  // Remove prefix if exists: imput-button → imput-button (no prefix by default)
  const kebab = tagName.replace(new RegExp(`^${prefix}`), '')

  // Split by dash: imput-button → ['imput', 'button']
  const parts = kebab.split('-')

  if (parts.length < 2) {
    // Error: tag must be folder-file format
    const expectedFormat = prefix ? '<prefix-folder-file>' : '<folder-file>'
    console.error(
      `[auto-components] Invalid tag format: <${tagName}>. Must be ${expectedFormat}`
    )
    return {
      folder: null,
      file: null,
      paths: [],
    }
  }

  // Multiple parts: <imput-button> → imput/button.js
  const folder = parts[0]
  const fileBase = parts.slice(1).join('-') // button or input-field
  const filePascal = parts
    .slice(1)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('') // Button or InputField

  return {
    folder,
    file: fileBase,
    paths: [
      `@component/${folder}/${fileBase}.js`, // imput/button.js
      `@component/${folder}/${filePascal}.js`, // imput/Button.js (fallback)
      `@component/${folder}/index.js`, // imput/index.js (fallback)
    ],
  }
}

/**
 * Recursively scan .js files to find nested component usage
 * @param {string} componentPath - Path to component .js file
 * @param {string} projectRoot - Project root directory
 * @param {string} componentDir - Component directory
 * @param {string} prefix - Tag prefix
 * @param {Set} visited - Set of already visited files to prevent circular dependencies
 * @returns {Set<string>} Set of tag names found
 */
function scanComponentFile(componentPath, projectRoot, componentDir, prefix, visited = new Set()) {
  const tags = new Set()

  // Prevent circular dependencies
  if (visited.has(componentPath)) {
    return tags
  }
  visited.add(componentPath)

  if (!existsSync(componentPath)) {
    return tags
  }

  try {
    const jsContent = readFileSync(componentPath, 'utf-8')

    // Find innerHTML assignments and template literals
    const innerHTMLMatches = jsContent.match(/innerHTML\s*=\s*`([^`]*)`/gs)

    if (innerHTMLMatches) {
      for (const match of innerHTMLMatches) {
        const htmlContent = match.replace(/innerHTML\s*=\s*`|`/g, '')
        const foundTags = parseCustomComponents(htmlContent, prefix)

        foundTags.forEach(tag => {
          tags.add(tag)

          // Recursively scan nested components
          const { paths } = tagNameToPath(tag, prefix)
          for (const path of paths) {
            const relativePath = path.replace('@component/', '')
            const nestedComponentPath = resolve(projectRoot, componentDir, relativePath)

            if (existsSync(nestedComponentPath)) {
              const nestedTags = scanComponentFile(
                nestedComponentPath,
                projectRoot,
                componentDir,
                prefix,
                visited
              )
              nestedTags.forEach(t => tags.add(t))
              break
            }
          }
        })
      }
    }
  } catch (error) {
    console.warn(`[auto-components] Error scanning ${componentPath}:`, error.message)
  }

  return tags
}

/**
 * Generate import statements for components found in HTML
 * @param {string} htmlPath - Path to HTML file
 * @param {string} projectRoot - Project root directory
 * @param {string} componentDir - Component directory
 * @param {string} prefix - Tag prefix
 * @param {boolean} debug - Debug mode
 * @returns {string} JavaScript code with import statements
 */
function generateImports(htmlPath, projectRoot, componentDir, prefix, debug) {
  if (!existsSync(htmlPath)) {
    const warning = `// WARNING: HTML file not found: ${htmlPath}`
    console.warn(`[auto-components] ${warning}`)
    return warning
  }

  const html = readFileSync(htmlPath, 'utf-8')
  const allTags = new Set(parseCustomComponents(html, prefix))

  if (allTags.size === 0) {
    return `// No custom components found in ${htmlPath}\n`
  }

  // Scan each component file for nested components
  const visited = new Set()
  const tagsToScan = Array.from(allTags)

  for (const tag of tagsToScan) {
    const { paths } = tagNameToPath(tag, prefix)

    for (const path of paths) {
      const relativePath = path.replace('@component/', '')
      const componentPath = resolve(projectRoot, componentDir, relativePath)

      if (existsSync(componentPath)) {
        const nestedTags = scanComponentFile(
          componentPath,
          projectRoot,
          componentDir,
          prefix,
          visited
        )
        nestedTags.forEach(t => allTags.add(t))
        break
      }
    }
  }

  if (debug) {
    console.log(`[auto-components] All components (including nested):`, Array.from(allTags))
  }

  const imports = Array.from(allTags)
    .map((tag) => {
      const { paths } = tagNameToPath(tag, prefix)

      if (!paths || paths.length === 0) {
        return `// ERROR: Invalid tag format <${tag}>`
      }

      // Try each path until we find one that exists
      let foundPath = null

      for (const path of paths) {
        // Convert @component alias to actual path
        const relativePath = path.replace('@component/', '')
        const componentPath = resolve(projectRoot, componentDir, relativePath)

        if (existsSync(componentPath)) {
          foundPath = path
          break
        }
      }

      if (!foundPath) {
        const warning = `Component file not found for <${tag}>. Tried: ${paths.join(', ')}`
        console.warn(`[auto-components] WARNING: ${warning}`)
        return `// WARNING: ${warning}`
      }

      if (debug) {
        console.log(`[auto-components] Importing <${tag}> from ${foundPath}`)
      }

      return `import '${foundPath}'`
    })
    .join('\n')

  return `// Auto-generated imports for ${htmlPath}\n${imports}\n`
}
