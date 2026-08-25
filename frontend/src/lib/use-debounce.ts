import { useEffect, useState } from "react"

/** Devuelve `value` retrasado `delay` ms, para no disparar una petición por tecla. */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
