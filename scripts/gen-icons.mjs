// icon-source.svg → 각 사이즈 PNG 아이콘 생성 (public/)
//   node scripts/gen-icons.mjs
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const svg = readFileSync(join(__dirname, "icon-source.svg"));

const targets = [
  { file: "icon-192x192.png", size: 192 },
  { file: "icon-512x512.png", size: 512 },
  { file: "apple-icon.png", size: 180 }, // iOS 홈화면 아이콘
];

// 마스커블(안전영역) 아이콘: 배경을 꽉 채우는 별도 512
const maskable = { file: "icon-maskable-512.png", size: 512 };

for (const t of [...targets, maskable]) {
  await sharp(svg)
    .resize(t.size, t.size)
    .png()
    .toFile(join(ROOT, "public", t.file));
  console.log(`✓ public/${t.file} (${t.size}x${t.size})`);
}
console.log("아이콘 생성 완료");
