import { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

export async function signIn(): Promise<Session> {
  const redirectUrl = chrome.identity.getRedirectURL()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
  })

  if (error || !data.url) throw error ?? new Error('No OAuth URL returned')

  const resultUrl = await new Promise<string>((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      { url: data.url, interactive: true },
      (callbackUrl) => {
        if (chrome.runtime.lastError || !callbackUrl) {
          reject(chrome.runtime.lastError ?? new Error('Auth flow failed'))
        } else {
          resolve(callbackUrl)
        }
      }
    )
  })

  const { data: sessionData, error: sessionError } =
    await supabase.auth.exchangeCodeForSession(resultUrl)

  if (sessionError) throw sessionError
  return sessionData.session!
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession()
  return data.session
}
