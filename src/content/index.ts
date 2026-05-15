chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== 'GET_PAGE_DATA') return true

  const favicon = document.querySelector<HTMLLinkElement>(
    'link[rel~="icon"]'
  )?.href ?? null

  function extractText(): string {
    const articleEl = document.querySelector<HTMLElement>(
      'article, [role="main"], main, #main-content, #content, .article-body, .story-body, .entry-content'
    )
    const root = articleEl ?? document.body
    return (root.innerText || root.textContent || '').trim()
  }

  function tryRespond(attemptsLeft: number) {
    const raw_text = extractText()
    if (raw_text.length > 200 || attemptsLeft === 0) {
      sendResponse({
        url: location.href,
        title: document.title,
        domain: location.hostname.replace(/^www\./, ''),
        favicon_url: favicon,
        raw_text: raw_text.slice(0, 50000),
      })
    } else {
      setTimeout(() => tryRespond(attemptsLeft - 1), 500)
    }
  }

  tryRespond(6) // waits up to 3s for dynamic content to load
  return true   // keeps the message channel open for async sendResponse
})
