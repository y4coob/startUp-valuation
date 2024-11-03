import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ValuationResultsProps {
  dcfValue: number;
  ccaValue: { evToRevenue: number; evToEbitda: number };
}

export function ValuationResults({ dcfValue, ccaValue }: ValuationResultsProps) {
  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Valuation Results</CardTitle>
        <CardDescription>Based on the provided data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Discounted Cash Flow Valuation</h3>
            <p>${dcfValue.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold">Comparable Company Analysis</h3>
            <p>EV/Revenue: ${ccaValue.evToRevenue.toLocaleString()}</p>
            <p>EV/EBITDA: ${ccaValue.evToEbitda.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}