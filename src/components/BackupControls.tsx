import { useRef, useState, type ChangeEvent } from 'react'
import {
  buildBackupPayload,
  parseBackupFile,
  replaceAppDataFromBackup,
} from '../db/indexedDb'
import type { AppData } from '../types'
import { ConfirmDialog } from './ConfirmDialog'

interface BackupControlsProps {
  data: AppData
  onRestored: () => void
}

export function BackupControls({ data, onRestored }: BackupControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingBackupText, setPendingBackupText] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const downloadBackup = () => {
    const payload = buildBackupPayload(data)
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    const stamp = new Date().toISOString().slice(0, 10)
    anchor.href = url
    anchor.download = `cordoval-meal-prep-backup-${stamp}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setLoadError(null)
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const text = String(reader.result ?? '')
        parseBackupFile(text)
        setPendingBackupText(text)
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Could not read that file.')
      }
    }
    reader.onerror = () => setLoadError('Could not read that file.')
    reader.readAsText(file)
  }

  const confirmRestore = async () => {
    if (!pendingBackupText) return
    try {
      const backup = parseBackupFile(pendingBackupText)
      await replaceAppDataFromBackup(backup)
      setPendingBackupText(null)
      onRestored()
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Restore failed.')
      setPendingBackupText(null)
    }
  }

  return (
    <section className="panel panel-compact" aria-labelledby="backup-heading">
      <h2 id="backup-heading" className="panel-title">Backup and restore</h2>
      <p className="panel-subtitle">
        Download a JSON file of your plan and ticks. Load replaces data on this device only.
        Nothing is uploaded.
      </p>
      <div className="backup-actions">
        <button type="button" className="btn btn-secondary" onClick={downloadBackup}>
          Backup
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          Load
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          onChange={handleFileChange}
        />
      </div>
      {loadError && (
        <p className="form-error" role="alert">{loadError}</p>
      )}

      <ConfirmDialog
        open={pendingBackupText !== null}
        title="Replace your data?"
        message="Loading a backup will replace your current week plan and shopping list ticks on this device. This cannot be undone unless you have another backup."
        confirmLabel="Replace data"
        onConfirm={() => void confirmRestore()}
        onCancel={() => setPendingBackupText(null)}
      />
    </section>
  )
}
