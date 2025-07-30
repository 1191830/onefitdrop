import type { Exercise } from "../types"

const EXERCISE_API = "https://www.exercisedb.dev/api/v1/exercises"
const CACHE_KEY = "all_exercises_v1"

export async function fetchAllExercises(): Promise<Exercise[]> {
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    return JSON.parse(cached)
  }

  const limit = 100
  let offset = 0
  let all: Exercise[] = []

  while (true) {
    const url = `${EXERCISE_API}?offset=${offset}&limit=${limit}`
    const res = await fetch(url)
    const json = await res.json()

    if (!json.data?.length) break
    all = [...all, ...json.data]

    if (!json.metadata?.nextPage) break
    offset += limit
  }

  localStorage.setItem(CACHE_KEY, JSON.stringify(all))
  return all
}
