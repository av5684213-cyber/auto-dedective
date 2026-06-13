/**
 * OtoDedektif - Kademeli Araç Kataloğu Verisi
 * En yaygın ~30 otomobil markası ve seri/model ağacı
 * TODO: Tüm marka/model/versiyon ağacını doldur
 */

export interface CarSeries {
  name: string
  models: CarModel[]
}

export interface CarModel {
  name: string
  years: number[]
  variants: string[]
}

export interface CarBrand {
  name: string
  series: CarSeries[]
}

export const CAR_CATALOG: CarBrand[] = [
  {
    name: 'Renault',
    series: [
      { name: 'Clio', models: [{ name: 'Clio', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Joy','Icon','Esprit'] }] },
      { name: 'Megane', models: [{ name: 'Megane', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Touch','Zen','Intens','RS'] }] },
      { name: 'Captur', models: [{ name: 'Captur', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Life','Icon','Intens','RS Line'] }] },
      { name: 'Kadjar', models: [{ name: 'Kadjar', years: [2016,2017,2018,2019,2020,2021], variants: ['Life','Zen','Intens','BOSE'] }] },
      { name: 'Taliant', models: [{ name: 'Taliant', years: [2021,2022,2023,2024], variants: ['Life','Zen','Intens'] }] },
    ]
  },
  {
    name: 'Fiat',
    series: [
      { name: 'Egea', models: [{ name: 'Egea Sedan', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Easy','Urban','Lounge','Sport'] }, { name: 'Egea Hatchback', years: [2020,2021,2022,2023,2024], variants: ['Easy','Urban','Lounge'] }] },
      { name: '500', models: [{ name: '500', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023], variants: ['Pop','Pop Star','Lounge','S'] }] },
      { name: 'Panda', models: [{ name: 'Panda', years: [2016,2017,2018,2019,2020,2021,2022], variants: ['Easy','Cool','Lounge','4x4'] }] },
      { name: 'Tipo', models: [{ name: 'Tipo', years: [2016,2017,2018,2019,2020,2021], variants: ['Easy','Street','Lounge','Sport'] }] },
    ]
  },
  {
    name: 'Volkswagen',
    series: [
      { name: 'Golf', models: [{ name: 'Golf', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Trendline','Comfortline','Highline','R-Line','GTI','R'] }] },
      { name: 'Passat', models: [{ name: 'Passat', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Trendline','Comfortline','Highline','Elegance','R-Line'] }] },
      { name: 'Tiguan', models: [{ name: 'Tiguan', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Trendline','Comfortline','Highline','R-Line'] }] },
      { name: 'Polo', models: [{ name: 'Polo', years: [2015,2016,2017,2018,2019,2020,2021,2022], variants: ['Trendline','Comfortline','Highline','GTI'] }] },
      { name: 'T-Roc', models: [{ name: 'T-Roc', years: [2018,2019,2020,2021,2022,2023,2024], variants: ['Life','Style','R-Line','R'] }] },
    ]
  },
  {
    name: 'Toyota',
    series: [
      { name: 'Corolla', models: [{ name: 'Corolla', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Touch','Feel','Flame','Hybrid'] }] },
      { name: 'Camry', models: [{ name: 'Camry', years: [2018,2019,2020,2021,2022,2023,2024], variants: ['Comfort','Elegance','F Sport'] }] },
      { name: 'RAV4', models: [{ name: 'RAV4', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['City','Style','Adventure','GR Sport'] }] },
      { name: 'C-HR', models: [{ name: 'C-HR', years: [2017,2018,2019,2020,2021,2022], variants: ['Touch','Feel','Flame'] }] },
      { name: 'Yaris', models: [{ name: 'Yaris', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023], variants: ['Life','Trend','Style'] }] },
    ]
  },
  {
    name: 'Hyundai',
    series: [
      { name: 'Tucson', models: [{ name: 'Tucson', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Prime','Style','Elite','N Line'] }] },
      { name: 'i20', models: [{ name: 'i20', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Jump','Mobilx','Elite','N Line'] }] },
      { name: 'i30', models: [{ name: 'i30', years: [2015,2016,2017,2018,2019,2020,2021,2022], variants: ['Mobilx','Elite','N Line','Fastback'] }] },
      { name: 'Kona', models: [{ name: 'Kona', years: [2018,2019,2020,2021,2022,2023,2024], variants: ['Jump','Mobilx','Elite','N Line'] }] },
    ]
  },
  {
    name: 'BMW',
    series: [
      { name: '3 Serisi', models: [{ name: '3 Serisi', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['318i','320i','320d','330i','330d','M340i'] }] },
      { name: '5 Serisi', models: [{ name: '5 Serisi', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['520i','520d','530i','530d','M550i'] }] },
      { name: 'X1', models: [{ name: 'X1', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['sDrive18i','xDrive18i','xDrive20i','xDrive25i'] }] },
      { name: 'X3', models: [{ name: 'X3', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['xDrive20i','xDrive20d','xDrive30i','M40i'] }] },
    ]
  },
  {
    name: 'Mercedes',
    series: [
      { name: 'C Serisi', models: [{ name: 'C Serisi', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['C180','C200','C220d','C300','AMG C43'] }] },
      { name: 'E Serisi', models: [{ name: 'E Serisi', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['E200','E220d','E300','E350d','AMG E53'] }] },
      { name: 'GLC', models: [{ name: 'GLC', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['GLC200','GLC220d','GLC300','AMG GLC43'] }] },
      { name: 'A Serisi', models: [{ name: 'A Serisi', years: [2016,2017,2018,2019,2020,2021,2022,2023], variants: ['A180','A200','A220','AMG A35'] }] },
    ]
  },
  {
    name: 'Ford',
    series: [
      { name: 'Focus', models: [{ name: 'Focus', years: [2015,2016,2017,2018,2019,2020,2021,2022], variants: ['Trend','Titanium','ST-Line','ST','RS'] }] },
      { name: 'Kuga', models: [{ name: 'Kuga', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Trend','Titanium','ST-Line','Vignale'] }] },
      { name: 'Puma', models: [{ name: 'Puma', years: [2020,2021,2022,2023,2024], variants: ['Trend','Titanium','ST-Line','ST'] }] },
    ]
  },
  {
    name: 'Kia',
    series: [
      { name: 'Sportage', models: [{ name: 'Sportage', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Mystic','Active','Platinum','GT-Line'] }] },
      { name: 'Ceed', models: [{ name: 'Ceed', years: [2016,2017,2018,2019,2020,2021,2022,2023], variants: ['Attraction','Vision','Spirit','GT-Line'] }] },
      { name: 'Stonic', models: [{ name: 'Stonic', years: [2018,2019,2020,2021,2022,2023,2024], variants: ['Attraction','Vision','Spirit'] }] },
    ]
  },
  {
    name: 'Skoda',
    series: [
      { name: 'Octavia', models: [{ name: 'Octavia', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Ambition','Style','Sportline','RS'] }] },
      { name: 'Superb', models: [{ name: 'Superb', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023], variants: ['Ambition','Style','Sportline','Laurin & Klement'] }] },
      { name: 'Kodiaq', models: [{ name: 'Kodiaq', years: [2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Ambition','Style','Sportline','RS'] }] },
    ]
  },
  {
    name: 'Honda',
    series: [
      { name: 'Civic', models: [{ name: 'Civic', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Elegance','Executive','Type R'] }] },
      { name: 'CR-V', models: [{ name: 'CR-V', years: [2016,2017,2018,2019,2020,2021,2022,2023], variants: ['Elegance','Executive'] }] },
    ]
  },
  {
    name: 'Peugeot',
    series: [
      { name: '3008', models: [{ name: '3008', years: [2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Allure','GT Line','GT'] }] },
      { name: '2008', models: [{ name: '2008', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Allure','GT Line','GT'] }] },
      { name: '308', models: [{ name: '308', years: [2015,2016,2017,2018,2019,2020,2021,2022], variants: ['Access','Allure','GT Line'] }] },
    ]
  },
  {
    name: 'Citroen',
    series: [
      { name: 'C4', models: [{ name: 'C4', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Feel','Shine','Business'] }] },
      { name: 'C3', models: [{ name: 'C3', years: [2016,2017,2018,2019,2020,2021,2022,2023], variants: ['Live','Feel','Shine'] }] },
      { name: 'C5 Aircross', models: [{ name: 'C5 Aircross', years: [2019,2020,2021,2022,2023,2024], variants: ['Feel','Shine','Business'] }] },
    ]
  },
  {
    name: 'Volvo',
    series: [
      { name: 'XC40', models: [{ name: 'XC40', years: [2018,2019,2020,2021,2022,2023,2024], variants: ['Momentum','Inscription','R-Design'] }] },
      { name: 'XC60', models: [{ name: 'XC60', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Momentum','Inscription','R-Design'] }] },
    ]
  },
  {
    name: 'Audi',
    series: [
      { name: 'A3', models: [{ name: 'A3', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['30 TFSI','35 TFSI','40 TFSI','S3'] }] },
      { name: 'A4', models: [{ name: 'A4', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023], variants: ['30 TFSI','35 TDI','40 TFSI','45 TDI'] }] },
      { name: 'Q5', models: [{ name: 'Q5', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['35 TDI','40 TFSI','45 TDI','SQ5'] }] },
    ]
  },
  {
    name: 'Dacia',
    series: [
      { name: 'Duster', models: [{ name: 'Duster', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Essential','Expression','Journey','Extreme'] }] },
      { name: 'Sandero', models: [{ name: 'Sandero', years: [2016,2017,2018,2019,2020,2021,2022,2023], variants: ['Essential','Expression','Stepway'] }] },
    ]
  },
  {
    name: 'Opel',
    series: [
      { name: 'Astra', models: [{ name: 'Astra', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Edition','Elegance','GS Line','Ultimate'] }] },
      { name: 'Corsa', models: [{ name: 'Corsa', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Edition','Elegance','GS Line'] }] },
      { name: 'Mokka', models: [{ name: 'Mokka', years: [2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Edition','Elegance','GS Line','Ultimate'] }] },
    ]
  },
  {
    name: 'Seat',
    series: [
      { name: 'Leon', models: [{ name: 'Leon', years: [2015,2016,2017,2018,2019,2020,2021,2022,2023], variants: ['Style','FR','Xcellence'] }] },
      { name: 'Ateca', models: [{ name: 'Ateca', years: [2017,2018,2019,2020,2021,2022,2023], variants: ['Style','FR','Xcellence'] }] },
    ]
  },
  {
    name: 'Nissan',
    series: [
      { name: 'Qashqai', models: [{ name: 'Qashqai', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Visia','N-Connecta','Tekna','N-Style'] }] },
      { name: 'Juke', models: [{ name: 'Juke', years: [2016,2017,2018,2019,2020,2021,2022,2023], variants: ['Visia','N-Connecta','Tekna'] }] },
    ]
  },
  {
    name: 'Mazda',
    series: [
      { name: 'CX-5', models: [{ name: 'CX-5', years: [2016,2017,2018,2019,2020,2021,2022,2023], variants: ['Touch','Prime','Exclusive','Homura'] }] },
      { name: '3', models: [{ name: '3', years: [2016,2017,2018,2019,2020,2021,2022,2023], variants: ['Touch','Prime','Exclusive'] }] },
    ]
  },
  {
    name: 'Suzuki',
    series: [
      { name: 'Vitara', models: [{ name: 'Vitara', years: [2016,2017,2018,2019,2020,2021,2022,2023], variants: ['GA','GL','GLX','S'] }] },
      { name: 'Swift', models: [{ name: 'Swift', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Lite','Select','Premium','Sport'] }] },
    ]
  },
  {
    name: 'Jeep',
    series: [
      { name: 'Compass', models: [{ name: 'Compass', years: [2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Sport','Longitude','Limited','Trailhawk'] }] },
      { name: 'Renegade', models: [{ name: 'Renegade', years: [2016,2017,2018,2019,2020,2021,2022], variants: ['Sport','Longitude','Limited','Trailhawk'] }] },
    ]
  },
  {
    name: 'Tesla',
    series: [
      { name: 'Model 3', models: [{ name: 'Model 3', years: [2019,2020,2021,2022,2023,2024], variants: ['Standard Range','Long Range','Performance'] }] },
      { name: 'Model Y', models: [{ name: 'Model Y', years: [2020,2021,2022,2023,2024], variants: ['Standard Range','Long Range','Performance'] }] },
    ]
  },
  {
    name: 'Mini',
    series: [
      { name: 'Cooper', models: [{ name: 'Cooper', years: [2016,2017,2018,2019,2020,2021,2022,2023], variants: ['One','Cooper','Cooper S','JCW'] }] },
    ]
  },
  {
    name: 'Subaru',
    series: [
      { name: 'Impreza', models: [{ name: 'Impreza', years: [2016,2017,2018,2019,2020,2021,2022], variants: ['Base','Sport','WRX','STI'] }] },
      { name: 'Forester', models: [{ name: 'Forester', years: [2016,2017,2018,2019,2020,2021,2022,2023], variants: ['Base','Premium','Sport','Touring'] }] },
    ]
  },
  {
    name: 'Land Rover',
    series: [
      { name: 'Range Rover Evoque', models: [{ name: 'Range Rover Evoque', years: [2016,2017,2018,2019,2020,2021,2022,2023], variants: ['S','SE','HSE','R-Dynamic'] }] },
      { name: 'Discovery Sport', models: [{ name: 'Discovery Sport', years: [2016,2017,2018,2019,2020,2021,2022], variants: ['S','SE','HSE','R-Dynamic'] }] },
    ]
  },
  {
    name: 'Porsche',
    series: [
      { name: 'Macan', models: [{ name: 'Macan', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['Macan','Macan S','Macan GTS','Macan Turbo'] }] },
    ]
  },
  {
    name: 'Lexus',
    series: [
      { name: 'RX', models: [{ name: 'RX', years: [2016,2017,2018,2019,2020,2021,2022,2023,2024], variants: ['RX 300','RX 350','RX 450h','F Sport'] }] },
      { name: 'ES', models: [{ name: 'ES', years: [2019,2020,2021,2022,2023,2024], variants: ['ES 200','ES 250','ES 300h','F Sport'] }] },
    ]
  },
  {
    name: 'Infiniti',
    series: [
      { name: 'Q50', models: [{ name: 'Q50', years: [2016,2017,2018,2019,2020], variants: ['2.0t','3.0t','Red Sport 400'] }] },
    ]
  },
  {
    name: 'Alfa Romeo',
    series: [
      { name: 'Giulia', models: [{ name: 'Giulia', years: [2017,2018,2019,2020,2021,2022,2023], variants: ['Super','Sprint','Veloce','Quadrifoglio'] }] },
      { name: 'Stelvio', models: [{ name: 'Stelvio', years: [2018,2019,2020,2021,2022,2023], variants: ['Super','Sprint','Veloce','Quadrifoglio'] }] },
    ]
  },
]

/** Tüm marka isimlerini getir */
export function getBrands(): string[] {
  return CAR_CATALOG.map(b => b.name)
}

/** Bir markanın serilerini getir */
export function getSeries(brand: string): string[] {
  const b = CAR_CATALOG.find(x => x.name === brand)
  return b ? b.series.map(s => s.name) : []
}

/** Bir serinin modellerini getir */
export function getModels(brand: string, seriesName: string): string[] {
  const b = CAR_CATALOG.find(x => x.name === brand)
  if (!b) return []
  const s = b.series.find(x => x.name === seriesName)
  return s ? s.models.map(m => m.name) : []
}

/** Bir modelin yıllarını getir */
export function getYears(brand: string, seriesName: string, modelName: string): number[] {
  const b = CAR_CATALOG.find(x => x.name === brand)
  if (!b) return []
  const s = b.series.find(x => x.name === seriesName)
  if (!s) return []
  const m = s.models.find(x => x.name === modelName)
  return m ? m.years : []
}

/** Bir modelin versiyonlarını getir */
export function getVariants(brand: string, seriesName: string, modelName: string): string[] {
  const b = CAR_CATALOG.find(x => x.name === brand)
  if (!b) return []
  const s = b.series.find(x => x.name === seriesName)
  if (!s) return []
  const m = s.models.find(x => x.name === modelName)
  return m ? m.variants : []
}
