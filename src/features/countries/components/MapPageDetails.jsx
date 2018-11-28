import React from 'react';
import Globe from '../../../app/images/mapPageSale.png';
import Owner from '../../../app/images/mapPageOwner.png';

const MapPageDetails = () => (
  <article className="pa3 mw9 center">
    <h1 className="tc white ttu">What is the Country Sale all about?</h1>
    <div className="flex row-ns col-reverse jcc">
      <div className="measure-wide w-70-ns">
        <p>
          {`Countries are a profit generator. This is a system was designed to reward you for taking on some of the risk of this project, by putting in money before launch. Buy a country and you will receive 10% of every Plot of Land bought in your country once the game launches! The bigger the country, the more expensive, but also the exponentially more money you make. The bigger your risk, the bigger your potential reward will be.
`}
        </p>
        <p>
          {`
The amount of land plots in a country is set and will not change. The price of each Plot of Land is also set and will not change. This allows us to show you a precise minimum return on investment (ROI) of each country. For example, the smallest country that will be sold is Comoros. It will cost 0.00533 ETH. After all plots are bought, the country owner will make 0.016 ETH. That is 3 times what it costs to buy it. That is a pretty awesome ROI. But remember, the bigger the country, the higher the ROI! Russia, the largest country in the game, costs 15.73 ETH, and earns its owner  125.84 ETH after all plots are sold! That is 8 times what it costs! a 700% ROI All of those numbers are just the minimum you can make after selling all of your plots. As a country owner, you will also make 2% of every plot that is resold on the player-to-player Market.
`}
        </p>
        <p>
          {`
This is a source of passive income. Country owners do not need to do anything. Just buy the country and then that's it. ETH will automatically be deposited into your account every time a Plot of Land is bought in your country.`}
        </p>
      </div>
      <div className="ma3 w-30-l ">
        <div className="w-auto flex aic jcc h-100 ">
          <img src={Globe} alt="" className="w-100 h-auto imageContain " />
        </div>
      </div>
    </div>
    <div className="flex row-ns col jcc">
      <div className="ma3 w-30-l ">
        <div className="w-auto flex aic jcc h-100 ">
          <img src={Owner} alt="" className="w-100 h-auto imageContain " />
        </div>
      </div>
      <div className="measure-wide w-70-ns">
        <p>
          {
            'Country Owners have no influence over the game of CryptoMiner World, it is a separate but thematically related system. Country owners are earning parts of the revenue that would have otherwise gone to the company. But the company needs more funding now, to help get us to launch quicker, and make a better end product for all players. By putting in money now, a portion of the companies revenue will go to country owners to reward them for taking on that risk. Once all countries are bought the company will make 225 ETH. The minimum amount that all countries will earn their owners, once all Plots of Land are sold is, 1,000 ETH!  The 2% Country Owners make off every Plot of Land that is resold, comes out of the 4% Developer fee that is applied to every single Market transaction.'
          }
        </p>
        <p>
          {
            'We don’t want this system to seem like get rich scheme. It definitely is not. Please don’t commit money into this system if you think making money from it is a guarantee. It is not, with the volatility of the crypto market there is a chance that the team runs out of funding before the project can fully launch. Or we might get to launch but all the Plots of Land do not sell. There are lots of risks, and we only want you putting money in if you are fully aware of these risks. We have immense confidence in this project. We would not be committing so much time and money into this project, if not. But we want to make sure you know that this is not a zero risk decision. We are immensely grateful for every bit of ETH we get, and we will use that to make this the best game we can make! Thank you!'
          }
        </p>
      </div>
    </div>
  </article>
);

export default MapPageDetails;
