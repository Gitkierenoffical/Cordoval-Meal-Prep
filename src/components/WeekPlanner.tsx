import {
  DAY_KEYS,
  addDaysToDateKey,
  formatDayHeading,
  parseDateKey,
  type DayKey,
  type Meal,
  type MealSlot,
  type WeekPlan,
  emptyMeal,
} from '../types'
import { MealFields } from './MealFields'

interface WeekPlannerProps {
  weekStart: string
  week: WeekPlan
  onUpdateWeek: (updater: (week: WeekPlan) => WeekPlan) => void
  onWeekStartChange: (weekStart: string) => void
  onClearWeek: () => void
}

export function WeekPlanner({
  weekStart,
  week,
  onUpdateWeek,
  onWeekStartChange,
  onClearWeek,
}: WeekPlannerProps) {
  const handleMealChange = (day: DayKey, slot: MealSlot, meal: Meal) => {
    onUpdateWeek((week) => ({
      ...week,
      [day]: {
        ...week[day],
        [slot]: meal,
      },
    }))
  }

  const handleClearSlot = (day: DayKey, slot: MealSlot) => {
    onUpdateWeek((week) => ({
      ...week,
      [day]: {
        ...week[day],
        [slot]: emptyMeal(),
      },
    }))
  }

  const weekRangeLabel = () => {
    const start = parseDateKey(weekStart).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    })
    const end = parseDateKey(addDaysToDateKey(weekStart, 6)).toLocaleDateString(
      'en-GB',
      { day: 'numeric', month: 'short' },
    )
    return `${start} to ${end}`
  }

  return (
    <section className="panel" aria-labelledby="week-heading">
      <div className="panel-header">
        <div>
          <h2 id="week-heading" className="panel-title">Week plan</h2>
          <p className="panel-subtitle">Week of {weekRangeLabel()}</p>
        </div>
        <div className="panel-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onWeekStartChange(addDaysToDateKey(weekStart, -7))}
          >
            Previous week
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onWeekStartChange(addDaysToDateKey(weekStart, 7))}
          >
            Next week
          </button>
          <button type="button" className="btn btn-danger btn-sm" onClick={onClearWeek}>
            Clear week
          </button>
        </div>
      </div>

      <div className="week-grid">
        {DAY_KEYS.map((day, index) => (
          <article key={day} className="day-card">
            <h3 className="day-card-title">{formatDayHeading(weekStart, index)}</h3>
            <MealFields
              day={day}
              slot="breakfast"
              meal={week[day].breakfast}
              onChange={handleMealChange}
              onClear={handleClearSlot}
            />
            <MealFields
              day={day}
              slot="lunch"
              meal={week[day].lunch}
              onChange={handleMealChange}
              onClear={handleClearSlot}
            />
            <MealFields
              day={day}
              slot="dinner"
              meal={week[day].dinner}
              onChange={handleMealChange}
              onClear={handleClearSlot}
            />
            <MealFields
              day={day}
              slot="snack"
              meal={week[day].snack}
              onChange={handleMealChange}
              onClear={handleClearSlot}
            />
          </article>
        ))}
      </div>
    </section>
  )
}
