export const gradeConverter = gradeValue => ({
    1: 'D',
    2: 'C',
    3: 'B',
    4: 'A',
    5: 'AA',
    6: 'AAA',
}[gradeValue]);

export const gradePaneColors = (gradeValue) => ({
    1: "#2292EF",
    2: "#0571C9",
    3: "#006AB2",
    4: "#005D91",
    5: "#004F72",
    6: "#004056",
}[gradeValue]);

export const levelPaneColors = (level) => ({
    1: "#C97128",
    2: "#B25B1B",
    3: "#914714",
    4: "#68310C",
    5: "#492106",
}[level]);

export const typePaneColors = (typeColor) => ({
    1: '#EF2318',
    2: '#8312DB',
    3: '#2085B7',
    4: '#84837C',
    5: '#138418',
    6: '#846F7C',
    7: '#A50C2D',
    8: '#709E15',
    9: '#0B3E99',
    10: '#1C938D',
    11: '#B59718',
    12: '#12979E',
}[typeColor]);

export const typePaneOutlineColors = (typeColor) => ({
    1: '#F29886',
    2: '#C98CF1',
    3: '#83C3ED',
    4: '#F0EFE2',
    5: '#8DE5A2',
    6: '#E5C1D6',
    7: '#FC7E9F',
    8: '#D0FF8D',
    9: '#7290DB',
    10: '#81F7F4',
    11: '#FFEA94',
    12: '#64F4F0',
}[typeColor]);

export const levelOutlineColor = "#FDC88F";
export const gradeOutlineColor = "#98C7FF";
export const mrbOutlineColor = "#BE79DB";
export const mrbPaneColor = "#432056";
export const energyPaneColor = "#1D513E";
export const energyOutlineColor = "#71CCAE";

export const type = (color) => ({
    1: 'Gar',
    2: 'Ame',
    3: 'Aqu',
    4: 'Dia',
    5: 'Eme',
    6: 'Pea',
    7: 'Rub',
    8: 'Per',
    9: 'Sap',
    10: 'Opa',
    11: 'Top',
    12: 'Tur',
}[color]);

