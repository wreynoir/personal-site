import fs from 'fs';
import path from 'path';
import fetch from 'cross-fetch';

export interface Dispatch {
  id: string;
  title: string;
  date: string;
  content: string;
}

export async function getDispatches(): Promise<Dispatch[]> {
  const notionToken = process.env.NOTION_TOKEN;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `[notion] env detected token=${Boolean(
        notionToken
      )} database=${Boolean(notionDatabaseId)}`
    );
  }

  if (notionToken && notionDatabaseId) {
    try {
      return await getDispatchesFromNotion(notionToken, notionDatabaseId);
    } catch (error) {
      console.error('Failed to fetch dispatches from Notion:', error);
      // fall through to filesystem dispatches if configured
    }
  }

  return readDispatchesFromFilesystem();
}

async function getDispatchesFromNotion(token: string, databaseId: string) {
  const formattedId = normalizeNotionId(databaseId);
  const response = await fetch(
    `https://api.notion.com/v1/databases/${formattedId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sorts: [
          {
            property: 'Date',
            direction: 'descending'
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Notion API error ${response.status} ${response.statusText}: ${body}`
    );
  }

  const data = await response.json();

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `[notion] fetched ${data.results.length} journal entries from ${formattedId}`
    );
  }

  const dispatches: Dispatch[] = data.results.map((page: any) => {
    const props: any = (page as any).properties ?? {};

    const title =
      props.Title?.title?.map((t: any) => t.plain_text).join(' ').trim() ||
      'Untitled entry';

    const date =
      props.Date?.date?.start ||
      new Date(page.created_time).toISOString().slice(0, 10);

    const content =
      props.Entry?.rich_text
        ?.map((block: any) => block.plain_text)
        .join('\n')
        .trim() || '';

    return {
      id: page.id,
      title,
      date,
      content
    };
  });

  return dispatches;
}

function readDispatchesFromFilesystem(): Dispatch[] {
  const dispatchesDir = path.join(process.cwd(), 'dispatches');

  if (!fs.existsSync(dispatchesDir)) {
    return [];
  }

  const files = fs
    .readdirSync(dispatchesDir)
    .filter(file => file.endsWith('.md'));

  const dispatches: Dispatch[] = files.map(fileName => {
    const fullPath = path.join(dispatchesDir, fileName);
    const raw = fs.readFileSync(fullPath, 'utf8');

    const base = fileName.replace(/\.md$/, '');
    const parts = base.split('-');

    let date = new Date().toISOString().slice(0, 10);
    let titleFromFile = base;

    if (parts.length >= 3) {
      date = `${parts[0]}-${parts[1]}-${parts[2]}`;
      titleFromFile =
        parts
          .slice(3)
          .join(' ')
          .replace(/-/g, ' ')
          .trim() || titleFromFile;
    }

    const firstLine = raw.split('\n')[0];
    if (firstLine.startsWith('# ')) {
      titleFromFile = firstLine.replace(/^#\s*/, '');
    }

    return {
      id: base,
      title: titleFromFile,
      date,
      content: raw
    };
  });

  dispatches.sort((a, b) => (a.date < b.date ? 1 : -1));

  return dispatches;
}

function normalizeNotionId(id: string) {
  if (id.includes('-')) return id;
  return `${id.substring(0, 8)}-${id.substring(8, 12)}-${id.substring(
    12,
    16
  )}-${id.substring(16, 20)}-${id.substring(20)}`;
}
