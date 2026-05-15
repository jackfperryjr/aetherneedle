import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { getSession, signIn, signOut } from '../lib/auth'
import { createClip, PageData } from '../lib/api'

type ClipState = 'idle' | 'clipping' | 'success' | 'error'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(true)
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [clipState, setClipState] = useState<ClipState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    getSession().then((s) => {
      setSession(s)
      setChecking(false)
    })
  }, [])

  useEffect(() => {
    if (!session) return
    chrome.tabs.query({ active: true }, (tabs) => {
      const tab = tabs.find(t => t.url?.startsWith('http'))
      console.log('[Aetherneedle] active tabs:', tabs, '→ selected:', tab)
      if (!tab?.id) return
      chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_DATA' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('[Aetherneedle] content script error:', chrome.runtime.lastError.message)
          return
        }
        if (!response) return
        setPageData(response as PageData)
      })
    })
  }, [session])

  const handleSignIn = async () => {
    try {
      const s = await signIn()
      setSession(s)
    } catch (err) {
      console.error('[Aetherneedle] sign-in error:', err)
      setErrorMsg(err instanceof Error ? err.message : 'Sign in failed. Please try again.')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setSession(null)
    setPageData(null)
    setClipState('idle')
    setErrorMsg('')
  }

  const handleClip = async () => {
    if (!pageData || !session) return
    setClipState('clipping')
    setErrorMsg('')
    try {
      await createClip(pageData, session.access_token)
      setClipState('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setClipState('error')
    }
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen text-sm text-gray-400">
        Loading...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-5 p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <img
            src={chrome.runtime.getURL('icons/android-chrome-128x128.png')}
            alt="Magiloom"
            className="w-16 h-16"
          />
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Magiloom</h1>
            <p className="mt-1 text-sm text-gray-500">
              Clip the web into your second brain.
            </p>
          </div>
        </div>
        {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
        <button
          onClick={handleSignIn}
          className="w-full py-2 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen p-4 gap-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={chrome.runtime.getURL('icons/android-chrome-128x128.png')}
            alt="Magiloom"
            className="w-5 h-5"
          />
          <h1 className="text-sm font-semibold tracking-tight">Magiloom</h1>
        </div>
        <button
          onClick={handleSignOut}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Sign out
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center gap-4">
        {pageData ? (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 gap-1 flex flex-col">
            <p className="text-sm font-medium leading-snug line-clamp-2">{pageData.title}</p>
            <p className="text-xs text-gray-400">{pageData.domain}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-sm text-gray-400">No page detected.</p>
          </div>
        )}

        {clipState === 'success' ? (
          <div className="rounded-lg bg-green-50 border border-green-100 p-3 text-center">
            <p className="text-sm font-medium text-green-700">Clipped</p>
            <p className="text-xs text-green-500 mt-0.5">Added to your Crystarium.</p>
            <button
              onClick={() => setClipState('idle')}
              className="mt-3 text-xs text-green-600 underline"
            >
              Clip another
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleClip}
              disabled={!pageData || clipState === 'clipping'}
              className="w-full py-2 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {clipState === 'clipping' ? 'Clipping...' : 'Clip this page'}
            </button>
            {clipState === 'error' && (
              <p className="text-xs text-red-500 text-center">{errorMsg}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
