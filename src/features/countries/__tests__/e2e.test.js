import 'jest-dom/extend-expect';

const puppeteer = require('puppeteer');
const dappeteer = require('dappeteer');
const faker = require('faker');

const user = {
  name: faker.name.firstName(),
  email: faker.internet.email(),
};

describe.skip('Nation map lets you buy a country', () => {
  it(
    'app lets you sign up ',
    async () => {
      const browser = await dappeteer.launch(puppeteer);
      const metamask = await dappeteer.getMetamask(browser);

      // import MetaMask account
      await metamask.importAccount(
        'already turtle birth enroll since owner keep patch skirt drift any dinner',
      );

      // switch to Rinkeby
      await metamask.switchNetwork('rinkeby');

      // open cryptominer marketplace
      const marketplace = await browser.newPage();
      await marketplace.goto('http://localhost:3000/');

      // click on Workshop Button
      await marketplace.waitForSelector('[data-testid="signUp"]');
      const signUpButton = await marketplace.$('[data-testid="signUp"]');

      await signUpButton.click();

      // // Authorize marketplace contract
      await marketplace.waitForSelector('[data-testid="name"]');

      await marketplace.click('[data-testid="name"]');
      await marketplace.type('[data-testid="name"]', user.name);

      await marketplace.click('[data-testid="email"]');
      await marketplace.type('[data-testid="email"]', user.email);

      const checkbox = (await marketplace.$$("[data-testid='avatars']"))[faker.random.number(11)];
      await checkbox.click();

      // // submit
      await marketplace.click('[data-testId="terms"]');
      await marketplace.click('[data-testId="submitSignup"]');

      await marketplace.waitFor(1000);
      await marketplace.waitForSelector('[data-testid="mapLink"]');

      //   marketplace.waitForNavigation({ waitUntil: 'load' });


      // Set up the wait for navigation before clicking the link.
      const navigationPromise = marketplace.waitFor({ waitUntil: 'networkidle0' });

      // Clicking the link will indirectly cause a navigation
      await marketplace.click('[data-testid="mapLink"]');

      // The navigationPromise resolves after navigation has finished
      await navigationPromise;


      //   await marketplace.click('[data-testid="mapLink"]').then(() => marketplace.waitForNavigation({ waitUntil: 'load' }));

      await marketplace.waitForSelector('[data-testid="mapPage"]');


      marketplace.click('[data-testid="buyNow"]');

      await marketplace.waitForSelector('[data-testid="profile-page"]');

      // close browser
      await browser.close();
    // setTimeout(() => { browser.close(); }, 3000);
    },
    23000,
  );
});
