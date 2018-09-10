import React, { PureComponent } from 'react';
import { Select, Input, Icon } from 'antd';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs'
import getWeb3 from '../../utils/getWeb3';
import { db, storage } from '../../utils/firebase'

const { Option } = Select;

const mintABI = [
  {
    constant: false,
    inputs: [
      {
        name: 'color',
        type: 'uint8',
      },
      {
        name: 'level',
        type: 'uint8',
      },
      {
        name: 'gradeType',
        type: 'uint8',
      },
      {
        name: 'gradeValue',
        type: 'uint24',
      },
    ],
    name: 'mint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

class Mint extends PureComponent {
  state = {
    contractAddress: '0x6afd5f5f431279b0cac7f5ff406f13d804b183c9',
    color: '9',
    level: '1',
    gradeType: '1',
    gradeValue: '',
    gemDetails: `hello`,
    gemImage: `http://placekitten.com/g/600/300`,
    imageLoading: false
  };

  async componentDidMount() {
    getWeb3.then(results =>
      this.setState({
        web3: results.web3,
      })
    );
    this.randomGradeValue();

    this.getImage().subscribe(({ id, image }) =>
      this.setState({
        gemDetails: id,
        gemImage: image
      }))
  }

  gemURL = (color, level, gradeType) => {
    this.setState({ imageLoading: true })

    const type = {
      9: 'Sap',
      10: 'Opa',
      1: 'Gar',
      2: 'Ame',
    }[color]

    const grade = {
      1: 'D',
      2: 'C',
      3: 'B',
      4: 'A',
      5: 'AA',
      6: 'AAA',
    }[gradeType]


    const fileName = `${type} ${level} ${grade}.png`;

    storage
      .ref(`gems/${fileName}`)
      .getDownloadURL()
      .then(url => this.setState({ gemImage: url, imageLoading: false }))
      .catch(err => {
        // eslint-disable-next-line
        console.error(err)
      })

  }

  getImage = () => Observable.create(observer => {
    const unsubscribe = db.collection('gems').where("id", "==", "123").onSnapshot(collection => collection.docs.map(doc => observer.next(doc.data())))
    return unsubscribe
  })

  // componentDidUpdate () {
  //   this.getImage().unsubscribe()
  // }


  // getImage = () => {
  //   db.collection('gems').where("id", "==", "123").get()
  //     .then(collection => {
  //       const details = collection.docs.map(doc => doc.data())
  //       const { id, image } = details[0]
  //       this.setState({
  //         gemDetails: id,
  //         gemImage: image
  //       })
  //     }).catch(err => console.error(err))
  // }

  createGem = async (_contractAddress, _color, _level, _gradeType, _gradeValue) => {
    const { web3, contractAddress } = this.state

    const currentAccount = await web3.eth.getAccounts().then(accounts => accounts[0]);
    const mintContractInstance =
      new web3.eth.Contract(mintABI, contractAddress, {
        from: currentAccount
      });
    await mintContractInstance.methods.mint(_color, _level, _gradeType, _gradeValue).send()
  };

  // eslint-disable-next-line
  handleSubmit = (_contractAddress, _color, _level, _gradeType, _gradeValue) =>
    this.createGem(_contractAddress, _color, _level, _gradeType, _gradeValue);

  handleNetworkChange = value => this.setState({ contractAddress: value });

  handleColorChange = value => {
    // const { color, level, gradeType } = this.state
    // eslint-disable-next-line
    this.setState({ color: value }, () => this.gemURL(this.state.color, this.state.level, this.state.gradeType));
  }

  handleLevelChange = value => {
    // const { color, level, gradeType } = this.state
    // eslint-disable-next-line
    this.setState({ level: value }, () => this.gemURL(this.state.color, this.state.level, this.state.gradeType));
  }

  handleGradeTypeChange = value => {
    // const { color, level, gradeType } = this.state
    // eslint-disable-next-line
    this.setState({ gradeType: value }, () => this.gemURL(this.state.color, this.state.level, this.state.gradeType));
  }

  handleGradeValueChange = value => this.setState({ gradeValue: value });

  randomGradeValue = () => this.setState({ gradeValue: Math.floor(1000000 * Math.random()) });

  render() {
    const { gradeValue, contractAddress, color, level, gradeType, gemDetails, gemImage, imageLoading } = this.state;
    return (
      <div className="ma0 pa0">
        <div className="mw9 center flex jcc aic">
          <div className="pa5 flex jcc col aic">
            <MintForm
              randomGradeValue={this.randomGradeValue}
              handleNetworkChange={this.handleNetworkChange} contractAddress={contractAddress}
              color={color}
              level={level}
              gradeType={gradeType}
              gradeValue={gradeValue}
              handleColorChange={this.handleColorChange}
              handleLevelChange={this.handleLevelChange}
              handleGradeTypeChange={this.handleGradeTypeChange}
              handleGradeValueChange={this.handleGradeValueChange}
              gemDetails={gemDetails}
              handleSubmit={this.handleSubmit} />

          </div>
          <DisplayCard gemDetails={gemDetails} gemImage={gemImage} imageLoading={imageLoading} />
        </div>
      </div >
    );
  }
}

export default Mint;


const MintForm = ({ randomGradeValue, handleNetworkChange, contractAddress, color, level, gradeType, gradeValue, handleColorChange, handleLevelChange, handleGradeTypeChange, handleSubmit, handleGradeValueChange }) => (
  <form
    id="mint_form"
    className="bg-white br3"
    onSubmit={e => {
      e.preventDefault();
      handleSubmit(contractAddress, color, level, gradeType, gradeValue);
    }}
  >
    <fieldset>
      <legend>Mint A New Gem</legend>
      <div>
        <label htmlFor="helper_address">
          Select Network:
                    <Select
            required
            id="helper_address"
            defaultValue="rinkeby"
            style={{ width: 120 }}
            onChange={handleNetworkChange}
          >
            <Option value="0x6afd5f5f431279b0cac7f5ff406f13d804b183c9">Rinkeby</Option>
            <Option value="0x0">Mainnet</Option>
          </Select>
        </label>
      </div>
      <div>
        <label htmlFor="helper_color">
          Select a Color:
                    <Select
            required
            id="helper_color"
            defaultValue="Sapphire (September)"
            style={{ width: 120 }}
            onChange={handleColorChange}
          >
            <Option value="9">Sapphire (September)</Option>
            <Option value="10">Opal (October)</Option>

            <Option value="1">Garnet (January)</Option>
            <Option value="2">Amethyst (February)</Option>
          </Select>
        </label>
      </div>

      <div>
        <label htmlFor="helper_level">
          Select a Level:
                    <Select
            required
            id="helper_level"
            defaultValue="1"
            style={{ width: 120 }}
            onChange={handleLevelChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </Select>
        </label>
      </div>

      <div>
        <label htmlFor="helper_grade_type">
          Select a Grade:
                    <Select
            required
            id="helper_grade_type"
            defaultValue="D"
            style={{ width: 120 }}
            onChange={handleGradeTypeChange}
          >
            <option value="1">D</option>
            <option value="2">C</option>
            <option value="3">B</option>
            <option value="4">A</option>
            <option value="5">AA</option>
            <option value="6">AAA</option>
          </Select>
        </label>
      </div>

      <div>
        <label htmlFor="grade_value">
          Grade Value
                    <Input
            placeholder="1000000 or less."
            type="number"
            id="grade_value"
            min="0"
            max="999999"
            required
            value={gradeValue}
            onChange={e => handleGradeValueChange(e.target.value)}
            addonAfter={<Icon type="sync" onClick={randomGradeValue} />}
          />
        </label>
      </div>
    </fieldset>
    <Input type="submit" value="Mint" className='pointer' />
  </form>
)

MintForm.propTypes = {
  contractAddress: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  gradeType: PropTypes.string.isRequired,
  gradeValue: PropTypes.number.isRequired,
  handleColorChange: PropTypes.func.isRequired,
  handleLevelChange: PropTypes.func.isRequired, handleGradeTypeChange: PropTypes.func.isRequired,
  handleNetworkChange: PropTypes.func.isRequired,
  randomGradeValue: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleGradeValueChange: PropTypes.func.isRequired,
}



const DisplayCard = ({ gemDetails, gemImage, imageLoading }) =>
  <article className="br2 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw5 center bg-white">
    {imageLoading ? <p>loading...</p> : <img src={gemImage} className="db w-100 br2 br--top" alt="kitten looking menacing." />}
    <div className="pa2 ph3-ns pb3-ns">
      <div className="dt w-100 mt1">
        <div className="dtc">
          <h1 className="f5 f4-ns mv0">Cat</h1>
        </div>
        <div className="dtc tr">
          <h2 className="f5 mv0">$1,000</h2>
        </div>
      </div>
      <p className="f6 lh-copy measure mt2 mid-gray">

        {gemDetails}
      </p>
    </div>
  </article>


DisplayCard.propTypes = {
  gemDetails: PropTypes.string.isRequired,
  gemImage: PropTypes.string.isRequired,
  imageLoading: PropTypes.bool.isRequired,
}

