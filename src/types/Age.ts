type Age = 'Cyberpunk' | 'Noir' | 'Pirata' | 'Steampunk' | 'Faroeste';

export const isAge = (x: any): x is Age =>
  ['Cyberpunk', 'Noir', 'Pirata', 'Steampunk', 'Faroeste'].includes(x);

export default Age;
