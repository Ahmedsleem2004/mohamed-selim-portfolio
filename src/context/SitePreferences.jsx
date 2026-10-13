
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const SitePreferencesContext = createContext(null)

export function SitePreferencesProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('site-language') || 'en'
  )

  const [theme, setTheme] = useState(
    () => localStorage.getItem('site-theme') || 'dark'
  )

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'

    localStorage.setItem('site-language', language)
  }, [language])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('site-theme', theme)
  }, [theme])

  const toggleLanguage = () => {
    setLanguage((current) => (current === 'en' ? 'ar' : 'en'))
  }

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return (
    <SitePreferencesContext.Provider
      value={{
        language,
        theme,
        toggleLanguage,
        toggleTheme,
      }}
    >
      {children}
    </SitePreferencesContext.Provider>
  )
}

export function useSitePreferences() {
  const context = useContext(SitePreferencesContext)

  if (!context) {
    throw new Error(
      'useSitePreferences must be used within SitePreferencesProvider'
    )
  }

  return context
}
