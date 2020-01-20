import React, {Component} from "react";
import styled from "styled-components";

export class AssetSwitchPopup extends Component {

    render() {
        
        return (
          <PopupContainer>
              <div>Switch asset?</div>
              <div onClick={this.props.confirmSwitch}><Pink>Confrim</Pink></div>
              <div onClick={this.props.cancelSwitch}><Blue>Cancel</Blue></div>
          </PopupContainer>
        );
    }
}

const PopupContainer = styled.div`
            @media (max-width: 600px) {
                font-size: 12px;
            }
        
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 0 1%;
            font-size: 15px;
            font-weight: bold;
            min-width: 320px;
            max-width: 580px;
        `;

const Row = styled.div`
            display: flex;
            align-items: center;
`

const Pink = styled.span`color: #FF00CD;`;
const Silver = styled.span`color: #bcc9d8;`
const Gold = styled.span`color: #faeb61;`
const Blue = styled.span`color: #a4c7ec;`
const Orange = styled.span`color: #fbc17c;`

export default AssetSwitchPopup;