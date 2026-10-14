export function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch (error) {
    console.error(`Could not read ${key} from browser storage.`, error)
    return fallback
  }
}

export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function userStorageKey(collection) {
  const user = readStorage('user', {}) || {}
  return `${collection}:${user.id || user.email || 'guest'}`
}
