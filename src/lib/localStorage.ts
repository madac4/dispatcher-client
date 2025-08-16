import { StorageVariables } from '../constants/app.enum'

export function setStorageItem(key: StorageVariables, value: never): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getStorageItem(key: StorageVariables): unknown {
  const item = localStorage.getItem(key)

  if (item) return JSON.parse(item) ? JSON.parse(item) : item

  return null
}

export function removeStorageItem(key: StorageVariables): void {
  localStorage.removeItem(key)
}

export function clearStorage(): void {
  localStorage.clear()
}

export function hasStorageItem(key: StorageVariables): boolean {
  return !!localStorage.getItem(key)
}
