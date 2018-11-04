describe('Country Map', () => {
  context('No Metamask', () => {
    // beforeEach(() => {
    //   cy.visit('http://localhost:3000/map');
    // });

    // it('buys a country', () => {
    //   cy.getByTestId('buyNow').click();
    //   cy.getByText('Brazil');
    //   cy.getByText('India');
    // });

    it('loads a users countries', () => {
      cy.visit('http://localhost:3000/profile/0xd9b74f73d933fde459766f74400971b29b90c9d2');
      cy.getByText('Brazil');
      cy.getByText('India');
    });
  });
});
// try different countries
// try different users
// try with metamask
