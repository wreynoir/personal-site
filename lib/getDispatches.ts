import fs from 'fs';
import path from 'path';

export interface Dispatch {
  id: string;
  title: string;
  date: string;
  content: string;
}

/**
 * Reads markdown files from /dispatches and returns them sorted by date (newest first).
 */
export async function getDispatches(): Promise<Dispatch[]> {
  const dispatchesDir = path.join(process.cwd(), 'dispatches');

  if (!fs.existsSync(dispatchesDir)) {
    return [];
  }

  const files = fs.readdirSync(dispatchesDir).filter((file) => file.endsWith('.md'));

  const dispatches: Dispatch[] = files.map((fileName) => {
    const fullPath = path.join(dispatchesDir, fileName);
    const raw = fs.readFileSync(fullPath, 'utf8');

    const base = fileName.replace(/\.md$/, '');
    const parts = base.split('-');

    let date = new Date().toISOString().slice(0, 10);
    let titleFromFile = base;

    if (parts.length >= 3) {
      date = `${parts[0]}-${parts[1]}-${parts[2]}`;
      titleFromFile = parts.slice(3).join(' ').replace(/-/g, ' ').trim() || titleFromFile;
    }

    const firstLine = raw.split('\n')[0];
    if (firstLine.startsWith('# ')) {
      titleFromFile = firstLine.replace(/^#\s*/, '');
    }

    return {
      id: base,
      title: titleFromFile,
      date,
      content: raw,
    };
  });

  dispatches.sort((a, b) => (a.date < b.date ? 1 : -1));

  return dispatches;
}
