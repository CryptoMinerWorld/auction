import React, {Component} from "react";
import styled from "styled-components";
import Loading from "../../../components/Loading";


export class ApproveGemBurnPopup extends Component {

    state = {
        waitingForConfirmation: true
    }

    componentDidMount() {
      try {
        this.props.confirmApprove()
      } catch (reject) {
        this.props.cancelApprove()
      }
    }

    render() {
        return (
        <PopupContainer>
              <div>To start combining Gems you have to grant permission with a one time transaction.</div>
              {this.state.waitingForConfirmation ? 
              <>
                <div style={{position: "relative", height: "30px"}}><Loading/></div>
                <div>
                Waiting for transaction to be confirmed.
                </div>
              </> :
              <>
                <div onClick={() => {
                        this.setState({waitingForConfirmation: true})
                        }}>
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