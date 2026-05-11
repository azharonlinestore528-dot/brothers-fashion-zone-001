export const SIZE_CONFIG = {
  clothing: {
    label: 'Clothing',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    guide: {
      headers: ['Size', 'Chest (in)', 'Length (in)', 'Shoulder (in)'],
      rows: [
        ['XS', '36', '26', '16'],
        ['S', '38', '27', '17'],
        ['M', '40', '28', '18'],
        ['L', '42', '29', '19'],
        ['XL', '44', '30', '20'],
        ['XXL', '46', '31', '21'],
        ['XXXL', '48', '32', '22'],
      ],
    },
  },
  footwear: {
    label: 'Footwear',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    guide: {
      headers: ['UK Size', 'EU Size', 'Foot Length (cm)'],
      rows: [
        ['UK 6', 'EU 40', '24.5'],
        ['UK 7', 'EU 41', '25.5'],
        ['UK 8', 'EU 42', '26.5'],
        ['UK 9', 'EU 43', '27.5'],
        ['UK 10', 'EU 44', '28.5'],
        ['UK 11', 'EU 45', '29.5'],
      ],
    },
  },
  watches: {
    label: 'Watches',
    sizes: ['Free Size'],
    guide: {
      headers: ['Size', 'Case Diameter (mm)', 'Strap Width (mm)'],
      rows: [
        ['Free Size', '38-44', '18-22'],
      ],
    },
  },
  bags: {
    label: 'Bags',
    sizes: ['Free Size', 'Small', 'Medium', 'Large'],
    guide: {
      headers: ['Size', 'Dimensions (HxWxD)', 'Capacity'],
      rows: [
        ['Small', '20x15x8', '2L'],
        ['Medium', '30x25x12', '8L'],
        ['Large', '40x30x15', '18L'],
        ['Free Size', 'Standard', 'Variable'],
      ],
    },
  },
  accessories: {
    label: 'Accessories',
    sizes: ['Free Size'],
    guide: {
      headers: ['Size', 'Dimension', 'Adjustable'],
      rows: [
        ['Free Size', 'Standard', 'Yes'],
      ],
    },
  },
};

export const SIZE_GUIDE: Record<string, {
  title: string;
  description: string;
  tips: string[];
  table: {
    headers: string[];
    rows: Array<Record<string, string>>;
  };
}> = {
  clothing: {
    title: 'Clothing Size Guide',
    description: 'Measure yourself and compare with the chart below for the perfect fit.',
    tips: [
      'Measure your chest around the fullest part, keeping the tape horizontal.',
      'For a relaxed fit, size up.',
      'When in doubt, check the garment measurements in the details section.',
    ],
    table: {
      headers: ['Size', 'Chest (in)', 'Length (in)', 'Shoulder (in)'],
      rows: [
        { size: 'XS', chest: '36', length: '26', shoulder: '16' },
        { size: 'S', chest: '38', length: '27', shoulder: '17' },
        { size: 'M', chest: '40', length: '28', shoulder: '18' },
        { size: 'L', chest: '42', length: '29', shoulder: '19' },
        { size: 'XL', chest: '44', length: '30', shoulder: '20' },
        { size: 'XXL', chest: '46', length: '31', shoulder: '21' },
        { size: 'XXXL', chest: '48', length: '32', shoulder: '22' },
      ],
    },
  },
  footwear: {
    title: 'Footwear Size Guide',
    description: 'Find your perfect fit using our footwear size conversion chart.',
    tips: [
      'Measure your foot length from heel to toe.',
      'For ethnic footwear, consider wearing with socks or traditional footwears.',
      'Indian footwear often runs smaller than international brands.',
    ],
    table: {
      headers: ['UK Size', 'EU Size', 'Foot Length (cm)'],
      rows: [
        { size: 'UK 6', eu: '40', length: '24.5' },
        { size: 'UK 7', eu: '41', length: '25.5' },
        { size: 'UK 8', eu: '42', length: '26.5' },
        { size: 'UK 9', eu: '43', length: '27.5' },
        { size: 'UK 10', eu: '44', length: '28.5' },
        { size: 'UK 11', eu: '45', length: '29.5' },
      ],
    },
  },
};

export function resolveSizeCategory(category: string): 'clothing' | 'footwear' {
  const cat = category.toLowerCase();
  
  if (['men', 'women', 'kids', 'kurtas', 'sherwani', 'blazers', 'dhotis', 'pajamas', 'sarees', 'lehengas', 'blouses', 'kurtis', 'palazzos', 'watches', 'bags', 'accessories', 'footwear', 'mojaris', 'sandals', 'kolhapuri', 'juttis', 'sneakers'].includes(cat)) {
    if (['footwear', 'mojaris', 'sandals', 'kolhapuri', 'juttis', 'sneakers'].includes(cat)) {
      return 'footwear';
    }
    return 'clothing';
  }
  
  return 'clothing';
}

export function getSizeGuide(category: string) {
  const configKey = resolveSizeCategory(category);
  return SIZE_GUIDE[configKey] || SIZE_GUIDE.clothing;
}
