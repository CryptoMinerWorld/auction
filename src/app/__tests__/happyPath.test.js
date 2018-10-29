import 'jest-dom/extend-expect';

const puppeteer = require('puppeteer');
const dappeteer = require('dappeteer');
const faker = require('faker');

const user = {
  name: faker.name.firstName(),
  email: faker.internet.email(),
};
describe.skip('App happy path tests', () => {
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


      const text = await marketplace.evaluate(() => document.querySelector('[data-testid="avatarUsername"]').textContent, 5000);

      console.log('text, user.name', text, user.name);

      expect(text).toBe(user.name);
      // marketplace.$eval('[data-testid="avatarUsername"]', (el) => {
      //   console.log('el.innerHTML', el.innerHTML, user.name);
      //   expect(user.name).toBe(el.innerHTML);
      // });
      // page.$eval(selector, element => element.innerHTML);

      // await metamask.confirmTransaction();

      // // wait for tx to start
      // await marketplace.bringToFront();
      // await marketplace.waitForSelector('.TxStatusText');

      // // wait for tx to be mined
      // await marketplace.waitFor(
      //   () => document.querySelector('.TxStatusText') == null,
      //   {
      //     timeout: 180000,
      //   },
      // );

      // close browser
      await browser.close();
    // setTimeout(() => { browser.close(); }, 3000);
    },
    23000,
  );
});
