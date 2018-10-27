export const calculateGemName = (providedGrade, providedTokenId) => {
  const gemType = {
    1: 'Garnet',
    2: 'Amethyst',

    3: 'Aquamarine',
    4: 'Diamond',
    5: 'Emerald',
    6: 'Pearl',

    7: 'Ruby',
    8: 'Peridot',

    9: 'Sapphire',
    10: 'Opal',

    11: 'Topaz',
    12: 'Turquoise',
  }[providedGrade];
  return gemType && providedTokenId ? `${gemType} #${providedTokenId}` : 'Loading...';
};

export const TEMP = (market, gemId) => market.find(gem => Number(gem.gemId) === Number(gemId));
