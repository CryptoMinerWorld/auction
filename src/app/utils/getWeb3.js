
const Web3 = require('web3');

const getWeb3 = new Promise((resolve) => {
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
      }
    } else if (window.web3) {
      // Legacy dapp browsers...
      web3 = new Web3(web3.currentProvider);
      results = {
        web3,
      };

      resolve(results);
    } else {
      // Non-dapp browsers...
      console.error('Non-Ethereum browser detected. You should consider trying MetaMask!');
     
    }
  });
});

export default getWeb3;
