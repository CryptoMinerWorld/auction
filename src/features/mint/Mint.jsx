import React, {PureComponent} from 'react';
import {Observable} from 'rxjs';
import getWeb3 from '../../app/utils/getWeb3';
import {db, storage} from '../../app/utils/firebase';
import DisplayCard from './DisplayCard';
import MintForm from './MintForm';
import MintHelper from './../../app/ABI/MintHelper';
import ChestFactory from './../../app/ABI/ChestFactory';
import {Button, Input} from "antd";

class Mint extends PureComponent {
    state = {
        contractAddress: process.env.REACT_APP_MINT_HELPER,
        color: '9',
        level: '1',
        gradeType: '1',
        gradeValue: 1,
        gemDetails: 'hello',
        gemImage: 'https://via.placeholder.com/350x350',
        imageLoading: false,
        chestValue: 0,
    };

    async componentDidMount() {
        getWeb3.then(results => this.setState({
            web3: results.web3,
        }));
        this.randomGradeValue();

        this.getImage().subscribe(({image}) => this.setState({
            gemImage: image,
        }));
    }

    gemURL = (color, level, gradeType) => {
        this.setState({imageLoading: true});

        const type = {
            1: 'Gar',
            2: 'Ame',
            3: 'Aqu',
            4: 'Dia',
            5: 'Eme',
            6: 'Pea',
            7: 'Rub',
            8: 'Per',
            9: 'Sap',
            10: 'Opa',
            11: 'Top',
            12: 'Tur',
        }[color];

        const grade = {
            1: 'D',
            2: 'C',
            3: 'B',
            4: 'A',
            5: 'AA',
            6: 'AAA',
        }[gradeType];
        const fileName = `${type}-${level}-${grade}-4500.png`;

        storage
          .ref(`gems512/${fileName}`)
          .getDownloadURL()
          .then((url) => {
              this.setState({gemImage: url, imageLoading: false});
          })
          .catch((err) => {
              // eslint-disable-next-line
              console.error(err);
          });
    };

    getImage = () => Observable.create((observer) => {
        const unsubscribe = db
          .collection('gems')
          .where('id', '==', '123')
          .onSnapshot(collection => collection.docs.map(doc => observer.next(doc.data())));
        return unsubscribe;
    });

    createGem = async (_contractAddress, _color, _level, _gradeType, _gradeValue) => {
        const {web3, contractAddress} = this.state;

        const currentAccount = await web3.eth.getAccounts().then(accounts => accounts[0]);
        const mintContractInstance = new web3.eth.Contract(MintHelper.abi, contractAddress, {
            from: currentAccount,
        });
        await mintContractInstance.methods.mint(_color, _level, _gradeType).send();
    };

    createFoundersChest = async (value) => {
        const {web3} = this.state;
        const currentAccount = await web3.eth.getAccounts().then(accounts => accounts[0]);
        const chestFactoryContract = new web3.eth.Contract(ChestFactory.abi,
          process.env.REACT_APP_CHEST_FACTORY, {from: currentAccount});
        await chestFactoryContract.methods.createChest(true)
          .send({
              from: currentAccount,
              value: value,
          })
    };

    // eslint-disable-next-line
    handleSubmit = (_contractAddress, _color, _level, _gradeType, _gradeValue) => this.createGem(_contractAddress, _color, _level, _gradeType, _gradeValue);

    handleNetworkChange = value => this.setState({contractAddress: value});

    handleChange = quality => (value) => {
        this.setState({[quality]: value}, () => {
            const {color, level, gradeType} = this.state;
            this.gemURL(color, level, gradeType);
        });
    };

    handleGradeValueChange = value => this.setState({gradeValue: value});
    handleChestValueChange = value => this.setState({chestValue: value});
    handleChestIdChange = value => this.setState({chestId: value});

    randomGradeValue = () => this.setState({gradeValue: Math.floor(1000000 * Math.random())});

    render() {
        const {
            gradeValue,
            contractAddress,
            color,
            level,
            gradeType,
            gemDetails,
            gemImage,
            imageLoading,
            chestValue,
        } = this.state;

        return (
          <div className="ma0 pa0">
              <div className="mw9 center flex jcc aic">
                  <div className="pa5 flex jcc row aic">
                      <MintForm
                        randomGradeValue={this.randomGradeValue}
                        handleNetworkChange={this.handleNetworkChange}
                        contractAddress={contractAddress}
                        color={color}
                        level={level}
                        gradeType={gradeType}
                        gradeValue={gradeValue}
                        handleChange={this.handleChange}
                        handleGradeValueChange={this.handleGradeValueChange}
                        gemDetails={gemDetails}
                        handleSubmit={this.handleSubmit}
                      />
                      <div/>
                      <DisplayCard gemImage={gemImage} imageLoading={imageLoading}/>
                  </div>
              </div>
              <div className="mw4 center white flex">
                  Value: <Input
                placeholder="In WEI"
                type="number"
                style={{width: "300px", marginRight: "20px"}}
                value={chestValue}
                onChange={e => this.handleChestValueChange(e.target.value)}
              />
                  <Button onClick={() => this.createFoundersChest(chestValue)}>Create Chest</Button>
              </div>
          </div>
        );
    }
}

export default Mint;
