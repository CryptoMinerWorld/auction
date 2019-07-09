import React, {useState} from 'react';
import PropTypes from 'prop-types';
import ImageLoader from 'react-loading-image';
import Loading from '../../../../components/Loading';
import {CutEdgesButton} from "../../../../components/CutEdgesButton";
import styled from 'styled-components';
import {CopyToClipboard} from "react-copy-to-clipboard";

const CountryDetails = ({
                            name,
                            showForOwner,
                            countryId,
                            lastBought,
                            totalPlots,
                            plotsBought,
                            plotsMined,
                            plotsAvailable,
                            image,
                            lastPrice,
                            roi,
                        }) => {

    const [linkCopied, setLinkCopied] = useState(false);
    return (
      <>
          <CountryDetailsContainer>
              <div className="w-100" style={{minWidth: '50%'}}>
                  <h1 className="white f1 b" style={{marginBottom: '10px'}}>{name}</h1>

                  {//showForOwner &&
                      <CopyCountryPlotLinkArea>
                          <CopyToClipboard
                            text={process.env.REACT_APP_BASE_URL + "/plots/" + countryId}
                            onCopy={() => setLinkCopied(true)}>
                              <CutEdgesButton outlineColor={"#FC6BE7"}
                                              backgroundColor={"#A30D8E"}
                                              edgeSizes={[5, 20]}
                                              outlineWidth={3}
                                              fontColor={"#dedbec"}
                                              height={35}
                                              fontSize={17}
                                              content="Copy Country Plot Link"
                                              otherStyles={"max-width: 234px; min-width: 234px; font-weight: bold;"}
                              />
                          </CopyToClipboard>
                          <CopyLinkText>{linkCopied ? "Copied" :
                            "Click to copy a link that will send people to the Plot Sale with this Country Selected"}
                          </CopyLinkText>
                      </CopyCountryPlotLinkArea>}
                  {/*<small className="pb3">*/}
                  {/*Owned for*/}
                  {/*{` ${formatDistance(new Date(lastBought), new Date())}`}*/}
                  {/*</small>*/}

                  <div className="flex aie jcb white">
                      <div className="">
                          <dd className="f6 f5-ns b ml0">Price Paid</dd>
                          <dd className="f3 f2-ns b ml0 w-100">{lastPrice && lastPrice.toFixed(3)}</dd>
                      </div>
                      <div className="">
                          <dd className="f6 f5-ns b ml0">Plots Remaining</dd>
                          <dd className="f3 f2-ns b ml0 w-100">{plotsAvailable}</dd>
                      </div>
                      <div className="">
                          <dd className="f6 f5-ns b ml0">Return on Investment</dd>
                          <dd className="f3 f2-ns b ml0 w-100">{roi && roi.toFixed(3)}</dd>
                      </div>
                  </div>

                  <dl className="w-100">
                      <h3 className="white">DETAILS</h3>
                      <span className="flex">
                          <dt>Total Plots</dt>
                          <dd className="pl2">{totalPlots}</dd>
                      </span>
                      <span className="flex">
                          <dt>Plots Sold</dt>
                          <dd className="pl2">{plotsBought}</dd>
                      </span>
                      <span className="flex">
                          <dt>Eth Earned</dt>
                          <dd className="pl2">{(plotsBought * 0.002).toFixed(3)} ETH</dd>
                      </span>
                  </dl>
              </div>
              <div className="w-50-ns w-100 ml3-ns h-100 flex aic jcc">
                  <div className="w-auto flex aic jcc">
                      <ImageLoader
                        src={image}
                        className="grow imageContain w-auto h-auto fitToMobile"
                        style={{
                            maxHeight: '40em',
                        }}
                        loading={() => <Loading/>}
                        error={() => <div>Error</div>}
                      />
                  </div>
              </div>
          </CountryDetailsContainer>
      </>
    );

};


export default CountryDetails;

CountryDetails.propTypes = {
    name: PropTypes.string.isRequired,
    lastBought: PropTypes.number.isRequired,
    totalPlots: PropTypes.number.isRequired,
    plotsBought: PropTypes.number.isRequired,
    plotsMined: PropTypes.number.isRequired,
    plotsAvailable: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    lastPrice: PropTypes.number.isRequired,
    roi: PropTypes.number.isRequired,
};

const CountryDetailsContainer = styled.div`
    display: flex;
    margin: 2rem auto 4rem;
    color: white;
    padding: 1rem;
    height: 40em;
    max-width: 66rem;
    
    @media(max-width: 800px) {
        flex-direction: column-reverse;
        margin-top: 6em;
    }
    
`;

const CopyCountryPlotLinkArea = styled.div`
  display: flex;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const CopyLinkText = styled.div`
  min-width: 252px;
  max-width: 252px;
  font-size: 12px;
  color: #91a2ad;
  margin: 0 5px;
`;