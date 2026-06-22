// make-pdf.js
// Generates "download/Arthur Attwell – CV.pdf" by printing index.html with
// Puppeteer's bundled Chromium. Because Puppeteer ships its own browser, this
// works identically on Windows and on Ubuntu codespaces with no system Chrome.
//
// Run with: npm run pdf

const puppeteer = require('puppeteer');
const path = require('path');

const repoDir = __dirname;
const inputFile = path.join(repoDir, 'index.html');
const outputFile = path.join(repoDir, 'download', 'Arthur Attwell – CV.pdf');

// Build a file:// URL for the local HTML file (forward slashes on all platforms).
const inputUrl = 'file://' + inputFile.replace(/\\/g, '/').replace(/^([A-Za-z]:)/, '/$1');

(async () => {
  // --no-sandbox is needed when running as root, which is common in codespaces.
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();

    // Wait for the network to settle so the Spectral web font has loaded.
    await page.goto(inputUrl, { waitUntil: 'networkidle0' });

    // Belt-and-braces: make sure all @font-face fonts are ready before printing,
    // otherwise text can render in a fallback font.
    await page.evaluateHandle('document.fonts.ready');

    console.log(`Output: ${outputFile}`);
    await page.pdf({
      path: outputFile,
      format: 'A4',
      printBackground: true,
      // Honour the @page size/margins declared in main.css rather than
      // overriding them here, so the PDF matches the print stylesheet.
      preferCSSPageSize: true
    });

    console.log('Done. Saved PDF to download/.');
  } finally {
    await browser.close();
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});
