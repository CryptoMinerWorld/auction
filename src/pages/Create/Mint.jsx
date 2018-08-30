import React, { PureComponent } from 'react';
import getWeb3 from '../../utils/getWeb3';
import { Select, Input, Icon } from 'antd';
const Option = Select.Option;

const mintABI = [
  {
    constant: false,
    inputs: [
      {
        name: 'color',
        type: 'uint8'
      },
      {
        name: 'level',
        type: 'uint8'
      },
      {
        name: 'gradeType',
        type: 'uint8'
      },
      {
        name: 'gradeValue',
        type: 'uint24'
      }
    ],
    name: 'mint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

class Mint extends PureComponent {
  state = {
    contractAddress: '0x6afd5f5f431279b0cac7f5ff406f13d804b183c9',
    color: '9',
    level: '1',
    gradeType: '1',
    gradeValue: ''
  };

  componentDidMount() {
    getWeb3.then(results =>
      this.setState({
        web3: results.web3
      })
    );
    this.randomGradeValue();
  }

  createGem = async (
    _contractAddress,
    _color,
    _level,
    _gradeType,
    _gradeValue
  ) => {
    const mintContract = this.state.web3.eth.contract(mintABI);
    const mintContractInstance = await mintContract.at(
      this.state.contractAddress
    );
    mintContractInstance.mint(
      _color,
      _level,
      _gradeType,
      _gradeValue,
      (err, result) => {
        if (!err) {
          this.setState({
            gemId: result,
            minted: true
          });
        } else console.error(err);
      }
    );
  };

  handleSubmit = (
    _contractAddress,
    _color,
    _level,
    _gradeType,
    _gradeValue
  ) => {
    this.createGem(_contractAddress, _color, _level, _gradeType, _gradeValue);
  };

  handleNetworkChange = value => this.setState({ contractAddress: value });
  handleColorChange = value => this.setState({ color: value });
  handleLevelChange = value => this.setState({ level: value });
  handleGradeTypeChange = value => this.setState({ gradeType: value });
  handleGradeValueChange = value => this.setState({ gradeValue: value });
  randomGradeValue = () =>
    this.setState({ gradeValue: Math.floor(1000000 * Math.random()) });

  render() {
    return (
      <div className="ma0 pa0">
        <div className="relative mw9 center flex jcc ">
          <div className="pa5 flex jcc col">
            <form
              id="mint_form"
              className="bg-white br3"
              onSubmit={e => {
                e.preventDefault();
                this.handleSubmit(
                  this.state.contractAddress,
                  this.state.color,
                  this.state.level,
                  this.state.gradeType,
                  this.state.gradeValue
                );
              }}
            >
              <fieldset>
                <legend>Mint A New Gem</legend>
                <div>
                  <label htmlFor="helper_address">Select Network:</label>
                  <Select
                    required
                    id="helper_address"
                    defaultValue="rinkeby"
                    style={{ width: 120 }}
                    onChange={this.handleNetworkChange}
                  >
                    <Option value="0x6afd5f5f431279b0cac7f5ff406f13d804b183c9">
                      Rinkeby
                    </Option>
                    <Option value="0x0">Mainnet</Option>
                  </Select>
                </div>
                <div>
                  <label htmlFor="helper_color">Select a Color:</label>
                  <Select
                    required
                    id="helper_color"
                    defaultValue="Sapphire (September)"
                    style={{ width: 120 }}
                    onChange={this.handleColorChange}
                  >
                    <Option value="9">Sapphire (September)</Option>
                    <Option value="10">Opal (October)</Option>

                    <Option value="1">Garnet (January)</Option>
                    <Option value="2">Amethyst (February)</Option>
                  </Select>
                </div>

                <div>
                  <label htmlFor="helper_level">Select a Level:</label>
                  <Select
                    required
                    id="helper_level"
                    defaultValue="1"
                    style={{ width: 120 }}
                    onChange={this.handleLevelChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </Select>
                </div>

                <div>
                  <label htmlFor="helper_grade_type">Select a Level:</label>
                  <Select
                    required
                    id="helper_grade_type"
                    defaultValue="D"
                    style={{ width: 120 }}
                    onChange={this.handleGradeTypeChange}
                  >
                    <option value="1">D</option>
                    <option value="2">C</option>
                    <option value="3">B</option>
                    <option value="4">A</option>
                    <option value="5">AA</option>
                    <option value="6">AAA</option>
                  </Select>
                </div>

                <div>
                  <label htmlFor="grade_value">Grade Value</label>
                  <Input
                    placeholder="1000000 or less."
                    type="number"
                    id="grade_value"
                    min="0"
                    max="999999"
                    required
                    value={this.state.gradeValue}
                    onChange={e => this.handleGradeValueChange(e.target.value)}
                    addonAfter={
                      <Icon type="sync" onClick={this.randomGradeValue} />
                    }
                  />
                </div>
              </fieldset>
              <Input type="submit" value="Mint" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Mint;
