import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Startup Valuation App</h1>
      <p className="text-xl mb-8 text-gray-600">Calculate your startup's value using multiple methods</p>
      <Link href="/valuation">
        <Button>Start Valuation</Button>
      </Link>
    </main>
  )
}