import React from 'react';
import { Container } from 'unstated';

class AppContainer extends Container {
  state = {
    web3: '',
    gemsContract: '',
    currentAccountId: ''
  };

  setWeb3 = web3 => this.setState({ web3 });
  setGemsContract = gemsContract => this.setState({ gemsContract });
  setCurrentAccountId = currentAccountId => this.setState({ currentAccountId });
}

export default AppContainer;
