interface CompanyData {
    name: string;
    evToRevenue: number;
    evToEbitda: number;
  }
  
  interface CCInput {
    revenue: number;
    ebitda: number;
    comparables: CompanyData[];
  }
  
  export function calculateCCA(input: CCInput): { evToRevenue: number; evToEbitda: number } {
    const { revenue, ebitda, comparables } = input;
  
    const avgEvToRevenue = comparables.reduce((sum, company) => sum + company.evToRevenue, 0) / comparables.length;
    const avgEvToEbitda = comparables.reduce((sum, company) => sum + company.evToEbitda, 0) / comparables.length;
  
    const valuationByRevenue = revenue * avgEvToRevenue;
    const valuationByEbitda = ebitda * avgEvToEbitda;
  
    return {
      evToRevenue: valuationByRevenue,
      evToEbitda: valuationByEbitda
    };
  }