# Cryptominer World

## Deployment Checklist

There are 4 moving parts to this application:

- a React client
- a Firebase database
- an Apollo server and
- a set of firebase functions for time bound updates.

Make sure you follow the following checklist when deploying changes to production:

### [Apollo server](https://github.com/CryptoMinerWorld/server)

_Only perform the following steps if you have made changes to the server_

- [ ] The service account details refrenced in the index file should be for the production database.
- [ ] Make sure the database url in the index file in for the production database.
- [ ] `gcloud config set project cryptominerworld` to point the server to the production environment for deployment . You can use `gcloud projects list`, to see the list of available environments.
- [ ] `gcloud app deploy` to deploy the new server to the production environment.

### [React Client](https://github.com/CryptoMinerWorld/auction/tree/master/src)

_Only perform the following steps if you have made changes to the frontend client_

- [ ] Ensure the appspot domain at the top of the index file point sto the production server url.
- [ ] Switch out your environmnet variables for production variables.
- [ ] `npm run build`
- [ ] `firebase use prod` (you can type `firebase use` to see available environmnets)
- [ ] `firebase deploy --except functions`. If you want to push firebase function changes do that seperately in the next step.

### [Firebase Functions](https://github.com/CryptoMinerWorld/auction/tree/master/functions)

_Only perform the following steps if you have made changes to the firebase functions folder_

- [ ] Switch all the contract refernces to production contracts.
- [ ] Switch the web3 reference to mainnet
- [ ] `firebase deploy --only functions`

## Setup

Setting up a the project from github will need an environment variables file to work.

There will be one set of variables for the development environmnet (test database on rinkeby), another set for the staging environment(test database on mainnet) and one for production (production database on mainnet).

1. Name the file `.env`, place it in the root of the project and make sure it has details for each of the following filled out:

```
REACT_APP_DUTCH_AUCTION=
REACT_APP_GEM_ERC721=
REACT_APP_MINT_HELPER=
REACT_APP_PRESALE2=
REACT_APP_COUNTRY_ERC721=
REACT_APP_COUNTRY_SALE=
REACT_APP_ANALYTICS=
REACT_APP_FB_API=
REACT_APP_FB_AUTH_DOMAIN=
REACT_APP_FB_DB_URL=
REACT_APP_FB_PROJECT_ID=
REACT_APP_FB_STORAGE=
REACT_APP_FB_MSG_SENDER_ID=
REACT_APP_BASE_URL=
REACT_APP_NETWORK=
```

Ask the project lead for the environmnet keys. Once added, you can follow command scripts in the package.json to start, test or deploy.

2. You will also need access to each of the database environmnets and you must setup [firebase tools](https://github.com/firebase/firebase-tools)

3. You will also need access to each of the gCloud environmnets and you must setup [gcloud](https://cloud.google.com/sdk/)

## Architecture

This project started its life as a [wordpress website](https://cryptominerworld.com/). The wordpress site is active and navbar links links the two, seperately deployed, projects together.

This section of the project, name the Auction repo, covers gem auctions, a gem marketplace, user workshops, and a country market.

This section of the project started out as a simple create-react-app project, that used react-router. the project follows airbnb linting rules. The projects interacts with the ethereum blockchain via web3 and persists data onto a serverless firestore database.

### State Management

As state management started to grow in complexity I added Redux to the mix. I used Thunk for any async actions.

Over time, the complexity of the actions around specific juntions in the app started to become hard to reason about. I added a state machine to handle logic at these junctions.

In most cases, I used the [React Automata library](https://github.com/MicheleBertoli/react-automata) to interpret the state charts. Towards the end of the project I switched to [X-State 4](https://xstate.js.org/docs/) since it is a more robust solution. The machines are interchangeable between to two interpreters. React Automata is just a thin react-specific abstraction over X-State.

For the last module in the project, the country map, I added an apollo server to the architecture. My reason for this decision is that a graphql layer makes the architecture a lot more flexible to changes as the project develops. Additionally, apollo also implements its own state managemnet solution which means we could refactor the project to only rely apollo and reduce the complexity of the codebase significantly.

### Styling

This project is largely structured for deletability. I have structured the entire project into self contained features. The means that all the code for a given feature is located in one place and it can be deleted or updated relatively easily.

I have leaned towards duplicating logic where needed rather than keeping everything DRY, this way features are less entangled with each other. I have kept things DRY and there is ashare components folder though so it's not a rule as much as guiding principle.

For styling I have relied heavily on the [AntD component library](https://ant.design/docs/react/introduce).

For css overwrites, I initially relied on styled components, teh idea was to keep everything self contained, but styled components kept giving me issues at compile time.

I switched to atomic css.

This makes styling less coupled to the components but much easier to work with. I am using the [Tachyons](https://tachyons.io/docs/) naming convensions and I have written a custom set of css rules for flex and grid in `src > app > css > grid.css`

### Testing

Test coverage is low. Continuous changes, like all the transaction being handled by a new transactin module in the last week of development, have led to most of the existing tests being broken. I have left all the tests commented out so that it is easy to see what needs to be tested when the project is refactored.

The project relies on Jest and the [react-testing-library](https://github.com/kentcdodds/react-testing-library) for unit and integration tests.

The project is also set up to use cypress for end-to-end tests. I managed to figure out a way to add web3 to cypress using [truffle-key-provider](https://www.npmjs.com/package/truffle-privatekey-provider) (you can see an [example repo here](https://github.com/MichalZalecki/cypress-web3-testing)) to run true end-to-end tests on the blockchain.

You will need to add your wallet variables and a private key as cypress variables to enable this. The only end-to-end test that exist are for buying countries and you can't repeat tests since a country sale status cannot be reset on the blockchain. This was set yp to help during the build process. However, the architecture is in place for more comprehensive end-to-end testing.

Towards the end of the project I setup storybook so that components could be built in isolation. The process of building components in isolation took longer than it needed to, and didn't provide much benefit on a one man team. I have left everything in place for when multiple people start working on the project.

## Next steps

Todos are listed in [the repo's github issues](https://github.com/CryptoMinerWorld/auction/issues) and task that were put onto the back burner during development are listed [here](https://github.com/CryptoMinerWorld/auction/projects/1#column-3533502).

My suggestion on things to do next would be:

1. Add types to the codebase. I have used react prop types but these only apply to the react code. I would use typescript movng forward.

2. Refactor the project to remove firebase altogether and handle all database calls through graphql. This will simplify code complexity and make end-to-end testing easier and cypress does not play well with firebase.
