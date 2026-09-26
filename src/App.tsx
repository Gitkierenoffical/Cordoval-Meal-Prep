import { useState } from 'react'
import { BackupControls } from './components/BackupControls'
import { ConfirmDialog } from './components/ConfirmDialog'
import { BuildHouseDailyAd } from './components/BuildHouseDailyAd'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { PersistWarning } from './components/PersistWarning'
import { ShoppingList } from './components/ShoppingList'
import { WeekPlanner } from './components/WeekPlanner'
import { useAppData } from './hooks/useAppData'
import { emptyWeekPlan, weekPlanFor } from './types'

type ConfirmKind = 'clearWeek' | 'clearTicks' | null

function App() {
  const { data, ready, storagePersisted, persistChecked, update, refreshFromDb } =
    useAppData()
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null)

  if (!ready || !data) {
    return (
      <div className="app-loading">
        <p>Loading your week…</p>
      </div>
    )
  }

  const showPersistWarning =
    persistChecked &&
    storagePersisted === false &&
    !data.persistWarningDismissed

  const dismissPersistWarning = () => {
    update({ ...data, persistWarningDismissed: true })
  }

  const confirmClearWeek = () => {
    update((prev) => ({
      ...prev,
      weeks: {
        ...prev.weeks,
        [prev.weekStart]: emptyWeekPlan(),
      },
      checkedShoppingKeys: [],
    }))
    setConfirmKind(null)
  }

  const currentWeek = weekPlanFor(data, data.weekStart)

  const confirmClearTicks = () => {
    update((prev) => ({
      ...prev,
      checkedShoppingKeys: [],
    }))
    setConfirmKind(null)
  }

  return (
    <div className="app">
      <Header />
      <PersistWarning visible={showPersistWarning} onDismiss={dismissPersistWarning} />

      <main className="app-main">
        <div className="layout-primary">
          <WeekPlanner
            weekStart={data.weekStart}
            week={currentWeek}
            onUpdateWeek={(updater) =>
              update((prev) => {
                const key = prev.weekStart
                const current = weekPlanFor(prev, key)
                return {
                  ...prev,
                  weeks: { ...prev.weeks, [key]: updater(current) },
                }
              })
            }
            onWeekStartChange={(weekStart) =>
              update((prev) => ({
                ...prev,
                weekStart,
                weeks: prev.weeks[weekStart]
                  ? prev.weeks
                  : { ...prev.weeks, [weekStart]: emptyWeekPlan() },
              }))
            }
            onClearWeek={() => setConfirmKind('clearWeek')}
          />
        </div>
        <div className="layout-side">
          <ShoppingList
            week={currentWeek}
            checkedShoppingKeys={data.checkedShoppingKeys}
            onToggleChecked={(key) =>
              update((prev) => {
                const set = new Set(prev.checkedShoppingKeys)
                if (set.has(key)) set.delete(key)
                else set.add(key)
                return { ...prev, checkedShoppingKeys: Array.from(set) }
              })
            }
            onClearListState={() => setConfirmKind('clearTicks')}
          />
          <BackupControls data={data} onRestored={() => void refreshFromDb()} />
        </div>
      </main>

      <BuildHouseDailyAd />
      <Footer />

      <ConfirmDialog
        open={confirmKind === 'clearWeek'}
        title="Clear this week?"
        message="This removes all meal names and ingredients for every day in this week view. Shopping list ticks will reset too."
        confirmLabel="Clear week"
        onConfirm={confirmClearWeek}
        onCancel={() => setConfirmKind(null)}
      />

      <ConfirmDialog
        open={confirmKind === 'clearTicks'}
        title="Clear all ticks?"
        message="This unchecks every item on your shopping list. Your meals stay as they are."
        confirmLabel="Clear ticks"
        onConfirm={confirmClearTicks}
        onCancel={() => setConfirmKind(null)}
      />
    </div>
  )
}

export default App
