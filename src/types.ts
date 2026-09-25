export const PRODUCT_SLUG = 'meal-prep'
export const BACKUP_FORMAT_VERSION = 1

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface Meal {
  name: string
  ingredients: string
}

export type DayMeals = Record<MealSlot, Meal>

export type WeekPlan = Record<DayKey, DayMeals>

export interface AppData {
  weekStart: string
  weeks: Record<string, WeekPlan>
  checkedShoppingKeys: string[]
  persistWarningDismissed: boolean
}

export interface BackupFile {
  formatVersion: number
  productSlug: string
  exportedAt: string
  data: AppData
}

export const DAY_KEYS: DayKey[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
]

export const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

export const SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

export const MEAL_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack']

export function emptyMeal(): Meal {
  return { name: '', ingredients: '' }
}

export function emptyDayMeals(): DayMeals {
  return {
    breakfast: emptyMeal(),
    lunch: emptyMeal(),
    dinner: emptyMeal(),
    snack: emptyMeal(),
  }
}

export function emptyWeekPlan(): WeekPlan {
  return {
    mon: emptyDayMeals(),
    tue: emptyDayMeals(),
    wed: emptyDayMeals(),
    thu: emptyDayMeals(),
    fri: emptyDayMeals(),
    sat: emptyDayMeals(),
    sun: emptyDayMeals(),
  }
}

export function mondayOfWeekContaining(date: Date): string {
  const d = new Date(date)
  d.setHours(12, 0, 0, 0)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return toDateKey(d)
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

export function addDaysToDateKey(key: string, days: number): string {
  const d = parseDateKey(key)
  d.setDate(d.getDate() + days)
  return toDateKey(d)
}

export function formatDayHeading(weekStart: string, dayIndex: number): string {
  const date = parseDateKey(addDaysToDateKey(weekStart, dayIndex))
  const label = DAY_LABELS[DAY_KEYS[dayIndex]]
  const formatted = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
  return `${label} ${formatted}`
}

export function defaultAppData(): AppData {
  const weekStart = mondayOfWeekContaining(new Date())
  return {
    weekStart,
    weeks: { [weekStart]: emptyWeekPlan() },
    checkedShoppingKeys: [],
    persistWarningDismissed: false,
  }
}

export function weekPlanFor(data: AppData, weekStart: string): WeekPlan {
  return data.weeks[weekStart] ?? emptyWeekPlan()
}
