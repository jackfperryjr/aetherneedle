chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== 'GET_PAGE_DATA') return

  const favicon = document.querySelector<HTMLLinkElement>(
    'link[rel~="icon"]'
  )?.href ?? null

  sendResponse({
    url: location.href,
    title: document.title,
    domain: location.hostname.replace(/^www\./, ''),
    favicon_url: favicon,
    raw_text: document.body.innerText.slice(0, 50000),
  })
})
