import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import PDFDocument from "pdfkit";

const rootDir = process.cwd();
const dataPath = path.join(rootDir, "src", "data", "services.content.json");
const outputDir = path.join(rootDir, "public", "downloads");
const pngPath = path.join(outputDir, "glowwithvani-pricing.png");
const pdfPath = path.join(outputDir, "glowwithvani-pricing.pdf");

const palette = {
  background: "#faf7f2",
  surface: "#fffdf9",
  surfaceSoft: "#f5efe5",
  ink: "#241b16",
  muted: "#6c5f51",
  accent: "#8c6a42",
  line: "#ddcfc0",
  glow: "#efe3d1"
};

const WIDTH = 1600;
const OUTER_PAD = 96;
const CARD_GAP = 28;
const COLS = 2;
const CARD_WIDTH = (WIDTH - OUTER_PAD * 2 - CARD_GAP) / COLS;
const CARD_HEIGHT = 360;
const HEADER_HEIGHT = 220;
const NOTES_HEIGHT = 220;

const titleCharFactor = 18.5;
const bodyCharFactor = 11.5;

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapText(text, maxWidth, charFactor) {
  const maxChars = Math.max(10, Math.floor(maxWidth / charFactor));
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) {
        lines.push(current);
      }
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function textBlock(lines, x, y, fontSize, fill, lineHeight, extra = "") {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" font-size="${fontSize}" fill="${fill}" ${extra}>${escapeXml(line)}</text>`
    )
    .join("");
}

async function main() {
  const content = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const services = content.services;
  const servicePricingNotes = content.servicePricingNotes;

  const rowCount = Math.ceil(services.length / COLS);
  const gridHeight = rowCount * CARD_HEIGHT + Math.max(0, rowCount - 1) * CARD_GAP;
  const height = OUTER_PAD * 2 + HEADER_HEIGHT + gridHeight + NOTES_HEIGHT;

  const cardInnerWidth = CARD_WIDTH - 80;

  let cardsSvg = "";
  for (const [index, service] of services.entries()) {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const x = OUTER_PAD + col * (CARD_WIDTH + CARD_GAP);
    const y = OUTER_PAD + HEADER_HEIGHT + row * (CARD_HEIGHT + CARD_GAP);
    const innerX = x + 40;
    const innerY = y + 52;

    const titleLines = wrapText(service.title, cardInnerWidth, titleCharFactor);
    const titleLineHeight = 46;
    const titleBottomY = innerY + (titleLines.length - 1) * titleLineHeight;
    const priceY = titleBottomY + 58;
    const bodyLines = wrapText(service.description, cardInnerWidth, bodyCharFactor).slice(0, 4);
    const bodyY = priceY + 42;

    cardsSvg += `
      <rect x="${x}" y="${y}" rx="28" ry="28" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="${palette.surface}" stroke="${palette.line}" stroke-width="2" />
      ${textBlock(titleLines, innerX, innerY, 38, palette.ink, titleLineHeight, 'font-family="Georgia, Times New Roman, serif"')}
      <text x="${innerX}" y="${priceY}" font-size="30" fill="${palette.accent}" font-family="Arial, Helvetica, sans-serif" font-weight="700">${escapeXml(service.startingPrice)}</text>
      ${textBlock(bodyLines, innerX, bodyY, 23, palette.muted, 32, 'font-family="Arial, Helvetica, sans-serif"')}
    `;
  }

  const notesY = OUTER_PAD + HEADER_HEIGHT + gridHeight + 36;
  const notesLines = servicePricingNotes
    .map((note, index) => {
      const lineY = notesY + 78 + index * 38;
      return `
        <circle cx="${OUTER_PAD + 32}" cy="${lineY - 7}" r="5" fill="${palette.accent}" />
        <text x="${OUTER_PAD + 52}" y="${lineY}" font-size="22" fill="${palette.muted}" font-family="Arial, Helvetica, sans-serif">${escapeXml(note)}</text>
      `;
    })
    .join("");

  const svg = `
    <svg width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${WIDTH}" height="${height}" fill="${palette.background}" />
      <circle cx="${WIDTH - 260}" cy="190" r="180" fill="${palette.glow}" />
      <circle cx="${WIDTH - 480}" cy="${height - 400}" r="220" fill="#f2e6d8" />

      <text x="${OUTER_PAD}" y="120" font-size="28" fill="${palette.accent}" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="1">GLOWWITHVANI</text>
      <text x="${OUTER_PAD}" y="200" font-size="76" fill="${palette.ink}" font-family="Georgia, Times New Roman, serif">Services &amp; Pricing</text>
      <text x="${OUTER_PAD}" y="252" font-size="28" fill="${palette.muted}" font-family="Arial, Helvetica, sans-serif">Luxury makeup services for bridal, event, and editorial beauty.</text>

      ${cardsSvg}

      <rect x="${OUTER_PAD}" y="${notesY}" rx="28" ry="28" width="${WIDTH - OUTER_PAD * 2}" height="164" fill="${palette.surfaceSoft}" stroke="${palette.line}" stroke-width="2" />
      <text x="${OUTER_PAD + 28}" y="${notesY + 38}" font-size="24" fill="${palette.accent}" font-family="Arial, Helvetica, sans-serif" font-weight="700">NOTES</text>
      ${notesLines}
      <text x="${OUTER_PAD + 28}" y="${notesY + 142}" font-size="22" fill="${palette.muted}" font-family="Arial, Helvetica, sans-serif">Final pricing may vary based on look, location, and custom requirements.</text>
    </svg>
  `;

  fs.mkdirSync(outputDir, { recursive: true });
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.writeFileSync(pngPath, pngBuffer);

  await new Promise((resolve) => {
    const doc = new PDFDocument({ size: [WIDTH, height], margin: 0 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    doc.image(pngBuffer, 0, 0, { width: WIDTH, height });
    doc.end();
    stream.on("finish", resolve);
  });

  console.log(`Generated ${pngPath}`);
  console.log(`Generated ${pdfPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
