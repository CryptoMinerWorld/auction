import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import rockBackground from '../../app/images/rockBackground.png';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { getReferralHistory } from './actions';

const RockOverlay = styled.div`
  background-image: url(${rockBackground});
  background-repeat: repeat;
  background-size: contain;
`;

const ReferralInfo = (props) => {
  var referrerStats;
  var [totalPlotBuysReferred, setTotalPlotBuysReferred] = useState(null)
 
  const fetchReferralHistory = async () => {
    let referralStats = await props.handleGetReferralHistory();
    setTotalPlotBuysReferred(referralStats);
  }

  useEffect(() => {
    if (props.web3 && props.plotSaleContract && !totalPlotBuysReferred) 
      fetchReferralHistory()
  });

  return (
    <div className="bg-off-black white">
      <RockOverlay>
        <div className="b tc">Referral Address <span style={{marginLeft: "250px"}}>Plots</span></div>
        {      
          totalPlotBuysReferred && Object.keys(totalPlotBuysReferred)
          .map((referrer, index) => <div className="tc" key={index}>{referrer} - {totalPlotBuysReferred[referrer]}</div>)
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
