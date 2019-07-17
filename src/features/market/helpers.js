import {db, storage} from '../../app/utils/firebase';

export const updateDBwithNewPrice = auctionId => db
  .collection('stones')
  .where('id', '==', auctionId)
  .get()
  .then((coll) => {
    const gemId = coll.docs.map(doc => doc.id);
    return gemId[0];
  });

export const getGemImage = async (color, grade, level, gemId) => {
  const type = {
    9: 'Sap',
    10: 'Opa',
    1: 'Gar',
    2: 'Ame',
  }[color];

  const gradeType = {
    1: 'D',
    2: 'C',
    3: 'B',
    4: 'A',
    5: 'AA',
    6: 'AAA',
  }[grade];

  // check if any special images are present for gem
  // if no - use type-level-grade formula
  //const sourceImage = `${type}-${level}-${gradeType}-4500.png`;

    if (color && grade && level) {
        let url;
        try {
            const doc = await db
              .doc(`specialStones/${gemId}`)
              .get();

            try {
                url = await (storage.ref(`gems512/${doc.data().imageName}-${level}-${gradeType}.png`).getDownloadURL());
            }
            catch (e) {
                url = await (storage.ref(`gems512/${doc.data().imageName}.png`).getDownloadURL());
            }
        }
        catch (err) {
            try {
                url = await (storage.ref(`gems512/${type}-${level}-${gradeType}-4500.png`).getDownloadURL())
            }
            catch(e) {
                url = await (storage.ref(`gems512/specialOneImage.png`).getDownloadURL())
            }
        }

        return url;
    }


};

export const calculatePercentage = (min, max, current) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  100 - ((current - min) / (max - min)) * 100;

export const weiToEth = wei => Number((wei / 1000000000000000000));
export const GWeiToEth = GWei => Number((GWei / 1000000000));

export const gradeConverter = gradeValue => ({
  1: 'D',
  2: 'C',
  3: 'B',
  4: 'A',
  5: 'AA',
  6: 'AAA',
}[gradeValue]);
