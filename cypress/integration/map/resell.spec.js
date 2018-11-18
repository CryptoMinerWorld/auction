import Web3 from 'web3';
import PrivateKeyProvider from 'truffle-privatekey-provider';

describe('Country Map', () => {
  context('Reselling a country', () => {
    const country = 'Andorra';
    it('lets you sell a country you own', () => {
      cy.on('window:before:load', (win) => {
        const provider = new PrivateKeyProvider(
          Cypress.env('USER_A'),
          'https://rinkeby.infura.io/',
        );
        // eslint-disable-next-line
        win.web3 = new Web3(provider);
      });
      cy.visit('http://localhost:3000/profile/0xD9b74f73d933Fde459766f74400971B29B90c9d2');
      cy.getByText('Joshxxx');
      cy.getByText(country);
      cy.getByLabelText('Country Price')
        .type(5.4)
        .should('have.value', '5.4');
      cy.getByTestId('countrySellButton').click();
      cy.queryByText(country).should('not.exist');
    });
  });
});
