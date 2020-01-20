import React, {Component} from "react";
import styled from "styled-components";
import Loading from "../../../components/Loading";


export class ApproveGemBurnPopup extends Component {

    state = {
        waitingForConfirmation: false
    }

    render() {
        return (
        <PopupContainer>
              <div>Please confirm transaction to allow gems to combine. Click Next to continue.</div>
              {this.state.waitingForConfirmation ? 
              <>
                <div style={{position: "relative", height: "30px"}}><Loading/></div>
                <div>
                  Waiting for the transaction to be completed
                </div>
              </> :
              <>
                <div onClick={() => {
                        this.setState({waitingForConfirmation: true})
                        this.props.confirmApprove()}}>
                    <Pink>Next</Pink>
                </div>
                <div onClick={this.props.cancelApprove}><Blue>Cancel</Blue></div>
              </>
                }
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
            text-align: center;
            width: 100%;
            padding: 0 1%;
            font-size: 15px;
            font-weight: bold;
            min-width: 320px;
            max-width: 420px;
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

export default ApproveGemBurnPopup;