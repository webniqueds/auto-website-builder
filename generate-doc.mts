import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, ShadingType, Header, Footer, PageNumber, PageBreak,
} from 'docx';
import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const srcPath = process.argv[2] || 'ARCHITECTURE.md';
const outFile = process.argv[3] || 'Website-Builder-Architecture-Guide.docx';
const __dirname = dirname(fileURLToPath(import.meta.url));
const md = readFileSync(resolve(__dirname, srcPath), 'utf-8');

// --- Visual Tokens ----------------------------------------------------------
const COLORS = {
  primary: '0F172A',      // Slate 900
  accent: '2563EB',       // Royal Blue
  accentLight: 'EFF6FF',  // Light Blue Tint
  accentDark: '1D4ED8',   // Blue 700
  text: '334155',         // Slate 700
  muted: '64748B',        // Slate 500
  border: 'CBD5E1',       // Slate 300
  bgDark: '0F172A',       // Dark Code BG
  codeText: 'E2E8F0',     // Code text
  tableHeader: '1E293B',  // Slate 800
  zebraRow: 'F8FAFC',     // Slate 50
  white: 'FFFFFF',
};

// --- Formatting Helpers -----------------------------------------------------

function bold(text: string): TextRun {
  return new TextRun({ text, bold: true, font: 'Calibri', size: 21, color: COLORS.primary });
}

function code(text: string): TextRun {
  return new TextRun({
    text: ` ${text} `,
    font: 'Consolas',
    size: 19,
    color: '991B1B',
    shading: { type: ShadingType.SOLID, color: 'FEE2E2', fill: 'FEE2E2' },
  });
}

function plain(text: string, opts?: Partial<Parameters<typeof TextRun>[0]>): TextRun {
  return new TextRun({ text, font: 'Calibri', size: 21, color: COLORS.text, ...opts });
}

function heading1(text: string, isFirst = false): Paragraph[] {
  const paras: Paragraph[] = [];
  if (!isFirst) {
    paras.push(new Paragraph({ children: [new PageBreak()] }));
  }
  paras.push(
    new Paragraph({
      children: [
        new TextRun({
          text,
          font: 'Calibri',
          size: 34,
          bold: true,
          color: COLORS.primary,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: isFirst ? 120 : 360, after: 140 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 14, color: COLORS.accent },
      },
    })
  );
  return paras;
}

function heading2(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        font: 'Calibri',
        size: 26,
        bold: true,
        color: COLORS.accentDark,
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 90 },
  });
}

function heading3(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        font: 'Calibri',
        size: 22,
        bold: true,
        color: COLORS.primary,
      }),
    ],
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 60 },
  });
}

function calloutBlock(text: string): Paragraph {
  const runs = parseInlineFormatting(text.replace(/^>\s*/, ''));
  return new Paragraph({
    children: runs,
    spacing: { before: 120, after: 120 },
    indent: { left: 320, right: 240 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 24, color: COLORS.accent },
    },
    shading: { type: ShadingType.SOLID, color: COLORS.accentLight, fill: COLORS.accentLight },
  });
}

function emptyLine(): Paragraph {
  return new Paragraph({ children: [plain('')], spacing: { after: 40 } });
}

function bulletItem(text: string, level: number = 0): Paragraph {
  const runs = parseInlineFormatting(text);
  return new Paragraph({
    children: runs,
    bullet: { level },
    spacing: { after: 50 },
  });
}

function numberedItem(text: string, level: number = 0): Paragraph {
  const runs = parseInlineFormatting(text);
  return new Paragraph({
    children: runs,
    numbering: { reference: 'numbering', level },
    spacing: { after: 50 },
  });
}

function paragraphText(text: string): Paragraph {
  return new Paragraph({
    children: parseInlineFormatting(text),
    spacing: { after: 90, line: 276 },
  });
}

function codeBlock(lines: string[]): Paragraph[] {
  const header = new Paragraph({
    children: [new TextRun({ text: ' ', font: 'Consolas', size: 4 })],
    shading: { type: ShadingType.SOLID, color: COLORS.bgDark, fill: COLORS.bgDark },
    spacing: { before: 100, after: 0 },
  });

  const codeLines = lines.map(line =>
    new Paragraph({
      children: [new TextRun({ text: line || ' ', font: 'Consolas', size: 18, color: COLORS.codeText })],
      shading: { type: ShadingType.SOLID, color: COLORS.bgDark, fill: COLORS.bgDark },
      spacing: { after: 0, line: 260 },
      indent: { left: 240 },
    })
  );

  const footer = new Paragraph({
    children: [new TextRun({ text: ' ', font: 'Consolas', size: 4 })],
    shading: { type: ShadingType.SOLID, color: COLORS.bgDark, fill: COLORS.bgDark },
    spacing: { before: 0, after: 100 },
  });

  return [header, ...codeLines, footer];
}

function parseInlineFormatting(text: string): TextRun[] {
  const runs: TextRun[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(plain(text.slice(lastIndex, match.index)));
    }
    const segment = match[0];
    if (segment.startsWith('**') && segment.endsWith('**')) {
      runs.push(bold(segment.slice(2, -2)));
    } else if (segment.startsWith('`') && segment.endsWith('`')) {
      runs.push(code(segment.slice(1, -1)));
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    runs.push(plain(text.slice(lastIndex)));
  }
  return runs.length ? runs : [plain(text)];
}

function buildTable(headers: string[], rows: string[][]): Table {
  const borderStyle = { style: BorderStyle.SINGLE, size: 1, color: COLORS.border };
  const borders = { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle };
  const cellMargins = { top: 100, bottom: 100, left: 140, right: 140 };
  const colWidth = Math.floor(9600 / Math.max(headers.length, 1));

  const headerRow = new TableRow({
    children: headers.map(h =>
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: h, bold: true, font: 'Calibri', size: 20, color: COLORS.white })],
            spacing: { before: 40, after: 40 },
          }),
        ],
        shading: { type: ShadingType.SOLID, color: COLORS.tableHeader, fill: COLORS.tableHeader },
        borders,
        margins: cellMargins,
        width: { size: colWidth, type: WidthType.DXA },
      })
    ),
    tableHeader: true,
  });

  const dataRows = rows.map((row, i) =>
    new TableRow({
      children: row.map(cell =>
        new TableCell({
          children: [
            new Paragraph({
              children: parseInlineFormatting(cell),
              spacing: { before: 30, after: 30 },
            }),
          ],
          shading: i % 2 === 1 ? { type: ShadingType.SOLID, color: COLORS.zebraRow, fill: COLORS.zebraRow } : undefined,
          borders,
          margins: cellMargins,
          width: { size: colWidth, type: WidthType.DXA },
        })
      ),
    })
  );

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 9600, type: WidthType.DXA },
  });
}

// --- Parse Markdown ---------------------------------------------------------

function parseMd(mdText: string): (Paragraph | Table)[] {
  const lines = mdText.split('\n');
  const elements: (Paragraph | Table)[] = [];
  let i = 0;
  let h1Count = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule
    if (/^---+\s*$/.test(line)) {
      elements.push(
        new Paragraph({
          children: [plain('')],
          spacing: { before: 120, after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.border } },
        })
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(calloutBlock(line));
      i++;
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      h1Count++;
      elements.push(...heading1(line.slice(2), h1Count === 1));
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(heading2(line.slice(3)));
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(heading3(line.slice(4)));
      i++;
      continue;
    }

    // Code block
    if (line.trimStart().startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(...codeBlock(codeLines));
      continue;
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length && /^\|[\s-:|]+\|$/.test(lines[i + 1].trim())) {
      const parseRow = (row: string) =>
        row.split('|').slice(1, -1).map(c => c.trim());
      const headers = parseRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        rows.push(parseRow(lines[i]));
        i++;
      }
      elements.push(buildTable(headers, rows));
      elements.push(emptyLine());
      continue;
    }

    // Bullet list
    if (/^(\s*)[-*]\s/.test(line)) {
      const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
      const level = Math.floor(indent / 2);
      elements.push(bulletItem(line.replace(/^\s*[-*]\s+/, ''), level));
      i++;
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      elements.push(numberedItem(line.replace(/^\d+\.\s+/, '')));
      i++;
      continue;
    }

    // Regular paragraph
    let text = line;
    while (
      i + 1 < lines.length &&
      lines[i + 1].trim() !== '' &&
      !lines[i + 1].startsWith('#') &&
      !lines[i + 1].startsWith('```') &&
      !lines[i + 1].startsWith('> ') &&
      !/^---+\s*$/.test(lines[i + 1]) &&
      !/^(\s*)[-*]\s/.test(lines[i + 1]) &&
      !/^\d+\.\s/.test(lines[i + 1]) &&
      !(lines[i + 1].includes('|') && i + 2 < lines.length && /^\|[\s-:|]+\|$/.test(lines[i + 2]?.trim()))
    ) {
      i++;
      text += ' ' + lines[i];
    }
    elements.push(paragraphText(text));
    i++;
  }

  return elements;
}

// --- Build Document ---------------------------------------------------------

const content = parseMd(md);

const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'numbering',
        levels: [
          {
            level: 0,
            format: 'decimal',
            text: '%1.',
            alignment: AlignmentType.START,
          },
        ],
      },
    ],
  },
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 21, color: COLORS.text },
        paragraph: { spacing: { after: 80, line: 276 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: 'Website Builder — Architecture & Application Guide  |  Technical Reference',
                  font: 'Calibri',
                  size: 16,
                  color: COLORS.muted,
                }),
              ],
              border: {
                bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.border },
              },
              spacing: { after: 140 },
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.BOTH,
              border: {
                top: { style: BorderStyle.SINGLE, size: 2, color: COLORS.border },
              },
              spacing: { before: 140 },
              children: [
                new TextRun({
                  text: 'Confidential & Internal Engineering Use',
                  font: 'Calibri',
                  size: 16,
                  color: COLORS.muted,
                }),
                new TextRun({
                  text: '\t\tPage ',
                  font: 'Calibri',
                  size: 16,
                  color: COLORS.muted,
                }),
                PageNumber.CURRENT,
                new TextRun({
                  text: ' of ',
                  font: 'Calibri',
                  size: 16,
                  color: COLORS.muted,
                }),
                PageNumber.TOTAL_PAGES,
              ],
            }),
          ],
        }),
      },
      children: content,
    },
  ],
});

const outPath = resolve(__dirname, outFile);
const buffer = await Packer.toBuffer(doc);
writeFileSync(outPath, buffer);
console.log(`Word document successfully generated at: ${outPath}`);
console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
