#!/usr/bin/env node

/**
 * Notion Export Ingestion Engine
 *
 * Transforms raw Notion exports into clean Astro content.
 *
 * Usage: node scripts/ingest-notion.js [options]
 *
 * Options:
 *   --source, -s  Source directory (default: ./_raw_exports)
 *   --dry-run     Preview changes without writing files
 *   --verbose     Show detailed logs
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Directories
  sourceDir: path.join(ROOT_DIR, '_raw_exports'),
  outputContentDir: path.join(ROOT_DIR, 'src', 'content', 'projects'),
  // Images go to public/ for direct URL access (most reliable with Astro)
  outputImagesDir: path.join(ROOT_DIR, 'public', 'images', 'projects'),

  // Tags disponibles (doivent correspondre à ceux définis dans config.ts)
  availableTags: [
    'Fullstack',
    'React',
    'Python',
    'Gestion de Projet',
    'IA',
    'Electronique',
    'Physique',
  ],

  // Mapping des projets vers leurs tags (extrait de la homepage Notion)
  projectTags: {
    'simulateur-parcoursup': ['Fullstack', 'React', 'Python'],
    'faire-parler-les-donnees-medicales': ['Python', 'Gestion de Projet', 'IA'],
    'redaction-de-projets-motives': ['IA', 'Fullstack', 'Python', 'React'],
    'conception-systeme-reduction-bruit-active': ['Electronique', 'Physique', 'Python'],
    'controle-freinage-reseau-neurones': ['Python', 'IA', 'Physique'],
    'adaptation-few-shot-modeles-vision-langage': ['Python', 'IA'],
    'traitement-sequences-enzymatiques-deep-learning': ['Python', 'IA', 'Physique'],
    'creation-radio': [],
    'creation-bot-morpion': [],
    'creation-imprimante-3d': [],
    'exploration-methodes-cryptographie': [],
    'projet-rehabilitation': [],
  },

  // Extensions d'images supportées
  imageExtensions: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],

  // Extensions de fichiers supportées (non-images)
  otherFileExtensions: ['.pdf', '.mp4', '.webm', '.mp3'],

  // Fichiers/dossiers à ignorer
  ignorePatterns: [
    /^Mon Portfolio.*\.md$/i, // Fichier index principal
    /^\./, // Fichiers cachés
  ],
};

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Generates a clean slug from a Notion filename
 * "Création d'un Bot Morpion 18ebdf16c65b8006a71fd72930427e92.md" -> "creation-bot-morpion"
 */
function generateSlug(filename) {
  // Remove extension
  let name = filename.replace(/\.md$/i, '');

  // Remove Notion hash (32 hex chars at the end)
  name = name.replace(/\s+[a-f0-9]{32}$/i, '');

  // Normalize and slugify
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .replace(/['\u2019]/g, '') // Remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, '') // Trim dashes
    .replace(/-+/g, '-'); // Collapse multiple dashes
}

/**
 * Extracts title from Markdown content (first H1)
 */
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Extracts date from content (pattern: *Projet ... - YYYY*)
 */
function extractDate(content) {
  const match = content.match(/\*[^*]*(\d{4})\*/) || content.match(/[–—-]\s*(\d{4})/);
  return match ? match[1] : null;
}

/**
 * Extracts description from content (first blockquote or first paragraph after title)
 */
function extractDescription(content) {
  // Try blockquote first
  const blockquoteMatch = content.match(/^>\s*(.+?)(?:\n(?!>)|$)/m);
  if (blockquoteMatch) {
    return blockquoteMatch[1].replace(/\*\*/g, '').trim().slice(0, 200);
  }

  // Fall back to first paragraph
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('*') && !trimmed.startsWith('[')) {
      return trimmed.replace(/\*\*/g, '').slice(0, 200);
    }
  }

  return null;
}

/**
 * Cleans filename for web usage
 */
function cleanFilename(filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);

  const cleanBase = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');

  return cleanBase + ext.toLowerCase();
}

/**
 * Escapes special regex characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Rewrites image/file paths in markdown content
 * Uses absolute paths to public/ folder
 */
function rewriteFilePaths(content, slug, fileMapping) {
  let newContent = content;

  for (const [originalName, newName] of Object.entries(fileMapping)) {
    // The new path is an absolute URL path to public/images/projects/{slug}/
    const newPath = `/images/projects/${slug}/${newName}`;

    // Multiple patterns to catch various Notion export formats
    const escapedOriginal = escapeRegex(originalName);
    const escapedEncoded = escapeRegex(encodeURIComponent(originalName));

    // Pattern: ![alt](filename) or ![alt](folder/filename)
    const imgPatterns = [
      new RegExp(`!\\[([^\\]]*)\\]\\((?:[^)]*[/\\\\])?${escapedOriginal}\\)`, 'gi'),
      new RegExp(`!\\[([^\\]]*)\\]\\((?:[^)]*[/\\\\])?${escapedEncoded}\\)`, 'gi'),
    ];

    for (const pattern of imgPatterns) {
      newContent = newContent.replace(pattern, `![$1](${newPath})`);
    }

    // Pattern: [text](filename) for other files (PDF, etc)
    const linkPatterns = [
      new RegExp(`\\[([^\\]]*)\\]\\((?:[^)]*[/\\\\])?${escapedOriginal}\\)`, 'gi'),
      new RegExp(`\\[([^\\]]*)\\]\\((?:[^)]*[/\\\\])?${escapedEncoded}\\)`, 'gi'),
    ];

    for (const pattern of linkPatterns) {
      newContent = newContent.replace(pattern, `[$1](${newPath})`);
    }
  }

  return newContent;
}

/**
 * Removes the first H1 from content (will be in frontmatter)
 */
function removeFirstH1(content) {
  return content.replace(/^#\s+.+\n+/, '');
}

/**
 * Removes Notion-specific artifacts
 */
function cleanNotionArtifacts(content) {
  return content
    // Remove Notion block links (links with 32-char hashes)
    .replace(/\[([^\]]+)\]\([^)]*%20[a-f0-9]{32}[^)]*\)/gi, '$1')
    // Clean up excessive newlines
    .replace(/\n{4,}/g, '\n\n\n')
    // Remove trailing whitespace on lines
    .replace(/[ \t]+$/gm, '');
}

// ============================================================================
// MAIN INGESTION LOGIC
// ============================================================================

async function findMarkdownFiles(dir) {
  const files = [];

  async function walk(currentDir) {
    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch (err) {
      console.warn(`  Warning: Could not read directory ${currentDir}`);
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        // Don't recurse into folders that look like Notion asset folders
        // (they have the same name as the .md file, possibly with hash)
        const looksLikeAssetFolder = entries.some(
          (e) => e.isFile() && e.name.endsWith('.md') &&
          entry.name.startsWith(e.name.replace(/\s+[a-f0-9]{32}\.md$/i, '').replace(/\.md$/i, ''))
        );
        if (!looksLikeAssetFolder) {
          await walk(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // Check if should be ignored
        const shouldIgnore = CONFIG.ignorePatterns.some((pattern) => pattern.test(entry.name));
        if (!shouldIgnore) {
          files.push(fullPath);
        }
      }
    }
  }

  await walk(dir);
  return files;
}

async function processProject(mdPath, options) {
  const { dryRun, verbose } = options;

  const filename = path.basename(mdPath);
  const slug = generateSlug(filename);

  if (verbose) console.log(`\n  Processing: ${filename}`);
  if (verbose) console.log(`  Slug: ${slug}`);

  // Read markdown content
  const content = await fs.readFile(mdPath, 'utf-8');

  // Extract metadata
  const title = extractTitle(content) || filename.replace(/\.md$/, '');
  const date = extractDate(content);
  const description = extractDescription(content);
  const tags = CONFIG.projectTags[slug] || [];

  if (verbose) {
    console.log(`  Title: ${title}`);
    console.log(`  Date: ${date || 'N/A'}`);
    console.log(`  Tags: ${tags.length > 0 ? tags.join(', ') : 'None'}`);
  }

  // Find and process assets (images, PDFs, etc.)
  const mdDir = path.dirname(mdPath);
  const siblingEntries = await fs.readdir(mdDir, { withFileTypes: true });
  const fileMapping = {};
  let coverImage = null;

  // Find associated asset folder
  const cleanName = path.basename(mdPath, '.md').replace(/\s+[a-f0-9]{32}$/i, '');

  const assetFolder = siblingEntries.find((entry) => {
    if (!entry.isDirectory()) return false;
    const folderCleanName = entry.name.replace(/\s+[a-f0-9]{32}$/i, '');
    return folderCleanName === cleanName || entry.name.startsWith(cleanName);
  });

  if (assetFolder) {
    const assetFolderPath = path.join(mdDir, assetFolder.name);
    const assetFiles = await fs.readdir(assetFolderPath);
    const outputDir = path.join(CONFIG.outputImagesDir, slug);

    if (!dryRun) {
      await fs.mkdir(outputDir, { recursive: true });
    }

    for (const assetFile of assetFiles) {
      const ext = path.extname(assetFile).toLowerCase();
      const isImage = CONFIG.imageExtensions.includes(ext);
      const isOtherFile = CONFIG.otherFileExtensions.includes(ext);

      if (isImage || isOtherFile) {
        const cleanedName = cleanFilename(assetFile);
        fileMapping[assetFile] = cleanedName;

        // First PNG/JPG becomes cover
        if (!coverImage && isImage && ['.png', '.jpg', '.jpeg'].includes(ext)) {
          coverImage = cleanedName;
        }

        if (!dryRun) {
          const srcPath = path.join(assetFolderPath, assetFile);
          const destPath = path.join(outputDir, cleanedName);
          await fs.copyFile(srcPath, destPath);
        }

        if (verbose) console.log(`  Asset: ${assetFile} -> ${cleanedName}`);
      }
    }
  }

  // Process markdown content
  let processedContent = content;
  processedContent = removeFirstH1(processedContent);
  processedContent = rewriteFilePaths(processedContent, slug, fileMapping);
  processedContent = cleanNotionArtifacts(processedContent);

  // Generate frontmatter
  const frontmatter = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
  ];

  if (description) {
    frontmatter.push(`description: "${description.replace(/"/g, '\\"')}"`);
  }

  if (date) {
    frontmatter.push(`date: "${date}"`);
  }

  if (tags.length > 0) {
    frontmatter.push(`tags: [${tags.map((t) => `"${t}"`).join(', ')}]`);
  }

  // Cover image uses absolute URL path (works everywhere)
  if (coverImage) {
    frontmatter.push(`cover: "/images/projects/${slug}/${coverImage}"`);
  }

  frontmatter.push('lang: fr');
  frontmatter.push('draft: false');
  frontmatter.push('---');
  frontmatter.push('');

  const finalContent = frontmatter.join('\n') + processedContent;

  // Write FR version
  const frOutputPath = path.join(CONFIG.outputContentDir, 'fr', `${slug}.md`);
  if (!dryRun) {
    await fs.mkdir(path.dirname(frOutputPath), { recursive: true });
    await fs.writeFile(frOutputPath, finalContent, 'utf-8');
  }

  if (verbose) console.log(`  Output (FR): ${path.relative(ROOT_DIR, frOutputPath)}`);

  // Create EN placeholder
  const enFrontmatter = frontmatter
    .map((line) => (line === 'lang: fr' ? 'lang: en' : line))
    .join('\n');

  const enContent = enFrontmatter + '\n\n<!-- TODO: Translate this content -->\n\n' + processedContent;

  const enOutputPath = path.join(CONFIG.outputContentDir, 'en', `${slug}.md`);
  if (!dryRun) {
    await fs.mkdir(path.dirname(enOutputPath), { recursive: true });
    await fs.writeFile(enOutputPath, enContent, 'utf-8');
  }

  if (verbose) console.log(`  Output (EN): ${path.relative(ROOT_DIR, enOutputPath)}`);

  return {
    slug,
    title,
    tags,
    assetsCount: Object.keys(fileMapping).length,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose') || args.includes('-v'),
  };

  // Parse source directory
  const sourceIndex = args.findIndex((a) => a === '--source' || a === '-s');
  if (sourceIndex !== -1 && args[sourceIndex + 1]) {
    CONFIG.sourceDir = path.resolve(args[sourceIndex + 1]);
  }

  console.log('\n✨ Notion Export Ingestion Engine\n');
  console.log(`Source: ${CONFIG.sourceDir}`);
  console.log(`Content output: ${CONFIG.outputContentDir}`);
  console.log(`Images output: ${CONFIG.outputImagesDir}`);
  if (options.dryRun) console.log('\n⚠️  DRY RUN - No files will be written\n');

  // Check if source exists
  try {
    await fs.access(CONFIG.sourceDir);
  } catch {
    console.error(`\n❌ Error: Source directory not found: ${CONFIG.sourceDir}`);
    console.log('\nMake sure to place your Notion exports in the _raw_exports folder.');
    process.exit(1);
  }

  // Find all markdown files
  const mdFiles = await findMarkdownFiles(CONFIG.sourceDir);

  if (mdFiles.length === 0) {
    console.log('\n⚠️  No markdown files found in source directory.');
    process.exit(0);
  }

  console.log(`\nFound ${mdFiles.length} project(s) to process:`);

  // Process each project
  const results = [];
  for (const mdPath of mdFiles) {
    try {
      const result = await processProject(mdPath, options);
      results.push(result);
    } catch (error) {
      console.error(`\n❌ Error processing ${mdPath}:`, error.message);
      if (options.verbose) console.error(error.stack);
    }
  }

  // Summary
  const totalAssets = results.reduce((sum, r) => sum + r.assetsCount, 0);

  console.log('\n' + '='.repeat(50));
  console.log('✅ Ingestion Complete!\n');
  console.log(`   Projects processed: ${results.length}`);
  console.log(`   Assets copied: ${totalAssets}`);
  console.log(`   Output locations:`);
  console.log(`     - Content (FR): src/content/projects/fr/`);
  console.log(`     - Content (EN): src/content/projects/en/`);
  console.log(`     - Images: public/images/projects/`);

  if (!options.dryRun) {
    console.log('\n🚀 Run "npm run dev" to preview your portfolio!');
  }

  console.log('');
}

main().catch(console.error);
