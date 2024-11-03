interface DCFInput {
    revenue: number;
    cogs: number;
    opex: number;
    revenueGrowthRate: number;
    discountRate: number;
    exitMultiple: number;
    projectionYears: number;
  }
  
  export function calculateDCF(input: DCFInput): number {
    const { revenue, cogs, opex, revenueGrowthRate, discountRate, exitMultiple, projectionYears } = input;
    let presentValue = 0;
    let currentRevenue = revenue;
    let currentCashFlow = revenue - cogs - opex;
  
    for (let year = 1; year <= projectionYears; year++) {
      currentRevenue *= (1 + revenueGrowthRate);
      currentCashFlow = currentRevenue - (cogs / revenue * currentRevenue) - (opex / revenue * currentRevenue);
      presentValue += currentCashFlow / Math.pow(1 + discountRate, year);
    }
  
    const terminalValue = currentCashFlow * exitMultiple;
    const presentTerminalValue = terminalValue / Math.pow(1 + discountRate, projectionYears);
  
    return presentValue + presentTerminalValue;
  }