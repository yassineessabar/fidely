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

const STEPS = [
  {
    filename: 'step-1-setup.png',
    prompt: `A close-up of the top half of a modern iPhone 15 Pro in natural titanium on a solid muted lavender-purple (#B8A9D4) background. The phone screen has a black background showing Apple Wallet interface with a grid of colorful loyalty card icons — a yellow card, an orange card, a red card, a sage green card, and a dark green card, arranged in a 2-column grid layout. The phone is centered, slightly tilted, with only the top 70% visible. Clean flat solid color background, no gradients, no shadows, just the phone on the color. Shot straight-on, editorial product photography like Klarna website. Absolutely no readable text, letters, words, logos, or watermarks in the image.`,
  },
  {
    filename: 'step-2-qr.png',
    prompt: `A close-up of the top half of a modern iPhone 15 Pro in natural titanium on a solid soft lime-green (#D4E8B0) background. The phone screen shows a white interface with a large QR code in the center, clean minimal design with form fields and input rows below it. The phone is centered, slightly tilted, with only the top 70% visible. Clean flat solid color background, no gradients, no shadows, just the phone on the color. Shot straight-on, editorial product photography like Klarna website. Absolutely no readable text, letters, words, logos, or watermarks in the image.`,
  },
  {
    filename: 'step-3-scan.png',
    prompt: `A close-up of the bottom half of a modern iPhone 15 Pro in natural titanium on a solid deep dark purple (#2C2242) background. The phone screen shows a white interface with a customer data dashboard — profile avatar, analytics chart, list of recent visits with checkmarks. The phone is centered, slightly tilted, with only the bottom 70% visible, rising from the bottom of the frame. Clean flat solid color background, no gradients, no shadows. Shot straight-on, editorial product photography like Klarna website. Absolutely no readable text, letters, words, logos, or watermarks in the image.`,
  },
  {
    filename: 'step-4-rewards.png',
    prompt: `A close-up of the top half of a modern iPhone 15 Pro in natural titanium on a solid muted purple (#6C47FF) background. The phone screen shows an iOS lock screen with a push notification from Wallet app — showing a loyalty reward notification card with a small icon. The lock screen wallpaper is a purple-to-green gradient. The phone is centered, slightly tilted, with only the top 70% visible. Clean flat solid color background, no gradients, no shadows, just the phone on the color. Shot straight-on, editorial product photography like Klarna website. Absolutely no readable text, letters, words, logos, or watermarks in the image.`,
  },
];

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
  console.log('=== Kyro How It Works Image Generator ===\n');

  for (let i = 0; i < STEPS.length; i++) {
    const step = STEPS[i];
    console.log(`\n[${i + 1}/${STEPS.length}] ${step.filename}`);
    console.log(`Prompt: ${step.prompt.substring(0, 100)}...`);

    if (DRY_RUN) {
      console.log('[DRY RUN] Skipping.');
      continue;
    }

    console.log('Generating...');
    const result = await generateImage({
      prompt: step.prompt,
      model: MODEL,
      aspectRatio: '4:3',
    });

    const outputPath = path.join(__dirname, '..', 'public', 'images', 'how-it-works', step.filename);
    console.log(`Downloading to ${outputPath}...`);
    await downloadFile(result.url, outputPath);
    console.log('Done!');
  }

  console.log('\nAll images generated!');
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
