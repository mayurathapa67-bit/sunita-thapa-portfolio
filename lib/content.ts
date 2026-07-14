export async function getContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const res = await fetch(`${baseUrl}/api/content?t=${Date.now()}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      console.warn('Failed to fetch content from API');
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
}
