import type { DayKey, Meal, MealSlot } from '../types'
import { SLOT_LABELS } from '../types'

interface MealFieldsProps {
  day: DayKey
  slot: MealSlot
  meal: Meal
  onChange: (day: DayKey, slot: MealSlot, meal: Meal) => void
  onClear: (day: DayKey, slot: MealSlot) => void
}

export function MealFields({ day, slot, meal, onChange, onClear }: MealFieldsProps) {
  const hasContent = meal.name.trim() || meal.ingredients.trim()
  const optional = slot === 'snack'

  return (
    <div className="meal-block">
      <div className="meal-block-header">
        <span className="meal-slot-label">
          {SLOT_LABELS[slot]}
          {optional ? ' (optional)' : ''}
        </span>
        {hasContent && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onClear(day, slot)}
          >
            Clear
          </button>
        )}
      </div>
      <label className="field-label" htmlFor={`${day}-${slot}-name`}>
        Meal name
      </label>
      <input
        id={`${day}-${slot}-name`}
        type="text"
        className="input"
        placeholder="e.g. Porridge"
        value={meal.name}
        onChange={(e) => onChange(day, slot, { ...meal, name: e.target.value })}
        autoComplete="off"
      />
      <label className="field-label" htmlFor={`${day}-${slot}-ingredients`}>
        Ingredients
      </label>
      <textarea
        id={`${day}-${slot}-ingredients`}
        className="textarea"
        placeholder="One per line or comma separated"
        rows={2}
        value={meal.ingredients}
        onChange={(e) =>
          onChange(day, slot, { ...meal, ingredients: e.target.value })
        }
      />
    </div>
  )
}
