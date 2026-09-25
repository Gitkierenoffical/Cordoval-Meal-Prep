import { useCallback, useEffect, useState } from 'react'
import {
  isStoragePersisted,
  loadAppData,
  requestPersistentStorage,
  saveAppData,
} from '../db/indexedDb'
import type { AppData } from '../types'

export interface AppDataState {
  data: AppData | null
  ready: boolean
  storagePersisted: boolean | null
  persistChecked: boolean
  update: (patch: AppData | ((prev: AppData) => AppData)) => void
  refreshFromDb: () => Promise<void>
}

export function useAppData(): AppDataState {
  const [data, setData] = useState<AppData | null>(null)
  const [ready, setReady] = useState(false)
  const [storagePersisted, setStoragePersisted] = useState<boolean | null>(null)
  const [persistChecked, setPersistChecked] = useState(false)

  const refreshFromDb = useCallback(async () => {
    const loaded = await loadAppData()
    setData(loaded)
    setReady(true)
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const granted = await requestPersistentStorage()
      const persisted = await isStoragePersisted()
      if (!cancelled) {
        setStoragePersisted(persisted || granted)
        setPersistChecked(true)
      }
      await refreshFromDb()
    })()
    return () => {
      cancelled = true
    }
  }, [refreshFromDb])

  const update = useCallback(
    (patch: AppData | ((prev: AppData) => AppData)) => {
      setData((prev) => {
        if (!prev) return prev
        const next = typeof patch === 'function' ? patch(prev) : patch
        void saveAppData(next)
        return next
      })
    },
    [],
  )

  return {
    data,
    ready,
    storagePersisted,
    persistChecked,
    update,
    refreshFromDb,
  }
}
