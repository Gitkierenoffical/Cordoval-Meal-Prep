interface PersistWarningProps {
  visible: boolean
  onDismiss: () => void
}

export function PersistWarning({ visible, onDismiss }: PersistWarningProps) {
  if (!visible) return null

  return (
    <div className="banner banner-warning" role="status">
      <p>
        Your browser may clear this site&apos;s data when storage is low. Use Backup
        regularly to keep a copy on your device.
      </p>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  )
}
