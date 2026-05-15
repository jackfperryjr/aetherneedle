chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== 'GET_PAGE_DATA') return

  const favicon = document.querySelector<HTMLLinkElement>(
    'link[rel~="icon"]'
  )?.href ?? null

  const articleEl = document.querySelector<HTMLElement>(
    'article, [role="main"], main, #main-content, #content'
  )
  const root = articleEl ?? document.body
  const raw_text = (root.innerText || root.textContent || '').trim().slice(0, 50000)

  sendResponse({
    url: location.href,
    title: document.title,
    domain: location.hostname.replace(/^www\./, ''),
    favicon_url: favicon,
    raw_text,
  })
})
