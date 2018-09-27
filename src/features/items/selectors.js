export const calculateGemName = (providedGrade, providedTokenId) => {
    const gemType = {
      9: "Sapphire",
      10: "Opal",
      1: "Garnet",
      2: "Amethyst"
    }[providedGrade];
    return `${gemType} #${providedTokenId}`;
  };


  export const temp = () => console.log('temp')
