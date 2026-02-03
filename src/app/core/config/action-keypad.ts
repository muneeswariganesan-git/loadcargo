export const PRODUCT_ACTION_MAP: Record<string, { key: string; label: string }[]> = {
    General: [
      { key: 'F1', label: 'View Ownership' },
      { key: 'F2', label: 'Select Flight' },
      { key: 'F3', label: 'View Flight Information' },
      { key: 'F4', label: 'Anomalies' },
      { key: 'F5', label: 'Deadload' },
      { key: 'F6', label: 'Dangerous Goods' },
      { key: 'F7', label: 'Special Load' },
      { key: 'F8', label: 'Cargo Release' },
      { key: 'F9', label: 'Flight List' },
      { key: 'F10', label: 'Change Fitment' },
      { key: 'F11', label: 'Home' },
      { key: '', label: '' },
    
    ],
    Courier: [
        { key: 'F1', label: 'View Ownership' },
        { key: 'F2', label: 'Select Flight' },
        { key: 'F3', label: 'View Flight Information' },
        { key: 'F4', label: 'Anomalies' },
        { key: 'F5', label: 'Deadload' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: 'F9', label: 'Flight List' },
        { key: '', label: '' },
        { key: 'F11', label: 'Home' },
        { key: '', label: '' },
       
      ],
      Prioritise: [
        { key: 'F1', label: 'View Ownership' },
        { key: 'F2', label: 'Select Flight' },
        { key: 'F3', label: 'View Flight Information' },
        { key: 'F4', label: 'Anomalies' },
        { key: 'F5', label: 'Deadload' },
        { key: 'F6', label: 'Dangerous Goods'},
        { key: 'F7', label: 'Special Load' },
        { key: '', label: '' },
        { key: 'F9', label: 'Flight List' },
        { key: '', label: '' },
        { key: 'F11', label: 'Home' },
        { key: '', label: '' },
      
      ],
    Mail: [
      { key: 'F1', label: 'View Ownership' },
      { key: 'F2', label: 'Select Flight' },
      { key: 'F3', label: 'View Flight Information' },
      { key: 'F4', label: 'Anomalies' },
      { key: 'F5', label: 'Deadload' },
      { key: 'F6', label: 'Send Mail Telex' },
      { key: '', label: '' },
      { key: '', label: '' },
      { key: 'F9', label: 'Flight List' },
      { key: '', label: '' },
      { key: 'F11', label: 'Home' },
      { key: '', label: '' },
      
    ],
  
    UsaCanada: [
      { key: '', label: '' },
      { key: 'F2', label: 'Select Flight' },
      { key: 'F3', label: 'View Flight Information' },
      { key: 'F4', label: 'Anomalies' },
      { key: 'F5', label: 'Deadload' },
      { key: 'F6', label: 'Dangerous Goods' },
      { key: 'F7', label: 'Special Load' },
      { key: 'F8', label: 'Cargo Release' },
      { key: 'F9', label: 'Flight List' },
      { key: 'F10', label: 'Change Fitment' },
      { key: 'F11', label: 'Home' },
      { key: '', label: '' },
      
    ],
  
    UldLogistics : [
      { key: '', label: '' },
      { key: 'F2', label: 'Select Flight' },
      { key: 'F3', label: 'View Flight Information' },
      { key: '', label: '' },
      { key: 'F5', label: 'Add Do not Reconfig. Flag' },
      { key: 'F6', label: 'Add Full Fitment Flag' },
      { key: '', label: '' },
      { key: '', label: '' },
      { key: 'F9', label: 'Flight List' },
      { key: '', label: '' },
      { key: 'F11', label: 'Home' },
      { key: '', label: '' },
    ]
    
  };
  
  
  export const CTRL_ACTION_MAP: { key: string; label: string }[] = [
  { key: 'F1', label: 'Flight Documents' },
  { key: 'F2', label: 'Send Message' },
  { key: 'F3', label: 'Pax Summary' },
  { key: 'F4', label: 'Air Waybills' },
  { key: 'F5', label: 'Contacts' },
  { key: '', label: '' },
  { key: 'F7', label: 'Create Ownership' },
  { key: 'F8', label: 'Cargo Activities' },
  { key: '', label: '' },
  { key: '', label: '' },
  { key: 'F11', label: 'Home' },
  { key: '', label: '' },
  ];
  
  
  
  
  export const PRODUCT_ACTION_MAP_VARIANT: Record<
    string,
    { key: string; label: string }[]
  > = {
    // USA & Canada when reg is Truck or Freighters
    UsaCanada_Truck: [
      { key: '', label: '' },
      { key: 'F2', label: 'Select Flight' },
      { key: 'F3', label: 'View Flight Information' },
      { key: 'F4', label: 'Anomalies' },
      { key: 'F5', label: 'Deadload' },
      { key: '', label: '' },
      { key: '', label: '' },
      { key: '', label: '' },
      { key: 'F9', label: 'Flight List' },
      { key: 'F10', label: 'Change Fitment' },
      { key: 'F11', label: 'Home' },
      { key: '', label: '' },
    ],
    UsaCanada_Freighters: [
      { key: '', label: '' },
      { key: 'F2', label: 'Select Flight' },
      { key: 'F3', label: 'View Flight Information' },
      { key: 'F4', label: 'Anomalies' },
      { key: 'F5', label: 'Deadload' },
      { key: '', label: '' },
      { key: '', label: '' },
      { key: '', label: '' },
      { key: 'F9', label: 'Flight List' },
      { key: 'F10', label: 'Change Fitment' },
      { key: 'F11', label: 'Home' },
      { key: '', label: '' },
    ],
  
    
    General_Truck: [
      { key: 'F1', label: 'View Ownership' },
      { key: 'F2', label: 'Select Flight' },
      { key: 'F3', label: 'View Flight Information' },
      { key: 'F4', label: 'Anomalies' },
      { key: 'F5', label: 'Deadload' },
      { key: '', label: '' },
      { key: '', label: '' },
      { key: '', label: '' },
      { key: 'F9', label: 'Flight List' },
      { key: 'F10', label: 'Change Fitment' },
      { key: 'F11', label: 'Home' },
      { key: '', label: '' },
    ],
    General_Freighters: [
      { key: 'F1', label: 'View Ownership' },
      { key: 'F2', label: 'Select Flight' },
      { key: 'F3', label: 'View Flight Information' },
      { key: 'F4', label: 'Anomalies' },
      { key: 'F5', label: 'Deadload' },
      { key: '', label: '' },
      { key: '', label: '' },
      { key: '', label: '' },
      { key: 'F9', label: 'Flight List' },
      { key: 'F10', label: 'Change Fitment' },
      { key: 'F11', label: 'Home' },
      { key: '', label: '' },
     ],
    }
  
  export const ACTIONS_PRODUCT_ALWAYS_SKIP = new Set(['F1', 'F9']);