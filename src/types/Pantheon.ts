type Pantheon = 'Japonês' | 'Grego' | 'Nórdico';

export const isPantheon = (x: any): x is Pantheon =>
  ['Japonês', 'Grego', 'Nórdico'].includes(x);

export default Pantheon;
