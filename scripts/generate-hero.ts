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

const HERO_PROMPT = `A stylish woman's hand holding an iPhone from below against a pure black background. The hand has warm brown skin with gold-yellow nail polish, chunky gold rings on multiple fingers, and a bold gold chain bracelet. The wrist and lower forearm are visible, wrapped in a vibrant green satin fabric sleeve with a hint of pink-magenta fabric underneath. The iPhone is in a coral-red silicone case, held upright at a very slight natural angle. The phone screen displays a clean white loyalty stamp card — a white card background with a dark green banner strip across the top, below that a 2-column by 4-row grid of illustrated coffee cup stamp icons (some stamps collected showing a full red-and-white coffee cup, others empty as faint outlines), below the grid two info labels showing "7 stamps" on the left and "1" reward on the right, and at the very bottom a black-and-white barcode stripe. The screen is bright white and glowing, casting soft warm light on the fingers and gold jewelry. Pure black background with zero distractions. Studio product photography, dramatic directional lighting from the upper right highlighting the gold jewelry and the bright phone screen. Sharp focus on the phone and hand, ultra-high detail on the screen content. Composition: hand enters from the bottom-center of the frame, phone fills roughly 60% of the vertical space. Absolutely no text, letters, words, logos, or watermarks in the image.`;

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
  console.log('=== Kyro Hero Image Generator ===\n');
  console.log(`Model: ${MODEL}`);
  console.log(`Prompt:\n${HERO_PROMPT}\n`);

  if (DRY_RUN) {
    console.log('[DRY RUN] Would generate hero image with the above prompt.');
    return;
  }

  console.log('Generating hero image...');
  const result = await generateImage({
    prompt: HERO_PROMPT,
    model: MODEL,
    aspectRatio: '3:4',
  });

  console.log(`Generated! URL: ${result.url}`);
  console.log(`Request ID: ${result.requestId}`);

  const outputPath = path.join(__dirname, '..', 'public', 'images', 'hero', 'hero-main.png');
  console.log(`Downloading to ${outputPath}...`);
  await downloadFile(result.url, outputPath);
  console.log('Done! Hero image saved.');
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
