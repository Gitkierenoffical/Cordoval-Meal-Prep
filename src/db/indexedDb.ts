import {
  BACKUP_FORMAT_VERSION,
  PRODUCT_SLUG,
  defaultAppData,
  type AppData,
  type BackupFile,
  type WeekPlan,
} from '../types'

const DB_NAME = 'cordoval-meal-prep'
const DB_VERSION = 1
const STORE = 'app'

const DATA_KEY = 'data'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error ?? new Error('Failed to open database'))
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
  })
}

function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode)
        const store = tx.objectStore(STORE)
        const request = fn(store)
        request.onerror = () => reject(request.error ?? new Error('Database request failed'))
        request.onsuccess = () => resolve(request.result as T)
        tx.oncomplete = () => db.close()
        tx.onerror = () => reject(tx.error ?? new Error('Transaction failed'))
      }),
  )
}

export async function loadAppData(): Promise<AppData> {
  try {
    const stored = await withStore<AppData | undefined>('readonly', (store) =>
      store.get(DATA_KEY),
    )
    if (!stored || typeof stored !== 'object') {
      const initial = defaultAppData()
      await saveAppData(initial)
      return initial
    }
    return mergeWithDefaults(stored)
  } catch {
    const initial = defaultAppData()
    return initial
  }
}

function mergeWithDefaults(partial: Partial<AppData> & { week?: WeekPlan }): AppData {
  const base = defaultAppData()
  const weekStart = partial.weekStart ?? base.weekStart
  let weeks = partial.weeks
  if (!weeks && partial.week) {
    weeks = { [weekStart]: partial.week }
  }
  if (!weeks) {
    weeks = base.weeks
  }
  return {
    weekStart,
    weeks,
    checkedShoppingKeys: partial.checkedShoppingKeys ?? base.checkedShoppingKeys,
    persistWarningDismissed:
      partial.persistWarningDismissed ?? base.persistWarningDismissed,
  }
}

export function saveAppData(data: AppData): Promise<void> {
  return withStore('readwrite', (store) => store.put(data, DATA_KEY)).then(() => undefined)
}

export function buildBackupPayload(data: AppData): BackupFile {
  return {
    formatVersion: BACKUP_FORMAT_VERSION,
    productSlug: PRODUCT_SLUG,
    exportedAt: new Date().toISOString(),
    data,
  }
}

export function parseBackupFile(text: string): BackupFile {
  const parsed = JSON.parse(text) as BackupFile
  if (parsed.formatVersion !== BACKUP_FORMAT_VERSION) {
    throw new Error(
      `This backup uses format version ${parsed.formatVersion}. This app expects version ${BACKUP_FORMAT_VERSION}.`,
    )
  }
  if (parsed.productSlug !== PRODUCT_SLUG) {
    throw new Error(
      'This backup is not for Cordoval Meal Prep. Choose a meal-prep backup file.',
    )
  }
  if (!parsed.data || typeof parsed.data !== 'object') {
    throw new Error('The backup file is missing data.')
  }
  return parsed
}

export async function replaceAppDataFromBackup(backup: BackupFile): Promise<AppData> {
  const data = mergeWithDefaults(backup.data)
  await saveAppData(data)
  return data
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) {
    return false
  }
  try {
    return await navigator.storage.persist()
  } catch {
    return false
  }
}

export async function isStoragePersisted(): Promise<boolean> {
  if (!navigator.storage?.persisted) {
    return false
  }
  try {
    return await navigator.storage.persisted()
  } catch {
    return false
  }
}
