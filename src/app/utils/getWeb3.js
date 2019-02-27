const Web3 = require('web3');

const getWeb3 = new Promise((resolve, reject) => {
  window.addEventListener('load', async () => {
    let results;
    let { web3 } = window;
    const { ethereum } = window;
    // Modern dapp browsers...
    if (ethereum) {
      web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        results = {
          web3,
        };
        resolve(results);
      } catch (error) {
        console.error('error in getWeb3.js', error);
        // store.dispatch(setError(error));
      }
    } else if (window.web3) {
      // Legacy dapp browsers...
      web3 = new Web3(web3.currentProvider);
      results = {
        web3,
      };

      resolve(results);
    } else {
      console.error('Non-Ethereum browser detected. You should consider trying MetaMask!');
      const web3 = new Web3(process.env.REACT_APP_INFURA_URL);
      if (web3) {
          resolve({web3});
      } else {
          reject(new Error('Non-Ethereum browser detected'));
          throw 'Non-Ethereum browser detected';
      }
        // Non-dapp browsers...
    }
  });
});

export default getWeb3;
