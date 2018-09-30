require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');
require('dotenv').config()

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '*'
    },
    ropsten: {
      provider() {
        return new HDWalletProvider(
          process.env.INFURA_RINKBY_MNEMONIC,
          `https://rinkeby.infura.io/${  process.env.INFURA_RINKBY_KEY}`
        );
      },
      network_id: '4'
    }
  }
};
