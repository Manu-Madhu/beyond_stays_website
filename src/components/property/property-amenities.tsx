"use client"

interface Amenity {
  name: string
  description: string
  image?: string
}

interface PropertyAmenitiesProps {
  amenities: Amenity[]
}

export default function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  return (
    <section className="mt-8 md:mt-25  bg-white">
      <div className="max-w-[1350px] mx-auto h-full px-5 md:px-8">
        <div className="mb-4 md:mb-8 ">
          <h2 className="titleHeader text-[40px] md:text-[45px] leading-11 md:leading-12 uppercase">
            What We Provide
          </h2>
          <p className=" text-gray-600 max-w-2xl leading-relaxed mt-2">
            Every detail is carefully curated to ensure your stay is nothing short of extraordinary
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-black h-80 md:h-96 cursor-pointer"
            >
              {/* Background image with overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${amenity.image || `/placeholder.svg?height=400&width=400&query=${amenity.name}`}')`,
                }}
              >
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
              </div>

              {/* Content overlay - minimal and clean */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{amenity.name}</h3>
                <p className="text-sm md:text-base text-gray-100 leading-relaxed opacity-95">{amenity.description}</p>
              </div>

              {/* Elegant accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-white group-hover:w-16 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
