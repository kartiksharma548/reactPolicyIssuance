import { useState, useEffect } from "react";

export default function useLocalStorage(key: string, initialValue: string) {
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(key)
    //if (jsonValue != null) return JSON.parse(jsonValue)
    return initialValue
  })

  useEffect(() => {
    //console.log("ItemSet"+value)
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}