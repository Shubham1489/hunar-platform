/**
 * Skill taxonomy categories for the platform.
 * Full taxonomy is maintained in the database (skills table).
 * This is the frontend-friendly category list for UI display.
 */
export const SkillCategories = {
  ELECTRICAL: {
    nameEn: 'Electrical',
    nameHi: 'इलेक्ट्रिकल',
    icon: '⚡',
    skills: ['Electrician', 'Wiring', 'Smart Home', 'Repairs', 'EV Charger', 'Solar Panel', 'Generator', 'UPS', 'Circuit Board', 'HVAC Electrical'],
  },
  PLUMBING: {
    nameEn: 'Plumbing',
    nameHi: 'प्लंबिंग',
    icon: '🔧',
    skills: ['Plumber', 'Pipe Fitting', 'Leakage Repair', 'Bath Fittings', 'Water Tank', 'Drainage', 'Water Purifier', 'Sewage'],
  },
  CARPENTRY: {
    nameEn: 'Carpentry',
    nameHi: 'बढ़ईगीरी',
    icon: '🪚',
    skills: ['Carpenter', 'Furniture', 'Cabinet Making', 'Wood Polish', 'Door Fitting', 'Modular Kitchen', 'Wardrobe'],
  },
  PAINTING: {
    nameEn: 'Painting',
    nameHi: 'पेंटिंग',
    icon: '🎨',
    skills: ['Painter', 'Wall Painting', 'Texture Paint', 'Waterproofing', 'POP Work', 'Distemper'],
  },
  AC_REPAIR: {
    nameEn: 'AC & Appliance Repair',
    nameHi: 'एसी और उपकरण मरम्मत',
    icon: '❄️',
    skills: ['AC Technician', 'Servicing', 'Gas Refill', 'Installation', 'Refrigerator Repair', 'Washing Machine Repair'],
  },
  CLEANING: {
    nameEn: 'Cleaning',
    nameHi: 'सफाई',
    icon: '🧹',
    skills: ['Deep Cleaning', 'Sofa Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning', 'Office Cleaning', 'Post-Construction Cleanup'],
  },
  CONSTRUCTION: {
    nameEn: 'Construction',
    nameHi: 'निर्माण',
    icon: '🏗️',
    skills: ['Mason', 'Tile Work', 'Concrete Work', 'Steel Fixer', 'Scaffolding', 'Demolition', 'Civil Work', 'Foreman'],
  },
  AUTOMOTIVE: {
    nameEn: 'Automotive',
    nameHi: 'ऑटोमोटिव',
    icon: '🚗',
    skills: ['Mechanic', 'Denting', 'Painting', 'Car Wash', 'Bike Repair', 'Tyre Fitting', 'Battery Service'],
  },
  COOKING: {
    nameEn: 'Cooking & Catering',
    nameHi: 'खाना बनाना',
    icon: '👨‍🍳',
    skills: ['Cook', 'Chef', 'Catering', 'Tiffin Service', 'Event Cooking', 'Bakery'],
  },
  HOUSEKEEPING: {
    nameEn: 'Housekeeping',
    nameHi: 'घर की देखभाल',
    icon: '🏠',
    skills: ['Maid', 'Nanny', 'Elder Care', 'Pet Care', 'Laundry', 'Ironing'],
  },
  SECURITY: {
    nameEn: 'Security',
    nameHi: 'सुरक्षा',
    icon: '🛡️',
    skills: ['Security Guard', 'CCTV Installation', 'Fire Safety', 'Bouncer', 'Night Watchman'],
  },
  DELIVERY: {
    nameEn: 'Delivery & Logistics',
    nameHi: 'डिलीवरी',
    icon: '📦',
    skills: ['Delivery Driver', 'Packer', 'Mover', 'Warehouse Helper', 'Loading/Unloading'],
  },
} as const;

export type SkillCategoryKey = keyof typeof SkillCategories;
