import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

function getNotionClient() {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) return null;
  return new Client({ auth: apiKey });
}

// GET /api/notion/page/[id] — get page content
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = getNotionClient();
  if (!client) {
    return NextResponse.json(
      { error: 'Notion is not configured' },
      { status: 400 }
    );
  }

  const { id } = await params;

  try {
    // Fetch the page metadata
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = (await client.pages.retrieve({ page_id: id })) as any;

    const titleProp = Object.values(page.properties).find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prop: any) => prop.type === 'title'
    ) as { title: { plain_text: string }[] } | undefined;

    // Fetch the page blocks (content)
    const blocks = await client.blocks.children.list({
      block_id: id,
      page_size: 100,
    });

    // Extract text content from blocks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = blocks.results.map((block: any) => {
      const type = block.type;
      const data = block[type];

      if (data?.rich_text) {
        return {
          type,
          text: data.rich_text.map((rt: { plain_text: string }) => rt.plain_text).join(''),
        };
      }

      if (type === 'divider') return { type: 'divider', text: '---' };
      if (type === 'child_database' || type === 'child_page') {
        return { type, text: data?.title || '[embedded]' };
      }

      return { type, text: '' };
    });

    return NextResponse.json({
      id: page.id,
      title: titleProp?.title?.[0]?.plain_text || 'Untitled',
      icon: page.icon?.emoji || null,
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      url: page.url,
      content,
    });
  } catch (error) {
    console.error('Notion page fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page from Notion' },
      { status: 500 }
    );
  }
}
