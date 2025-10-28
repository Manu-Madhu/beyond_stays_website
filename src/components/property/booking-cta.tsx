"use client"

interface BookingCTAProps {
  propertyName: string
}

export default function BookingCTA({ propertyName }: BookingCTAProps) {
  const handleWhatsAppClick = () => {
    const message = `Hi! I'm interested in booking ${propertyName} at Beyond Stays. Could you please provide more details and availability?`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/918304055778?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <section className="py-16 md:py-20 px-6 md:px-12 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold  text-black"></h2>
        <h2 className="titleHeader text-[40px] md:text-[45px] leading-11 md:leading-12 mb-4">
            Ready to Book Your Adventure?
          </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Connect with our team on WhatsApp to check availability, customize your package, and start planning your
          unforgettable journey.
        </p>

        <button
          onClick={handleWhatsAppClick}
          className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-lg"
        >
          <span>💬</span>
          Chat on WhatsApp
        </button>

        <p className="text-sm text-gray-500 mt-6">Our team typically responds within 2 hours during business hours</p>
      </div>
    </section>
  )
}
