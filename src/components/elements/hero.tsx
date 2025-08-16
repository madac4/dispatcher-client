import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'

export function Hero() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto">
          Welcome to OSOW.EXPRESS. Your one stop solution for all your oversize, overweight permitting, and high value
          insurance needs.
        </h1>

        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          Whether you need a one state routine permit or have a move that spans multiple states and requires additional
          insurance, escorts, and route surveys. We are here to help!
        </p>

        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg">
          <Phone className="mr-2 h-5 w-5" />
          Call us 833.553.0483
        </Button>
      </div>
    </section>
  )
}
