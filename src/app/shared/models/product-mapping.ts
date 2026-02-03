
// product-utils.ts
export const ProductCodeMap: Record<string, string> = {
    general: 'MM',
    courier: 'RR',
    prioritise: 'FF',
    mail: 'NN',
    'usa-and-canada': 'AA',
    pharma: 'PP'
  };
  
  export const CommodityCodeMap: Record<string, string[]> = {
    general: ['C', 'L'],
    courier: ['R'],
    prioritise: ['X', 'E'],
    mail: ['M'],
    'usa-and-canada': ['A'],
    pharma: ['P']
  };
  
  export function getProductCode(product: string): string {
    const normalized = (product || '').toLowerCase();
    return ProductCodeMap[normalized] ?? 'MM'; 
  }
  
  export function getCommodityCodes(product: string): string[] {
    const normalized = (product || '').toLowerCase();
    return CommodityCodeMap[normalized] ?? []; 
  }
  