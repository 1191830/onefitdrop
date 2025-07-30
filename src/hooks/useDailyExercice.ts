import { useEffect, useState } from "react"
import type { Exercise } from "../types"

export function useDailyExercise(
  exercises: Exercise[],
  filter: { bodyPart: string; equipment: string }
) {
  const [filtered, setFiltered] = useState<Exercise[]>([])
  const [selected, setSelected] = useState<Exercise | null>(null)

  useEffect(() => {
    let result = exercises

    if (filter.bodyPart) {
      result = result.filter((e) => e.bodyParts.includes(filter.bodyPart))
    }

    if (filter.equipment) {
      result = result.filter((e) => e.equipments.includes(filter.equipment))
    }

    setFiltered(result)

    const today = new Date().toISOString().slice(0, 10)
    let parsed: { exerciseId: string; date: string } | null = null

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dailyExercise")
      if (stored) {
        try {
          parsed = JSON.parse(stored)
        } catch (e) {
          console.warn("localStorage data corrupted, ignoring", e)
        }
      }
    }

    if (parsed && parsed.date === today) {
      const found = result.find((e) => e.exerciseId === parsed.exerciseId)
      if (found) {
        setSelected(found)
        return
      }
    }

    if (result.length > 0) {
      const index = Math.floor(Math.random() * result.length)
      const random = result[index]
      setSelected(random)
      localStorage.setItem(
        "dailyExercise",
        JSON.stringify({
          exerciseId: random.exerciseId,
          date: today,
        })
      )
    } else {
      setSelected(null)
    }
  }, [exercises, filter])

  return { filtered, selected, setSelected }
}
