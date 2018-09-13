import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';

class FAQ extends PureComponent {

  state = {
    focusedDetail: 0
  }

  handleChange = (index) => () => {
    this.setState({ focusedDetail: index })
  }

  render() {
    const { focusedDetail } = this.state
    return (
      <div className="bg-off-black white ma0 pa3 measure">
        <h2 className='white'
        >Frequently Asked Questions</h2>

        <Question focusedDetail={focusedDetail}
          handleChange={this.handleChange}
          question='How does this work?'
          answer='This auction is a Dutch Auction. It works by having a high and a low price. Then setting a time frame in which the price will steadily lower from the high to the low. The Auction ends as soon as one user pays their bid. Bids are always the current price. If the low price is reached and no bid was made, the item stays for sale at that low price indefinitely, until someone buys it or the user that started the auction cancels it. The user can cancel the auction at any time, before or after the low price is reached.'
          index={1} />
        <Question focusedDetail={focusedDetail}
          handleChange={this.handleChange}
          question='How often do auctions run?'
          answer='Auctions will start out one at a time. The items for sale will be very rare. They will run for a week, but once one is bought the next one begins. Later we will do more than one item for sale at once, at that time some rare, but not very rare, items will be sold at lower prices.'
          index={2} />
        <Question focusedDetail={focusedDetail}
          handleChange={this.handleChange}
          question='Can I resell an Item?'
          answer='Once the Market is open to the public (Phase 2) you will be able to sell any item you own to other players.'
          index={3} />
        <Question focusedDetail={focusedDetail}
          handleChange={this.handleChange}
          question='How do I bid?'
          answer='You bid by clicking the big pink “Buy Now” button. You will need to be using a Web3 compatible Ethereum Wallet program. MetaMask, Toshi/Coinbase Wallet, BUNTOY, Brave browser, Trust, Cipher, are some of the more well know options. For more information on how to install MetaMask'
          index={4} />


      </div>
    )
  }
}



const Question = ({ focusedDetail, handleChange, question, answer, index }) => (
  <details open={focusedDetail === index} onFocus={handleChange(index)}>
    <summary className="underlined blue">{question}</summary>
    <p>{answer}</p>
    {index === 4 && <p>For more information on how to install MetaMask  <a href="https://cryptominerworld.com/game_info/#GameInfoMetaMask">Click here </a></p>}
  </details>
)


Question.propTypes = {
  focusedDetail: PropTypes.number.isRequired, handleChange: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default FAQ;
