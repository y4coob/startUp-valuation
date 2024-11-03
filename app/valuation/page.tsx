'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'
import { calculateDCF } from '../valuation-methods/discounted-cash-flow'
import { calculateCCA } from '../valuation-methods/comparable-company-analysis'
import { ValuationResults } from '../components/ValuationResults'

const steps = [
  {
    title: 'Financial Metrics',
    fields: [
      { name: 'revenue', label: 'Revenue', tooltip: 'Current annual revenue of your startup' },
      { name: 'cogs', label: 'Cost of Goods Sold', tooltip: 'Direct costs associated with producing your goods or services' },
      { name: 'opex', label: 'Operating Expenses', tooltip: 'Ongoing costs for running your business, including salaries, rent, and marketing' },
    ],
  },
  {
    title: 'Growth Metrics',
    fields: [
      { name: 'revenueGrowthRate', label: 'Revenue Growth Rate', tooltip: 'Expected annual percentage increase in revenue' },
      { name: 'userAcquisitionRate', label: 'User Acquisition Rate', tooltip: 'Expected monthly percentage increase in your user base' },
    ],
  },
  {
    title: 'Market and Competition',
    fields: [
      { name: 'marketSize', label: 'Market Size', tooltip: 'Total addressable market size in dollars' },
      { name: 'competitivePositioning', label: 'Competitive Positioning', tooltip: 'Rate your competitive advantage from 1 (weak) to 10 (strong)' },
    ],
  },
  {
    title: 'Assumptions',
    fields: [
      { name: 'discountRate', label: 'Discount Rate', tooltip: 'Rate used to discount future cash flows, typically between 20-40% for startups' },
      { name: 'exitMultiple', label: 'Exit Multiple', tooltip: 'Expected exit multiple (e.g., 5x revenue) for your startup' },
      { name: 'capex', label: 'Capital Expenditures', tooltip: 'Expected annual spending on major physical goods or services' },
    ],
  },
]

const startupStages = [
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'seriesA', label: 'Series A' },
  { value: 'seriesB', label: 'Series B' },
  { value: 'seriesC', label: 'Series C' },
]

export default function ValuationPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [valuationResults, setValuationResults] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    validateField(name, value)
  }

  const validateField = (name, value) => {
    let error = ''
    if (!value) {
      error = 'This field is required'
    } else if (name === 'revenueGrowthRate' && (parseFloat(value) < 0 || parseFloat(value) > 1000)) {
      error = 'Growth rate should be between 0% and 1000%'
    } else if (name === 'competitivePositioning' && (parseInt(value) < 1 || parseInt(value) > 10)) {
      error = 'Competitive positioning should be between 1 and 10'
    }
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      calculateValuation()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateValuation = () => {
    const dcfValue = calculateDCF({
      revenue: parseFloat(formData.revenue),
      cogs: parseFloat(formData.cogs),
      opex: parseFloat(formData.opex),
      revenueGrowthRate: (parseFloat(formData.revenueGrowthRate) / 100),
      discountRate:( parseFloat(formData.discountRate) / 100 ),
      exitMultiple: parseFloat(formData.exitMultiple),
      projectionYears: 5, // You might want to make this configurable
    })

    const ccaValue = calculateCCA({
      revenue: parseFloat(formData.revenue),
      ebitda: parseFloat(formData.revenue) - parseFloat(formData.cogs) - parseFloat(formData.opex),
      comparables: [
        { name: 'Company A', evToRevenue: 5, evToEbitda: 15 },
        { name: 'Company B', evToRevenue: 4, evToEbitda: 12 },
        { name: 'Company C', evToRevenue: 6, evToEbitda: 18 },
      ],
    })

    setValuationResults({ dcfValue, ccaValue })
  }

  const handleStageSelect = (value) => {
    // Preset values based on startup stage
    const presetValues = {
      'pre-seed': { revenueGrowthRate: '200', discountRate: '50' },
      'seed': { revenueGrowthRate: '150', discountRate: '40' },
      'seriesA': { revenueGrowthRate: '100', discountRate: '30' },
      'seriesB': { revenueGrowthRate: '75', discountRate: '25' },
      'seriesC': { revenueGrowthRate: '50', discountRate: '20' },
    }

    setFormData(prev => ({ ...prev, ...presetValues[value] }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {valuationResults ? (
        <ValuationResults dcfValue={valuationResults.dcfValue} ccaValue={valuationResults.ccaValue} />
      ) : (
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Step {currentStep + 1}: {steps[currentStep].title}</CardTitle>
            <CardDescription>Enter your startup's data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="stage">Startup Stage</Label>
              <Select onValueChange={handleStageSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your startup stage" />
                </SelectTrigger>
                <SelectContent>
                  {startupStages.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {steps[currentStep].fields.map((field) => (
              <div key={field.name} className="grid w-full items-center gap-4 mb-4">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="p-0 h-auto ml-1">
                            <InfoIcon className="w-4 h-4" />
                            <span className="sr-only">Info</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{field.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    onChange={handleInputChange}
                    value={formData[field.name] || ''}
                  />
                  {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>Previous</Button>
            <Button onClick={nextStep}>{currentStep === steps.length - 1 ? 'Calculate Valuation' : 'Next'}</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}