import { useMemo } from "react"
import { gymAffiliateProducts } from "./gymAffiliateProducts"

export function AffiliateLinks() {
  const clickbankProduct = {
    id: "clickbank",
    name: "Hypertrophy Training Plan",
    description: "Mass-building training plan to accelerate muscle growth.",
    imageUrl: "https://via.placeholder.com/300x200?text=ClickBank+Offer",
    link: "https://hop.clickbank.net/?affiliate=yourid&vendor=productname",
  }

  const todayKey = new Date().toISOString().split("T")[0] // YYYY-MM-DD

  const dailyAmazonProduct = useMemo(() => {
    const hash = Array.from(todayKey).reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const index = hash % gymAffiliateProducts.length
    return gymAffiliateProducts[index]
  }, [todayKey])

  const deals = [clickbankProduct, dailyAmazonProduct]

  return (
    <section className="mt-12 max-w-5xl w-full px-4 mx-auto">
      <h3 className="text-xl font-semibold mb-6 text-center">🔥 Daily Deals</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center">
        {deals.map(({ id, name, description, imageUrl, link }) => (
          <a
            key={id}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            <img src={imageUrl} alt={name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-2">{name}</h4>
              <p className="text-gray-600 text-sm mb-4">{description}</p>
              <button className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition">
                View Deal
              </button>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
