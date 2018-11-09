import Web3 from 'web3';
import PrivateKeyProvider from 'truffle-privatekey-provider';


describe('Country Map', () => {
  context('With Metamask', () => {
    it('App lets you sign up', () => {
      cy.on('window:before:load', (win) => {
        const provider = new PrivateKeyProvider(
          Cypress.env('USER_A'),
          'https://rinkeby.infura.io/',
        );
          // eslint-disable-next-line
        win.web3 = new Web3(provider);
      });

      cy.visit('http://localhost:3000/map');
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
      cy.wait(2000);
      // cy.queryByTestId('terms').should('not.exist');
      cy.getByText('Joshxxx');
    });

    it.only('lets you buy a country', () => {
      const country = 'Belize';
      cy.on('window:before:load', (win) => {
        const provider = new PrivateKeyProvider(
          Cypress.env('USER_A'),
          'https://rinkeby.infura.io/',
        );
          // eslint-disable-next-line
        win.web3 = new Web3(provider);
      });
      cy.wait(2000);
      cy.visit('http://localhost:3000/profile/0xD9b74f73d933Fde459766f74400971B29B90c9d2');
      // establish other countries do exist
      cy.queryByText(country).should('not.exist');
      cy.visit('http://localhost:3000/map');
      cy.wait(12000);
      cy.getByText('Joshxxx');
      cy.getByTestId(country).click();
      // remove brazil by default
      cy.getByTestId('buyNow').click();
      cy.url().should('contain', 'profile');
      cy.getByText(country);
    });

    it('lets you buy multiple countries', () => {
      cy.on('window:before:load', (win) => {
        const provider = new PrivateKeyProvider(
          Cypress.env('USER_A'),
          'https://rinkeby.infura.io/',
        );
          // eslint-disable-next-line
        win.web3 = new Web3(provider);
      });
      cy.wait(2000);
      cy.visit('http://localhost:3000/profile/0xd9b74f73d933fde459766f74400971b29b90c9d2');
      cy.queryByText('Brazil').should('not.exist');
      cy.visit('http://localhost:3000/map');
      cy.getByText('Joshxxx');
      cy.getByTestId('buyNow').click();
      cy.url().should('contain', 'profile');
      cy.getByText('Brazil');
    });
  });

  context.skip('Gifting feature', () => {
    // now you just delete userId data from any other country but brazil,
    // manually before test is run

    // you could eithe make this test better by just measuring
    // how many countries each user has and detecting a chnage

    // of you could od so oemthing where you switch teh user on each test?
    // a boolean or flag that swaps the users round each time its run

    // establish USER B does not own the country first

    it('shows that user B does not own the country to begin with', () => {
      cy.visit('http://localhost:3000/profile/0x11A4770C7990B4c9adD7b6787E1c5F39387f8EAd');
      cy.queryByText('Brazil').should('not.exist');
    });

    it('lets user A gift a nation to user B', () => {
      cy.on('window:before:load', (win) => {
        const provider = new PrivateKeyProvider(
          Cypress.env('USER_A'),
          'https://rinkeby.infura.io/',
        );
        // eslint-disable-next-line
        win.web3 = new Web3(provider);
      });

      cy.visit('http://localhost:3000/profile/0xd9b74f73d933fde459766f74400971b29b90c9d2');
      cy.getByText('Joshxxx');

      // input gift data
      cy.getByLabelText('Gift A Country', { timeout: 2000 })
        .type('0x11A4770C7990B4c9adD7b6787E1c5F39387f8EAd')
        .should('have.value', '0x11A4770C7990B4c9adD7b6787E1c5F39387f8EAd');

      cy.get('.gift-form')
        .submit()
        .next()
        .should('contain', 'Your form has been submitted!');
    });

    it('shows that user B has recieved the country', () => {
      cy.on('window:before:load', (win) => {
        const provider = new PrivateKeyProvider(
          Cypress.env('USER_B'),
          'https://rinkeby.infura.io/',
        );
          // eslint-disable-next-line
        win.web3 = new Web3(provider);
      });

      cy.visit('http://localhost:3000/profile/0x11A4770C7990B4c9adD7b6787E1c5F39387f8EAd');
      cy.getByText('Brazil');
    });

    // establish USER A no longer owns the country
  });


  context('No Metamask', () => {
    it('loads a users countries', () => {
      cy.visit('http://localhost:3000/profile/0x11A4770C7990B4c9adD7b6787E1c5F39387f8EAd');
      cy.getByText('Brazil');
    });

    it.skip('filter sorts each field', () => {

    });

    it.skip('filter filters serach results', () => {

    });

    it('filters adds a country to your cart', () => {
      cy.visit('http://localhost:3000/map');

      cy.getByText('Greenland').click();

      cy.get('.w-two-thirds > .ant-table-wrapper > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-content > .ant-table-body > table > .ant-table-tbody > .ant-table-row > :nth-child(1)');
    });
  });
});

// shouldn't let you buy without metamask

// try different countries
// try different users
// try with metamask
// try with metamask but now account
