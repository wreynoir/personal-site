import { NextResponse } from 'next/server';

import { blog } from '@/data/blog';

const ARCHIVE_URL = `${blog.url}/api/v1/archive?sort=new`;

export async function GET() {
  try {
    const res = await fetch(ARCHIVE_URL, {
      next: { revalidate: 300 }
    });

    if (!res.ok) {
      throw new Error(`Substack archive returned ${res.status}`);
    }

    const data = await res.json();
    const posts = Array.isArray(data) ? data : [];

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Failed to load Substack archive', error);
    return NextResponse.json(
      { error: 'Unable to load Substack posts' },
      { status: 500 }
    );
  }
}
