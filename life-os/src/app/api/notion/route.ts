import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

function getNotionClient() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    return null;
  }

  return { client: new Client({ auth: apiKey }), databaseId };
}

// GET /api/notion — list pages from the workspace database
export async function GET(request: Request) {
  const notion = getNotionClient();
  if (!notion) {
    return NextResponse.json({ configured: false, pages: [] });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const cursor = searchParams.get('cursor') || undefined;

  try {
    // Use search API to find pages in the database
    // The Notion SDK v5 removed databases.query; use search instead
    const response = await notion.client.search({
      query: query || undefined,
      filter: { value: 'page', property: 'object' },
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
      start_cursor: cursor,
      page_size: 25,
    });

    // Filter to only pages that belong to our database
    const dbPages = response.results.filter((page) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = page as any;
      return (
        p.parent?.type === 'database_id' &&
        p.parent?.database_id?.replace(/-/g, '') === notion.databaseId.replace(/-/g, '')
      );
    });

    const pages = dbPages.map((page) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = page as any;
      const titleProp = Object.values(p.properties || {}).find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (prop: any) => prop.type === 'title'
      ) as { title: { plain_text: string }[] } | undefined;

      return {
        id: p.id,
        title: titleProp?.title?.[0]?.plain_text || 'Untitled',
        createdTime: p.created_time,
        lastEditedTime: p.last_edited_time,
        url: p.url,
        icon: p.icon?.emoji || null,
      };
    });

    return NextResponse.json({
      configured: true,
      pages,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    });
  } catch (error) {
    console.error('Notion API error:', error);
    return NextResponse.json(
      { configured: true, error: 'Failed to fetch pages from Notion' },
      { status: 500 }
    );
  }
}

// POST /api/notion — create a new page in the database
export async function POST(request: Request) {
  const notion = getNotionClient();
  if (!notion) {
    return NextResponse.json(
      { error: 'Notion is not configured' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Build children blocks from content
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const children: any[] = [];
    if (content) {
      // Split content into paragraphs
      const paragraphs = content.split('\n').filter((line: string) => line.trim());
      for (const para of paragraphs) {
        children.push({
          object: 'block' as const,
          type: 'paragraph' as const,
          paragraph: {
            rich_text: [{ type: 'text' as const, text: { content: para } }],
          },
        });
      }
    }

    const response = await notion.client.pages.create({
      parent: { database_id: notion.databaseId },
      properties: {
        title: {
          title: [{ text: { content: title } }],
        },
      },
      children: children.length > 0 ? children : undefined,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = response as any;
    return NextResponse.json({
      id: p.id,
      title,
      createdTime: p.created_time,
      lastEditedTime: p.last_edited_time,
      url: p.url,
    });
  } catch (error) {
    console.error('Notion create page error:', error);
    return NextResponse.json(
      { error: 'Failed to create page in Notion' },
      { status: 500 }
    );
  }
}
