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
const STYLE = 'Warm natural lighting, shallow depth of field, editorial lifestyle photography. No people faces visible. Cozy inviting atmosphere. No text, logos, or watermarks.';

const BUSINESSES = [
  { filename: 'biz-cafe.png', prompt: `Interior of a modern specialty coffee shop — espresso machine with steam, latte art being poured into a ceramic cup, wooden counter, warm morning light streaming through large windows. ${STYLE}` },
  { filename: 'biz-gym.png', prompt: `Close-up of gym equipment — kettlebells and dumbbells neatly arranged on a rack, rubber floor, modern minimalist fitness studio with large mirrors and soft overhead lighting. ${STYLE}` },
  { filename: 'biz-salon.png', prompt: `Elegant hair salon interior — styling chair, round mirror with warm bulb lighting, scissors and combs laid out on a marble counter, green plants in the background. ${STYLE}` },
  { filename: 'biz-bakery.png', prompt: `Artisan bakery display — freshly baked croissants and sourdough loaves on wooden shelves, flour dusted surface, warm golden light, rustic charm. ${STYLE}` },
  { filename: 'biz-barber.png', prompt: `Classic barbershop interior — leather barber chair, vintage mirrors, hot towels, straight razors, warm amber lighting, masculine sophisticated atmosphere. ${STYLE}` },
  { filename: 'biz-pizza.png', prompt: `Wood-fired pizza oven with flames visible inside, a fresh margherita pizza on a wooden paddle, rustic Italian restaurant setting, warm ambient lighting. ${STYLE}` },
  { filename: 'biz-yoga.png', prompt: `Serene yoga studio — rolled yoga mats, bamboo floor, large windows with soft natural light, minimalist zen interior, candles and plants. ${STYLE}` },
  { filename: 'biz-pets.png', prompt: `Charming pet shop interior — shelves with colorful pet toys and treats, a cozy dog bed display, warm friendly atmosphere, natural wood fixtures. ${STYLE}` },
  { filename: 'biz-flowers.png', prompt: `Beautiful flower shop — bunches of fresh peonies, roses and eucalyptus in glass vases, wrapping paper and ribbon on a wooden counter, soft daylight. ${STYLE}` },
  { filename: 'biz-sushi.png', prompt: `Elegant sushi bar — fresh nigiri and maki rolls on a slate plate, bamboo mat, chopsticks, minimal Japanese restaurant interior with warm lighting. ${STYLE}` },
  { filename: 'biz-icecream.png', prompt: `Colorful gelato display — scoops of vibrant ice cream in a glass case, waffle cones stacked, pastel-colored shop interior, cheerful summer atmosphere. ${STYLE}` },
  { filename: 'biz-books.png', prompt: `Cozy independent bookstore — floor-to-ceiling wooden shelves filled with books, reading nook with a leather armchair, warm lamp light, literary atmosphere. ${STYLE}` },
  { filename: 'biz-wine.png', prompt: `Intimate wine bar — rows of wine bottles on dark wooden shelves, two glasses of red wine on a marble bar top, moody ambient lighting, sophisticated vibe. ${STYLE}` },
  { filename: 'biz-nails.png', prompt: `Chic nail salon — manicure station with nail polish bottles in pastel colors arranged neatly, marble counter, soft pink and white interior design. ${STYLE}` },
  { filename: 'biz-juice.png', prompt: `Fresh juice bar — colorful smoothie bowls topped with fruit, blenders, fresh fruits and vegetables on display, bright clean modern interior. ${STYLE}` },
  { filename: 'biz-carwash.png', prompt: `Modern auto detailing studio — a sleek car being hand-washed, foam and water droplets, clean professional garage with bright LED lighting. ${STYLE}` },
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
  console.log('=== Kyro Business Photos Generator ===\n');

  for (let i = 0; i < BUSINESSES.length; i++) {
    const biz = BUSINESSES[i];
    console.log(`\n[${i + 1}/${BUSINESSES.length}] ${biz.filename}`);

    if (DRY_RUN) {
      console.log('[DRY RUN] Skipping.');
      continue;
    }

    console.log('Generating...');
    const result = await generateImage({
      prompt: biz.prompt,
      model: MODEL,
      aspectRatio: '3:4',
    });

    const outputPath = path.join(__dirname, '..', 'public', 'images', 'brands', biz.filename);
    console.log(`Downloading to ${outputPath}...`);
    await downloadFile(result.url, outputPath);
    console.log('Done!');
  }

  console.log('\nAll business photos generated!');
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
