type Variant = 'Padrão' | 'Promocional' | 'Holográfica';

export const isVariant = (x: any): x is Variant =>
  ['Padrão', 'Promocional', 'Holográfica'].includes(x);

export default Variant;
