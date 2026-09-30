// Renders promo.html → budoexpert-promo.mp4 frame by frame (deterministic, motion-blurred).
// usage: node render.mjs [--preview t1,t2,...] [--samples 8] [--audio soundtrack.wav]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const samples = +arg('--samples', 8), preview = arg('--preview'), audio = arg('--audio');
const out = arg('--out', path.join(here, 'budoexpert-promo.mp4'));

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => { console.error('PAGE ERROR', e); process.exit(1); });
await page.goto(pathToFileURL(path.join(here, 'promo.html')).href + '?export=1');
await page.waitForFunction('window.ready === true');

if (preview) {
  const dir = path.join(here, 'frames'); mkdirSync(dir, { recursive: true });
  for (const t of preview.split(',').map(Number)) {
    const url = await page.evaluate(([t, s]) => { window.renderAt(t, s); return document.getElementById('c').toDataURL('image/jpeg', .9); }, [t, samples]);
    const f = path.join(dir, `t${t.toFixed(2)}.jpg`); writeFileSync(f, Buffer.from(url.split(',')[1], 'base64')); console.log(f);
  }
  await browser.close(); process.exit(0);
}

const args = ['-y', '-f', 'image2pipe', '-framerate', '60', '-c:v', 'mjpeg', '-i', '-'];
if (audio) args.push('-i', audio);
args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart');
if (audio) args.push('-c:a', 'aac', '-b:a', '256k', '-shortest');
args.push(out);
const ff = spawn(FFMPEG, args, { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
const total = Math.round(await page.evaluate('window.DUR') * 60);
for (let f = 0; f < total; f++) {
  const url = await page.evaluate(([f, s]) => window.renderFrameData(f, s, .97), [f, samples]);
  if (!ff.stdin.write(Buffer.from(url.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 60 === 0) console.log(`frame ${f}/${total}  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('done →', out);
