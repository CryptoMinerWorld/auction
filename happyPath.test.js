
const puppeteer = require('puppeteer');
const dappeteer = require('dappeteer');
const faker = require('faker');


const user = {
  name: faker.name.firstName(),
  email: faker.internet.email(),
};

async function usersCanCreateAnAccount() {
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
  await marketplace.waitForSelector('[data-testId="signUp"]');
  const signUpButton = await marketplace.$('[data-testId="signUp"]');

  await signUpButton.click();

  // // Authorize marketplace contract
  await marketplace.waitForSelector('[data-testid="name"]');


  await marketplace.click('[data-testid="name"]', user.name);
  await marketplace.type('[data-testid="name"]', user.name);
  // const checkbox = (await marketplace.$$('input[type="checkbox"]'))[0];
  // await checkbox.click();
  await marketplace.click('[data-testId="email"]');
  await marketplace.click('[data-testId="email"]', user.email);

  // // submit tx
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
  // await browser.close();
  setTimeout(() => { browser.close(); }, 3000);
}

usersCanCreateAnAccount();

// async function main() {
//   const browser = dappeteer.launch(puppeteer);
//   const metamask = await dappeteer.getMetamask(browser);
//   console.log('starting....');
//   // create or import an account
//   // await metamask.createAccount()
//   // await metamask.importAccount('maximum bullet rent path badge diamond all dice sure carry dust shove');
//   await metamask.createAccount();

//   // you can change the network if you want
//   await metamask.switchNetwork('rinkeby');
//   console.log('rinkebying...');
//   // go to a dapp and do something that prompts MetaMask to confirm a transaction
//   const page = await browser.newPage();
//   await page.goto('http://localhost:3000/');
//   await page.$("[data-testId='myWorkshop']").click();
//   console.log('done');
//   // 🏌
//   // await metamask.confirmTransaction();
// }

// main();


// describe.skip('App happy path tests', () => {
//   // it.skip('Users can create an account', () => {
//   //   expect(true).toBeFalsy();
//   // });

//   it.skip('Create an account modal doesn;t appear if users has already created an account', () => {

//     // expect(true).toBeFalsy();
//   });

//   it.skip('all existing gems load in when an users signs up', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('users can create an auction', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('users can remove a gem from auction', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('users can remove a gem from auction', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('auction creation and removal only update teh UI when the contract has been updated', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('when an auction is created all the auction details are added to the db', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('the price for every auction is updated every 10 seconds', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('users can order auctions by time and price', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('a profile page shows all a users gems, both in auction and othewise', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('market updates in realtime', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('dashboard updates in realtime', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('gems contain all requited fields when created', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('5 ordering buttons work', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('4 filters work', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('filters and orders work together', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('when a gem is bought the owner of a gem updates on db', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('auction/edit and stats page all appear on /gem/gemID page', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip("shouldn't need metamask to access the pages", () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('dashboard is publicly viewable', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('dashbpard username shows up publicly even if they have no gems', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('sold by button on auction page goes to public profile', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('sign in box appears when you click on workshop', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('sign in box appears when you buy a gem', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('the system logs you in automatically if you have an account', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('metamsk changes account in real time, pushes you to mark, then refershes you id, name, gems details', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('of there is no provider sign in bo should tell you to install metamask', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('stats page shows correct stats', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('resync button resunc gems', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('filters and gem filters work together', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('realtime updates dont reset filter categories', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('sort by bittons sort info', () => {
//     expect(true).toBeFalsy();
//   });

//   it.skip('if gem is A grade it should show resting energy', () => {
//     expect(true).toBeFalsy();
//   });
// });
