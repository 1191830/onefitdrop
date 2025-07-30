import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import type { Exercise } from "./types"
import { fetchAllExercises } from "./utils/api"
import { useDailyExercise } from "./hooks/useDailyExercice"
// import { AffiliateLinks } from "./components/affiliate"

export default function App() {
  
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [bodyParts, setBodyParts] = useState<string[]>([])
  const [equipments, setEquipments] = useState<string[]>([])
  const [filter, setFilter] = useState({ bodyPart: "", equipment: "" })

  useEffect(() => {
    fetchAllExercises().then((data) => {
      setExercises(data)
      setBodyParts([...new Set(data.flatMap(e => e.bodyParts))])
      setEquipments([...new Set(data.flatMap(e => e.equipments))])
    })
  }, [])

  const { filtered, selected, setSelected } = useDailyExercise(exercises, filter)

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilter(prev => ({ ...prev, [name]: value }))
  }

  const getRandomExercise = () => {
    if (filtered.length === 0) return
    const index = Math.floor(Math.random() * filtered.length)
    setSelected(filtered[index])
  }

  return (
    <>
      <Helmet>
        <title>Exercise of the Day - OneFitDrop</title>
        <meta name="description" content="Discover the exercise of the day for your favorite muscle groups. Filter by equipment and stay in shape with varied exercises." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content="Exercise of the Day - OneFitDrop" />
        <meta property="og:description" content="Discover the exercise of the day for your favorite muscle groups. Filter by equipment and stay in shape with varied exercises." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={selected?.gifUrl || "/default-exercise-image.png"} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Exercise of the Day - OneFitDrop" />
        <meta name="twitter:description" content="Discover the exercise of the day for your favorite muscle groups. Filter by equipment and stay in shape with varied exercises." />
        <meta name="twitter:image" content={selected?.gifUrl || "/default-exercise-image.png"} />
      </Helmet>

      <div className="min-h-screen bg-gray-100 text-gray-800 px-4 py-6 flex flex-col items-center">
        <h1
          onClick={() => location.reload()}
          className="text-2xl sm:text-3xl font-bold mb-6 cursor-pointer select-none hover:opacity-80 transition text-center"
          title="Reload the exercise of the day"
        >
          🏋️ Exercise of the Day 🔄
        </h1>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center w-full max-w-2xl">
          <select
            name="bodyPart"
            value={filter.bodyPart}
            onChange={handleFilter}
            className="px-3 py-2 border rounded w-full sm:w-auto"
          >
            <option value="">All Muscle Groups</option>
            {bodyParts.map(bp => (
              <option key={bp} value={bp}>{bp}</option>
            ))}
          </select>

          <select
            name="equipment"
            value={filter.equipment}
            onChange={handleFilter}
            className="px-3 py-2 border rounded w-full sm:w-auto"
          >
            <option value="">All Equipment</option>
            {equipments.map(eq => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>
        </div>

        {/* Exercise Display */}
        {selected && (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow max-w-xl w-full text-center">
            <h2 className="text-xl sm:text-2xl font-semibold">{selected.name}</h2>
            <img
              src={selected.gifUrl}
              alt={selected.name}
              className="w-full max-h-64 object-contain my-4"
            />
            <p className="text-gray-700 text-sm mb-2">
              <strong>Target:</strong> {selected.targetMuscles.join(", ")}
            </p>
            <p className="text-gray-500 text-sm mb-2">
              <strong>Secondary:</strong> {selected.secondaryMuscles.join(", ")}
            </p>
            <ul className="text-left text-sm mt-4 space-y-1">
              {selected.instructions.map((step: string, i: number) => (
                <li key={i}>• {step}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Random Button */}
        <button
          onClick={getRandomExercise}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
        >
          🔀 Another Random
        </button>

        {/* Affiliate Links - Responsive Row */}
{/*         <section className="mt-12 max-w-5xl w-full px-2 mx-auto">
          <AffiliateLinks />
        </section> */}
      </div>

    </>
  )
}
