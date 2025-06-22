import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function usePreventNavigation(shouldPreventNavigationRef: { current: boolean }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = Object.fromEntries(searchParams.entries())

  const prevPathnameRef = useRef<string>(null)
  const prevSearchParamsRef = useRef<Record<string, string | null>>(null)

  useEffect(() => {
    prevPathnameRef.current = pathname
    prevSearchParamsRef.current = query
  }, [])

  useEffect(() => {
    if (
      shouldPreventNavigationRef.current &&
      (pathname !== prevPathnameRef.current || query !== prevSearchParamsRef.current) &&
      !window.confirm('There are unsaved changes, are you sure you want to exit?')
    ) {
      throw 'Navigation cancelled by user'
    }

    prevPathnameRef.current = pathname
    prevSearchParamsRef.current = query
  }, [pathname, query, shouldPreventNavigationRef])

  const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
    if (shouldPreventNavigationRef.current) {
      event.preventDefault()
    }
  }

  useEffect(() => {
    window.addEventListener('beforeunload', beforeUnloadHandler)
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
    }
  }, [])
}
