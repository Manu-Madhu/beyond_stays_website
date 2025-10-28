"use client"

interface Reason {
  title: string
  description: string
}

interface WhyChooseUsProps {
  reasons: Reason[]
}

export default function WhyChooseUs({ reasons }: WhyChooseUsProps) {
  return (
    <section className="mt-8 md:mt-25 py-10 md:py-20 bg-black text-white">
      <div className="max-w-[1350px] mx-auto h-full px-5 md:px-8">
        <div className="mb-16 md:mb-20">
          <h2 className="titleHeader text-[40px] md:text-[45px] leading-11 md:leading-12 uppercase mb-3">
           Why Choose Beyond Stays
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            We're not just a travel company. We're curators of unforgettable experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group relative p-8 md:p-10 border border-white/15 rounded-2xl hover:border-white/40 transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.05]"
            >
              {/* Clean number badge */}
              <div className="mb-6 flex items-center gap-4">
                <div className="text-5xl md:text-6xl font-light text-white/30 group-hover:text-white/50 transition-colors duration-300">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight group-hover:text-white transition-colors">
                {reason.title}
              </h3>
              <p className="text-base md:text-lg text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {reason.description}
              </p>

              {/* Subtle accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-12 transition-all duration-300" />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
