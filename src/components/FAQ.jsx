import React from 'react';

const FAQ = () =>
  <div className="bg-off-black white ma0 pa3 measure">
    <h2 className='white'
    >Frequently Asked Questions</h2>
    <details open>
      <summary className="underlined blue">How does this work?</summary>
      <p>This auction is a Dutch Auction. It works by having a high and a low price. Then setting a time frame in which the price will steadily lower from the high to the low. The Auction ends as soon as one user pays their bid. Bids are always the current price. If the low price is reached and no bid was made, the item stays for sale at that low price indefinitely, until someone buys it or the user that started the auction cancels it. The user can cancel the auction at any time, before or after the low price is reached.</p>
    </details>
    <details>
      <summary className="underlined blue">How often do auctions run?</summary>
      <p>Auctions will start out one at a time. The items for sale will be very rare. They will run for a week, but once one is bought the next one begins. Later we will do more than one item for sale at once, at that time some rare, but not very rare, items will be sold at lower prices.</p>
    </details>
    <details>
      <summary className="underlined blue">What do the stats of the Gem mean?</summary>
      <p>Grade, level, Mining rate bonus. What does that all me. Be sure to check out this section of the <a href="https://cryptominerworld.com/game_info/#GameInfoDiggingDeeper" >Game info page</a> to get a better idea of what these things do.
<br />
        <br />
        In short all stats help the Gem mine better. Which increases their value to you, both in terms of how much faster you can find loot from better mining Gems. And in terms of how much you will be able to sell them for on the Market.</p>
    </details>
    <details>
      <summary className="underlined blue">Can I resell an Item?</summary>
      <p>Once the Market is open to the public (Phase 2) you will be able to sell any item you own to other players.</p>
    </details>
    <details>
      <summary className="underlined blue">How do I bid?</summary>
      <p>You bid by clicking the big pink “Buy Now” button. You will need to be using a Web3 compatible Ethereum Wallet program. MetaMask, Toshi/Coinbase Wallet, BUNTOY, Brave browser, Trust, Cipher, are some of the more well know options. For more information on how to install MetaMask  <a href="https://cryptominerworld.com/game_info/#GameInfoMetaMask">click here </a> </p>
    </details>
  </div>

export default FAQ;
