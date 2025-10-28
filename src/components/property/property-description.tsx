"use client"

import Header from "../common/Header"

interface PropertyDescriptionProps {
  description: string
  price: number
}

export default function PropertyDescription({ description, price }: PropertyDescriptionProps) {
  return (
    <section className="mt-8 md:mt-20 max-w-[1350px] mx-auto h-full px-5 md:px-8">
      <div className="grid md:grid-cols-3 gap-5 md:gap-12">
        <div className="md:col-span-2">
          {/* Header */}
          <Header
            title="About This Property"
            className="w-full md:w-[80%] gap-2 md:gap-10 flex flex-col md:flex-row md:items-end"
          >
          </Header>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">{description}</p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-black">What to Expect</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-black font-bold mt-1">✓</span>
                <span>Immersive nature experience with modern comfort and amenities</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold mt-1">✓</span>
                <span>Expert local guides to enhance your journey and share cultural insights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold mt-1">✓</span>
                <span>Curated activities designed for relaxation and adventure</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold mt-1">✓</span>
                <span>Sustainable practices that support local communities</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Price Card */}
        <div className="md:col-span-1">
          <div className="sticky top-6 bg-black text-white p-8 rounded-lg">
            <p className="text-sm opacity-75 mb-2">Starting from</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">₹{price.toLocaleString()}</span>
              <p className="text-sm opacity-75 mt-2">per person per night</p>
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
              <div className="flex justify-between text-sm">
                <span className="opacity-75">Accommodation</span>
                <span>✓</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-75">Meals</span>
                <span>✓</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-75">Activities</span>
                <span>✓</span>
              </div>
            </div>

            <p className="text-xs opacity-75 text-center">All-inclusive pricing</p>
          </div>
        </div>
      </div>
    </section>
  )
}
