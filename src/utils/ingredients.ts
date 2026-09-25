import type { WeekPlan } from '../types'

export function parseIngredientLines(raw: string): string[] {
  if (!raw.trim()) return []
  const parts = raw
    .split(/[\n,]+/)
    .map((p) => p.trim())
    .filter(Boolean)
  return parts
}

export function ingredientKey(line: string): string {
  return line.trim().toLowerCase()
}

export function buildShoppingList(week: WeekPlan): string[] {
  const seen = new Map<string, string>()

  for (const day of Object.values(week)) {
    for (const meal of Object.values(day)) {
      for (const line of parseIngredientLines(meal.ingredients)) {
        const key = ingredientKey(line)
        if (!seen.has(key)) {
          seen.set(key, line.trim())
        }
      }
    }
  }

  return Array.from(seen.values()).sort((a, b) =>
    a.localeCompare(b, 'en-GB', { sensitivity: 'base' }),
  )
}
