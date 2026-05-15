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

  const hash = new URL(resultUrl).hash.slice(1)
  const params = new URLSearchParams(hash)
  const access_token = params.get('access_token')
  const refresh_token = params.get('refresh_token')

  if (!access_token || !refresh_token) throw new Error('Tokens missing from callback')

  const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  })

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
