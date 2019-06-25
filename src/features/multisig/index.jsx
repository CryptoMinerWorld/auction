import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {withRouter} from "react-router-dom";
import {constructMsigRequest, signAndExtract, updateFeatures, updateMsig, updateRole} from "./msigActions";
import styled from 'styled-components';

const select = store => ({
    currentUserId: store.auth.currentUserId,
});

class Msig extends Component {

    state = {
        extractedParams: {
            v: "",
            r: "",
            s: ""
        },
        contractAddress: "",
        updateRoleTo: "",
        updateRoleRole: "",
        updateFeaturesMask: "",
        updateMsigTo: "",
        updateMsigRole: "",
        updateMsigExpires: "",
        updateMsigV: "",
        updateMsigR: "",
        updateMsigS: "",
    };

    async componentDidMount() {
        const {
            currentUserId
        } = this.props;
    }

    async componentDidUpdate(prevProps) {
        const {
            currentUserId
        } = this.props;
    }

    render() {
        return (
          <Container className="bg-off-black" data-testid="market-page"
               style={{paddingTop: '0px', padding: '0 20px 20px', color: "darkgrey"}}>
              <div style={{textAlign: "center", color: "magenta", fontWeight: "bold"}}>Contract Address:
                  <input value={this.state.contractAddress}
                         minLength={42}
                         maxLength={42}
                         size={42}
                         onChange={(e) => this.setState({contractAddress: e.target.value})}/>
              </div>
              <div>
                  <h3>Update Role</h3>
                  <div>To:
                      <input value={this.state.updateRoleTo}
                             size={42}
                             onChange={(e) => this.setState({updateRoleTo: e.target.value})}/>
                  </div>
                  <div>Role:
                      <input value={this.state.updateRoleRole}
                             size={64}
                             onChange={(e) => this.setState({updateRoleRole: e.target.value})}/>
                  </div>
                  <button onClick={() => {
                      if (this.state.contractAddress.length < 42) {
                          alert("check contract address");
                          return;
                      }
                      this.props.handleUpdateRole(
                        this.state.contractAddress,
                        this.state.updateRoleTo,
                        this.state.updateRoleRole,
                      );
                  }}>Go</button>
              </div>
              <div>
                  <h3>Update Features</h3>
                  <div>Features Mask:
                      <input value={this.state.updateFeaturesMask}
                             size={64}
                             onChange={(e) => this.setState({updateFeaturesMask: e.target.value})}/>
                  </div>
                  <button onClick={() => {
                      if (this.state.contractAddress.length < 42) {
                          alert("check contract address");
                          return;
                      }
                      this.props.handleUpdateFeatures(
                        this.state.contractAddress,
                        this.state.updateFeaturesMask
                      );
                  }}>Go</button>
              </div>
              <div>
                  <h3>Construct Msig Request and sign data</h3>
                  <div>To:
                      <input value={this.state.updateMsigTo}
                             size={42}
                             onChange={(e) => this.setState({updateMsigTo: e.target.value})}/>
                  </div>
                  <div>Role:
                      <input value={this.state.updateMsigRole}
                             size={64}
                             onChange={(e) => this.setState({updateMsigRole: e.target.value})}/>
                  </div>
                  <div>Expires on:
                      <input type="date" value={this.state.updateMsigExpires}
                             onChange={(e) => this.setState({updateMsigExpires: e.target.value})}/>
                  </div>
                  <button onClick={async () => {
                      if (this.state.contractAddress.length < 42) {
                          alert("check contract address");
                          return;
                      }
                      const message = await this.props.handleConstructMsigRequest(
                        this.state.contractAddress,
                        this.state.updateMsigTo,
                        this.state.updateMsigRole,
                        Date.parse(this.state.updateMsigExpires).toString().substring(0, 10),
                      );
                      const extractedParams = await this.props.handleSignAndExtract(message);
                      this.setState({extractedParams});
                  }}>Sign and extract r, s, v</button>
              </div>
              <div>
                  <h4>Extracted params:</h4>
                  <div>v: {this.state.extractedParams.v || ""}</div>
                  <div>r: {this.state.extractedParams.r || ""}</div>
                  <div>s: {this.state.extractedParams.s || ""}</div>
              </div>
              <div>
                  <h3>Update Msig</h3>
                  <div>To:
                      <input value={this.state.updateMsigTo}
                             size={42}
                             onChange={(e) => this.setState({updateMsigTo: e.target.value})}/>
                  </div>
                  <div>Role:
                      <input value={this.state.updateMsigRole}
                             size={64}
                             onChange={(e) => this.setState({updateMsigRole: e.target.value})}/>
                  </div>
                  <div>Expires on:
                      <input type="date" value={this.state.updateMsigExpires}
                             onChange={(e) => this.setState({updateMsigExpires: e.target.value})}/>
                  </div>
                  <div>V (comma separated):
                      <input value={this.state.updateMsigV}
                             onChange={(e) => this.setState({updateMsigV: e.target.value})}/>
                  </div>
                  <div>R (comma separated):
                      <input value={this.state.updateMsigR}
                             onChange={(e) => this.setState({updateMsigR: e.target.value})}/>
                  </div>
                  <div>S (comma separated):
                      <input value={this.state.updateMsigS}
                             onChange={(e) => this.setState({updateMsigS: e.target.value})}/>
                  </div>
                  <button onClick={() => {
                      if (this.state.contractAddress.length < 42) {
                          alert("check contract address");
                          return;
                      }
                      this.props.handleUpdateMsig(
                        this.state.contractAddress,
                        this.state.updateMsigTo,
                        this.state.updateMsigRole,
                        Date.parse(this.state.updateMsigExpires).toString().substring(0, 10),
                        this.state.updateMsigV.split(','),
                        this.state.updateMsigR.split(','),
                        this.state.updateMsigS.split(',')
                      );
                  }}>Go</button>
              </div>
          </Container>
        )
    }
}

const actions = {
    handleSignAndExtract: signAndExtract,
    handleUpdateRole: updateRole,
    handleUpdateFeatures: updateFeatures,
    handleUpdateMsig: updateMsig,
    handleConstructMsigRequest: constructMsigRequest,
};

export default compose(
  withRouter,
  connect(
    select,
    actions,
  )
)(Msig);

const Container = styled.div`
    h3, h4 {
        color: white
    }
    
    >div {
        background-color: #333333;
        margin: 5px 10px;
        padding: 5px;
        border-radius: 10px;
    }
    
    div {
        color: #eeeeee
    }    
      
    input, button {
        color: #333333
    }  
`;
