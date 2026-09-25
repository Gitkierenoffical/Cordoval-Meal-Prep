import { useMemo } from 'react'
import { useState } from 'react'
import type { WeekPlan } from '../types'
import { buildShoppingList, ingredientKey } from '../utils/ingredients'

interface ShoppingListProps {
  week: WeekPlan
  checkedShoppingKeys: string[]
  onToggleChecked: (key: string) => void
  onClearListState: () => void
}

export function ShoppingList({
  week,
  checkedShoppingKeys,
  onToggleChecked,
  onClearListState,
}: ShoppingListProps) {
  const items = useMemo(() => buildShoppingList(week), [week])
  const checkedSet = useMemo(
    () => new Set(checkedShoppingKeys),
    [checkedShoppingKeys],
  )
  const [copyFeedback, setCopyFeedback] = useState(false)

  const copyList = async () => {
    const lines = items.map((item) => {
      const key = ingredientKey(item)
      const ticked = checkedSet.has(key)
      return ticked ? `[done] ${item}` : item
    })
    const text = lines.length ? lines.join('\n') : 'No ingredients yet. Add meals to build your list.'
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      window.setTimeout(() => setCopyFeedback(false), 2000)
    } catch {
      setCopyFeedback(false)
    }
  }

  const uncheckedCount = items.filter((i) => !checkedSet.has(ingredientKey(i))).length

  return (
    <section className="panel panel-sticky" aria-labelledby="shopping-heading">
      <div className="panel-header">
        <div>
          <h2 id="shopping-heading" className="panel-title">Shopping list</h2>
          <p className="panel-subtitle">
            {items.length === 0
              ? 'Add ingredients to your meals to see items here.'
              : `${uncheckedCount} of ${items.length} left to buy`}
          </p>
        </div>
        <div className="panel-actions">
          <button
            type="button"
            className={`btn btn-primary btn-sm${copyFeedback ? ' btn-copied' : ''}`}
            onClick={() => void copyList()}
            aria-live="polite"
          >
            {copyFeedback ? 'Copied' : 'Copy list'}
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onClearListState}
            disabled={checkedShoppingKeys.length === 0}
          >
            Clear ticks
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="empty-hint">Your aggregated ingredients will appear here.</p>
      ) : (
        <ul className="shopping-list">
          {items.map((item) => {
            const key = ingredientKey(item)
            const checked = checkedSet.has(key)
            return (
              <li key={key} className={checked ? 'shopping-item checked' : 'shopping-item'}>
                <label className="shopping-item-label">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleChecked(key)}
                  />
                  <span>{item}</span>
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
