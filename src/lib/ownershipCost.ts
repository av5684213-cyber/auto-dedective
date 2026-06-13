// ─── Sahiplik Maliyeti Hesaplayıcı Modülü ───
// MTV, kasko, yakıt, bakım/lastik hesaplar.

export interface OwnershipCostParams {
  year: number
  engineCc: number
  fuelType: string        // 'Benzin' | 'Dizel' | 'LPG' | 'Hibrit' | 'Elektrik'
  avgFuelPer100km: number // lt/100km
  yearlyKm: number        // yıllık km
  price: number           // araç fiyatı (kasko tahmini için)
}

export interface OwnershipCostResult {
  mtv: number
  kasko: number
  yearlyFuel: number
  yearlyMaintenance: number
  monthlyTotal: number
  yearlyTotal: number
  breakdown: { label: string; amount: number }[]
}

// 2025 MTV oranları (yaklaşık, motor hacmine ve yıla göre)
// Kaynak: https://ivtb.maliye.gov.tr/
const MTV_TABLE: Record<string, number> = {
  // 1-3 yaş
  '0-1300_1': 1313, '1301-1600_1': 2280, '1601-1800_1': 4560, '1801-2000_1': 7297, '2001-2500_1': 14595, '2501-3000_1': 25542, '3001-3500_1': 49863, '3501+_1': 86687,
  // 4-5 yaş
  '0-1300_2': 985, '1301-1600_2': 1710, '1601-1800_2': 3420, '1801-2000_2': 5473, '2001-2500_2': 10946, '2501-3000_2': 19156, '3001-3500_2': 37398, '3501+_2': 65014,
  // 6+ yaş
  '0-1300_3': 656, '1301-1600_3': 1140, '1601-1800_3': 2280, '1801-2000_3': 3648, '2001-2500_3': 7297, '2501-3000_3': 12771, '3001-3500_3': 24932, '3501+_3': 43343,
}

function getEngineBand(cc: number): string {
  if (cc <= 1300) return '0-1300'
  if (cc <= 1600) return '1301-1600'
  if (cc <= 1800) return '1601-1800'
  if (cc <= 2000) return '1801-2000'
  if (cc <= 2500) return '2001-2500'
  if (cc <= 3000) return '2501-3000'
  if (cc <= 3500) return '3001-3500'
  return '3501+'
}

function getAgeBand(year: number): string {
  const currentYear = new Date().getFullYear()
  const age = currentYear - year
  if (age <= 3) return '1'
  if (age <= 5) return '2'
  return '3'
}

// Yakıt fiyatları (TL/lt) - 2025 ortalama
const FUEL_PRICES: Record<string, number> = {
  'Benzin': 42.5,
  'Dizel': 40.0,
  'LPG': 22.0,
  'Hibrit': 42.5, // benzin gibi
  'Elektrik': 0,   // elektrikli farklı hesap
}

export function calculateOwnershipCost(params: OwnershipCostParams): OwnershipCostResult {
  // 1. MTV
  const engineBand = getEngineBand(params.engineCc || 1400)
  const ageBand = getAgeBand(params.year)
  const mtv = MTV_TABLE[`${engineBand}_${ageBand}`] || 1500

  // 2. Kasko (yaklaşık: fiyatın %3-6'sı, yaşa göre)
  const currentYear = new Date().getFullYear()
  const age = currentYear - params.year
  const kaskoRate = age <= 2 ? 0.055 : age <= 5 ? 0.04 : 0.03
  const kasko = Math.round(params.price * kaskoRate)

  // 3. Yakıt
  const fuelPrice = FUEL_PRICES[params.fuelType] || FUEL_PRICES['Benzin']
  let yearlyFuel = 0
  if (params.fuelType === 'Elektrik') {
    // Elektrikli: ~15 kWh/100km, 2.5 TL/kWh
    yearlyFuel = Math.round((params.avgFuelPer100km || 15) * 2.5 * (params.yearlyKm / 100))
  } else {
    yearlyFuel = Math.round((params.avgFuelPer100km || 7) * fuelPrice * (params.yearlyKm / 100))
  }

  // 4. Bakım + Lastik (yıllık ortalama)
  const yearlyMaintenance = age <= 3 ? 5000 : age <= 7 ? 8000 : 12000

  const yearlyTotal = mtv + kasko + yearlyFuel + yearlyMaintenance
  const monthlyTotal = Math.round(yearlyTotal / 12)

  const breakdown = [
    { label: 'MTV', amount: mtv },
    { label: 'Kasko (tahmini)', amount: kasko },
    { label: 'Yakıt', amount: yearlyFuel },
    { label: 'Bakım + Lastik', amount: yearlyMaintenance },
  ]

  return { mtv, kasko, yearlyFuel, yearlyMaintenance, monthlyTotal, yearlyTotal, breakdown }
}
