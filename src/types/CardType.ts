type CardType = 'Deus' | 'Terreno' | 'Anomalia' | 'Artefato';

export const isCardType = (x: any): x is CardType =>
  ['Deus', 'Terreno', 'Anomalia', 'Artefato'].includes(x);

export default CardType;
