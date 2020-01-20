import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import rockBackground from '../../app/images/rockBackground.png';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { getReferralHistory } from './actions';
import { Input, Button } from 'antd';
import Loading from '../../components/Loading'

const RockOverlay = styled.div`
  background-image: url(${rockBackground});
  background-repeat: repeat;
  background-size: contain;
`;

const ReferralInfo = (props) => {
  var referrerStats;
  var [totalPlotBuysReferred, setTotalPlotBuysReferred] = useState(null)
  var [referralAddressInput, setReferralAddressInput] = useState("")
  var [isLoadingReferralHistory, setIsLoadingReferralHistory] = useState(false)

  const fetchReferralHistory = async (referralAddress) => {
    setIsLoadingReferralHistory(true)
    let referralStats = await props.handleGetReferralHistory()
    let plotBuysReferred = referralStats[referralAddress.toLowerCase()]
    setTotalPlotBuysReferred(plotBuysReferred || 0)
    setIsLoadingReferralHistory(false)
  }

  // useEffect(() => {
  //   if (props.web3 && props.plotSaleContract && !totalPlotBuysReferred) 
  //     fetchReferralHistory()
  // });

  return (
    <div className="bg-off-black white flex jcc">
      <RockOverlay>
        Referral Address: <Input placeholder="referral address"
            style={{width: "300px", margin: "30px 5px"}}
            value={referralAddressInput}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                !isLoadingReferralHistory && fetchReferralHistory(referralAddressInput)
              }
            }}
            onChange={e => {
              setTotalPlotBuysReferred(null)
              setReferralAddressInput(e.target.value)}
            }
        />
        <Button style={{width: "100px", margin: "30px 5px"}}
          onClick={() => !isLoadingReferralHistory && fetchReferralHistory(referralAddressInput)}>
          {isLoadingReferralHistory ? 
            <div style={{margin: "10px", position: "relative"}}><Loading/></div> 
          : "Search"}
        </Button>
        <div className="b tc">Referral Address <span style={{marginLeft: "250px"}}>Plots</span></div>
        {/* {      
          totalPlotBuysReferred && Object.keys(totalPlotBuysReferred)
          .map((referrer, index) => <div className="tc" key={index}>{referrer} - {totalPlotBuysReferred[referrer]}</div>)
        } */}
        {
          totalPlotBuysReferred !== null &&
          <div className="tc">{referralAddressInput} - {totalPlotBuysReferred}</div>
        }
      </RockOverlay>
    </div> 
  )
}

const select = store => ({
  web3: store.app.web3,
  refPointsContract: store.app.refPointsTrackerContract,
  plotSaleContract: store.app.plotSaleContract
});

const actions = {
  handleGetReferralHistory: getReferralHistory,
}

export default compose(
  withRouter, 
  connect(select, actions)
)(ReferralInfo);
