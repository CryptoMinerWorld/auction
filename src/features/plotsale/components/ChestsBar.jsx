import React from 'react';
import worldChest from "./../../../app/images/sale/worldChest.png"
import monthlyChests from "./../../../app/images/sale/monthlyChests.png"

const ChestsBar = ({worldChestValue, monthlyChestsValue}) => {
    const barStyle = {
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#383F45"
    }

    const imgStyle = {
        height: "200px"
    }

    const chestValueStyle = {
        fontSize: "24px",
        color: "magenta"
    }

    const chestInfoStyle = {
        fontSize: "22px",
        color: "c7c8c9"
    }

    const chestTitleStyle = {
        fontSize: "14px"
    }

    return (
      <div style={barStyle}>
          <div style={{}}>
              <img style={imgStyle} src={worldChest}/>
              <div>
                  <div style={chestValueStyle}>34.78 ETH <span>10 ETH per chest</span></div>
                  <div style={chestTitleStyle}>In the <span>5</span> Monthly Chests!</div>
                  <div style={chestInfoStyle}>At the start of each month Keys will open all Monthly Chests that were created!</div>
              </div>
          </div>
          <div style={{}}>
              <img style={imgStyle} src={monthlyChests}/>
              <div>
                  <div style={chestValueStyle}>123.89 ETH</div>
                  <div style={chestTitleStyle}>In The World Chest!</div>
                  <div style={chestInfoStyle}>Once the last plot of land is bought, one key will be able to open the World Chest</div>
              </div>
          </div>
      </div>
    )
}

export default ChestsBar
