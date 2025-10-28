"use client"

interface Attraction {
  name: string
  distance: string
  description: string
}

interface NearbyAttractionsProps {
  attractions: Attraction[]
}

export default function NearbyAttractions({ attractions }: NearbyAttractionsProps) {
  return (
    <section className="mt-8 md:mt-25">
      <div className="max-w-[1350px] mx-auto h-full px-5 md:px-8">
        <h2 className="titleHeader text-[40px] md:text-[45px] leading-11 md:leading-12 uppercase  mb-12">
          Best Spots to Visit Nearby
        </h2>
        <div className="space-y-6">
          {attractions.map((attraction, index) => (
            <div key={index} className="flex items-start gap-6 pb-6 border-b border-gray-200 last:border-b-0">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full font-semibold">
                  {index + 1}
                </div>
              </div>

              <div className="flex-grow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-black">{attraction.name}</h3>
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {attraction.distance}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">{attraction.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
