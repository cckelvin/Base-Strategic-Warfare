export interface CountryFlag {
  code: string;
  name: string;
  flagUrl: string;
}

export const COUNTRIES: CountryFlag[] = [
  // North & Central America
  { code: 'US', name: 'United States', flagUrl: 'https://flagcdn.com/w80/us.png' },
  { code: 'CA', name: 'Canada', flagUrl: 'https://flagcdn.com/w80/ca.png' },
  { code: 'MX', name: 'Mexico', flagUrl: 'https://flagcdn.com/w80/mx.png' },
  { code: 'CU', name: 'Cuba', flagUrl: 'https://flagcdn.com/w80/cu.png' },
  { code: 'PA', name: 'Panama', flagUrl: 'https://flagcdn.com/w80/pa.png' },

  // South America
  { code: 'BR', name: 'Brazil', flagUrl: 'https://flagcdn.com/w80/br.png' },
  { code: 'AR', name: 'Argentina', flagUrl: 'https://flagcdn.com/w80/ar.png' },
  { code: 'CO', name: 'Colombia', flagUrl: 'https://flagcdn.com/w80/co.png' },
  { code: 'CL', name: 'Chile', flagUrl: 'https://flagcdn.com/w80/cl.png' },
  { code: 'PE', name: 'Peru', flagUrl: 'https://flagcdn.com/w80/pe.png' },
  { code: 'VE', name: 'Venezuela', flagUrl: 'https://flagcdn.com/w80/ve.png' },

  // Europe
  { code: 'GB', name: 'United Kingdom', flagUrl: 'https://flagcdn.com/w80/gb.png' },
  { code: 'FR', name: 'France', flagUrl: 'https://flagcdn.com/w80/fr.png' },
  { code: 'DE', name: 'Germany', flagUrl: 'https://flagcdn.com/w80/de.png' },
  { code: 'IT', name: 'Italy', flagUrl: 'https://flagcdn.com/w80/it.png' },
  { code: 'ES', name: 'Spain', flagUrl: 'https://flagcdn.com/w80/es.png' },
  { code: 'UA', name: 'Ukraine', flagUrl: 'https://flagcdn.com/w80/ua.png' },
  { code: 'PL', name: 'Poland', flagUrl: 'https://flagcdn.com/w80/pl.png' },
  { code: 'NL', name: 'Netherlands', flagUrl: 'https://flagcdn.com/w80/nl.png' },
  { code: 'SE', name: 'Sweden', flagUrl: 'https://flagcdn.com/w80/se.png' },
  { code: 'NO', name: 'Norway', flagUrl: 'https://flagcdn.com/w80/no.png' },
  { code: 'FI', name: 'Finland', flagUrl: 'https://flagcdn.com/w80/fi.png' },
  { code: 'CH', name: 'Switzerland', flagUrl: 'https://flagcdn.com/w80/ch.png' },
  { code: 'GR', name: 'Greece', flagUrl: 'https://flagcdn.com/w80/gr.png' },
  { code: 'PT', name: 'Portugal', flagUrl: 'https://flagcdn.com/w80/pt.png' },
  { code: 'RO', name: 'Romania', flagUrl: 'https://flagcdn.com/w80/ro.png' },
  { code: 'BE', name: 'Belgium', flagUrl: 'https://flagcdn.com/w80/be.png' },
  { code: 'AT', name: 'Austria', flagUrl: 'https://flagcdn.com/w80/at.png' },
  { code: 'CZ', name: 'Czech Republic', flagUrl: 'https://flagcdn.com/w80/cz.png' },

  // Eurasia & Middle East
  { code: 'RU', name: 'Russia', flagUrl: 'https://flagcdn.com/w80/ru.png' },
  { code: 'TR', name: 'Turkey', flagUrl: 'https://flagcdn.com/w80/tr.png' },
  { code: 'IL', name: 'Israel', flagUrl: 'https://flagcdn.com/w80/il.png' },
  { code: 'SA', name: 'Saudi Arabia', flagUrl: 'https://flagcdn.com/w80/sa.png' },
  { code: 'IR', name: 'Iran', flagUrl: 'https://flagcdn.com/w80/ir.png' },
  { code: 'AE', name: 'United Arab Emirates', flagUrl: 'https://flagcdn.com/w80/ae.png' },
  { code: 'QA', name: 'Qatar', flagUrl: 'https://flagcdn.com/w80/qa.png' },
  { code: 'IQ', name: 'Iraq', flagUrl: 'https://flagcdn.com/w80/iq.png' },
  { code: 'KZ', name: 'Kazakhstan', flagUrl: 'https://flagcdn.com/w80/kz.png' },

  // Asia & Pacific
  { code: 'CN', name: 'China', flagUrl: 'https://flagcdn.com/w80/cn.png' },
  { code: 'JP', name: 'Japan', flagUrl: 'https://flagcdn.com/w80/jp.png' },
  { code: 'IN', name: 'India', flagUrl: 'https://flagcdn.com/w80/in.png' },
  { code: 'KR', name: 'South Korea', flagUrl: 'https://flagcdn.com/w80/kr.png' },
  { code: 'KP', name: 'North Korea', flagUrl: 'https://flagcdn.com/w80/kp.png' },
  { code: 'PK', name: 'Pakistan', flagUrl: 'https://flagcdn.com/w80/pk.png' },
  { code: 'ID', name: 'Indonesia', flagUrl: 'https://flagcdn.com/w80/id.png' },
  { code: 'VN', name: 'Vietnam', flagUrl: 'https://flagcdn.com/w80/vn.png' },
  { code: 'PH', name: 'Philippines', flagUrl: 'https://flagcdn.com/w80/ph.png' },
  { code: 'TH', name: 'Thailand', flagUrl: 'https://flagcdn.com/w80/th.png' },
  { code: 'SG', name: 'Singapore', flagUrl: 'https://flagcdn.com/w80/sg.png' },
  { code: 'MY', name: 'Malaysia', flagUrl: 'https://flagcdn.com/w80/my.png' },
  { code: 'TW', name: 'Taiwan', flagUrl: 'https://flagcdn.com/w80/tw.png' },
  { code: 'AU', name: 'Australia', flagUrl: 'https://flagcdn.com/w80/au.png' },
  { code: 'NZ', name: 'New Zealand', flagUrl: 'https://flagcdn.com/w80/nz.png' },

  // Africa
  { code: 'NG', name: 'Nigeria', flagUrl: 'https://flagcdn.com/w80/ng.png' },
  { code: 'ZA', name: 'South Africa', flagUrl: 'https://flagcdn.com/w80/za.png' },
  { code: 'EG', name: 'Egypt', flagUrl: 'https://flagcdn.com/w80/eg.png' },
  { code: 'DZ', name: 'Algeria', flagUrl: 'https://flagcdn.com/w80/dz.png' },
  { code: 'MA', name: 'Morocco', flagUrl: 'https://flagcdn.com/w80/ma.png' },
  { code: 'KE', name: 'Kenya', flagUrl: 'https://flagcdn.com/w80/ke.png' },
  { code: 'ET', name: 'Ethiopia', flagUrl: 'https://flagcdn.com/w80/et.png' },
  { code: 'GH', name: 'Ghana', flagUrl: 'https://flagcdn.com/w80/gh.png' },
];
