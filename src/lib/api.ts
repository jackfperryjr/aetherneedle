const MAGICITE_URL = import.meta.env.VITE_MAGICITE_URL

export type PageData = {
  url: string
  title: string
  domain: string
  favicon_url: string | null
  raw_text: string
}

export async function createClip(payload: PageData, accessToken: string): Promise<void> {
  const res = await fetch(`${MAGICITE_URL}/clips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`${res.status}: ${body}`)
  }
}
