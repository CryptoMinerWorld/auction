import Web3 from 'web3';
import PrivateKeyProvider from 'truffle-privatekey-provider';

describe('Country Map', () => {
  context('No Metamask', () => {
    // beforeEach(() => {
    //   cy.visit('http://localhost:3000/map');
    // });

    it('loads a users countries', () => {
      cy.visit('http://localhost:3000/profile/0xd9b74f73d933fde459766f74400971b29b90c9d2');
      cy.getByText('Brazil');
      cy.getByText('India');
    });

    it('buys any country', () => {
      cy.visit('http://localhost:3000/map');
      cy.getByTestId('France').click();
      cy.getByTestId('buyNow').click();
      //   confirm page navoigation
      cy.getByText('France');
    });
  });

  context.only('With Metamask', () => {
    it.only('App lets you sign up', () => {
      cy.on('window:before:load', (win) => {
        const provider = new PrivateKeyProvider(
          'EC1902E25723C988078A4036A52D21461AA98620D09A7171E1A20AD2BB53F3EC',
          'https://rinkeby.infura.io/',
        );
        win.web3 = new Web3(provider);
      });


      cy.visit('http://localhost:3000/');
      cy.wait(1000);

      cy.getByTestId('signUp').click();
      cy.getByTestId('name')
        .type('joshxxx')
        .should('have.value', 'Joshxxx');

      cy.getByTestId('email')
        .type('josh@test.com')
        .should('have.value', 'josh@test.com');
      cy.get(':nth-child(5) > .flex > :nth-child(1) > img').click();

      cy.getByTestId('terms')
        .not('[disabled]')
        .check()
        .should('be.checked');

      cy.getByTestId('submitSignup').click();
      // cy.getByTestId('terms').should('not.exist');

      cy.getByText('Joshxxx');
    });
  });
});

// try different countries
// try different users
// try with metamask
// try with metamask but now account
