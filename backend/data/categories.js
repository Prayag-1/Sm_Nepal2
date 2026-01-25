const categories = [
  { name: 'Surgical Instruments' },
  { name: 'Diagnostics' },
  { name: 'Consumables' },
  { name: 'Rehabilitation' },
  { name: 'Protective Gear' },
  { name: 'Sutures & Wound Care', parentName: 'Surgical Instruments' },
  { name: 'Sterilization', parentName: 'Surgical Instruments' },
  { name: 'Monitoring', parentName: 'Diagnostics' },
  { name: 'Mobility Aids', parentName: 'Rehabilitation' },
  { name: 'Disposables', parentName: 'Consumables' },
  { name: 'Masks & Gloves', parentName: 'Protective Gear' },
];

export default categories;
