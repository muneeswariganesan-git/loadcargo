export const PRODUCT_CONFIG = [
    { keypad: 'F1', location: 'LHR', service: 'General', route: 'general' },
    { keypad: 'F2', location: 'LHR', service: 'Courier', route: 'courier' },
    { keypad: 'F3', location: 'LHR', service: 'Prioritise', route: 'prioritise' },
    { keypad: 'F4', location: 'LHR', service: 'Mail', route: 'mail' },
    { keypad: '', location: '', service: '' }, 
    { keypad: 'F6', location: '', service: 'USA & Canada', route: 'usa-and-canada' },
    { keypad: '', location: '', service: '' }, 
    { keypad: '', location: '', service: '' }, 
    { keypad: '', location: '', service: '' }, 
    { keypad: 'F10', location: '', service: 'ULD Logistics', route: 'uld-logistics' },
    { keypad: '', location: '', service: '' }, 
    { keypad: '', location: '', service: '' }, 
  ];
  
  export 
  const CODE_MAP = {
    cargo: 'C',
    courier: 'Q-EHO',
    prioritise: 'P',
    mail: 'L',
    baggage: 'B',
    equipment: 'E',
    other: 'O',
    empties: 'X',
  } as const;
  
  