import 'dotenv/config';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { generateImage, type ImageModelKey } from '../lib/higgsfield';

const MODEL: ImageModelKey = (process.argv.find(a => a.startsWith('--model='))?.split('=')[1] as ImageModelKey) || 'flux-pro';
const DRY_RUN = process.argv.includes('--dry-run');

const DASHBOARD_PROMPT = `A sleek modern MacBook Pro laptop on a clean dark background (#0B051D), slightly angled, showing a minimal analytics dashboard on its screen. The dashboard has a clean white interface with a smooth upward-trending line chart in dark ink, a few bold stat numbers, and rounded UI cards. The laptop is surrounded by floating 3D elements: a lime-green (#E6FFA9) translucent bar chart floating to the upper left, a purple (#6C47FF) pie chart floating to the right, and subtle glowing data points scattered around. Clean, editorial, Klarna-style product photography. Dramatic studio lighting with soft shadows. The floating chart elements have a glassmorphism frosted-glass look with subtle transparency. Ultra-minimal composition with lots of negative space. Premium 3D render quality, sharp details on the laptop screen. Absolutely no readable text, letters, words, logos, or watermarks in the image.`;

async function downloadFile(url: string, dest: string): Promise<void> {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return new Promise((resolve, reject) => {
    const get = url.startsWith('https') ? https.get : http.get;
    get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => { stream.close(); resolve(); });
      stream.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log('=== Kyro Dashboard Image Generator ===\n');
  console.log(`Model: ${MODEL}`);
  console.log(`Prompt:\n${DASHBOARD_PROMPT}\n`);

  if (DRY_RUN) {
    console.log('[DRY RUN] Would generate dashboard image with the above prompt.');
    return;
  }

  console.log('Generating dashboard image...');
  const result = await generateImage({
    prompt: DASHBOARD_PROMPT,
    model: MODEL,
    aspectRatio: '16:9',
  });

  console.log(`Generated! URL: ${result.url}`);
  console.log(`Request ID: ${result.requestId}`);

  const outputPath = path.join(__dirname, '..', 'public', 'images', 'dashboard', 'dashboard-hero.png');
  console.log(`Downloading to ${outputPath}...`);
  await downloadFile(result.url, outputPath);
  console.log('Done! Dashboard image saved.');
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
