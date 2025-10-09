import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'nature';
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '12';

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json({ error: 'Unsplash access key not configured' }, { status: 500 });
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': `Client-ID ${accessKey}`,
          'Accept-Version': 'v1'
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Unsplash API error:', error);
      return NextResponse.json({ error: 'Failed to fetch images from Unsplash' }, { status: response.status });
    }

    const data = await response.json();

    // Transform the data to include only what we need
    const images = data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      full: photo.urls.full,
      alt: photo.alt_description || photo.description || 'Unsplash image',
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      downloadUrl: photo.links.download
    }));

    return NextResponse.json({
      images,
      total: data.total,
      total_pages: data.total_pages
    });

  } catch (error) {
    console.error('Error fetching from Unsplash:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}