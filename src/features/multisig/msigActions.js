import AccessMultiSigABI from '../../app/ABI/AccessMultiSig';
import {utils} from 'web3';

export const updateRole = (contractAddress, to, role) => async (dispatch, getState) => {
    const msigAccessContract = await getContractInstance(contractAddress, getState);
    const currentUserId = getState().auth.currentUserId;
    msigAccessContract.methods.updateRole(to , role).send({from: currentUserId})
      .on('transactionHash', hash => {
      })
      .on('receipt', receipt => {
      })
      .on('error', err => {
      });
};

export const updateFeatures = (contractAddress, maskString) => async (dispatch, getState) => {
    console.log("In function");
    const msigAccessContract = await getContractInstance(contractAddress, getState);
    console.log("msigAccessContract:", msigAccessContract);
    const currentUserId = getState().auth.currentUserId;
    console.log("call updateFeatures");
    msigAccessContract.methods.updateFeatures(maskString).send({from: currentUserId})
      .on('transactionHash', hash => {
      })
      .on('receipt', receipt => {
      })
      .on('error', err => {
      });
};

//params: address, uint256, uint256, uint8[], bytes32[], bytes32[]
export const updateMsig = (contractAddress, to, role, expiresOn, v, r, s) => async (dispatch, getState) => {
    const msigAccessContract = await getContractInstance(contractAddress, getState);
    const currentUserId = getState().auth.currentUserId;
    msigAccessContract.methods.updateMsig(to, role, expiresOn, v, r, s).send({from: currentUserId});
};

export const constructMsigRequest = (contractAddress, to, role, expiresOn) => async (dispatch, getState) => {
    const msigAccessContract = await getContractInstance(contractAddress, getState);
    return await msigAccessContract.methods.constructUpdateMsigRequest(to, role, expiresOn).call();
};

const getContractInstance = async (address, getState) => {
    const web3 = getState().app.web3;
    console.log("web3:", web3);
    return new web3.eth.Contract(
      AccessMultiSigABI.abi,
      address
    );
}

function extractEllipticCurveParameters(signature) {
    const parameters = {};
    parameters.r = "0x" + signature.slice(2, 66);
    parameters.s = "0x" + signature.slice(66, 130);
    parameters.v = utils.toBN("0x" + signature.slice(130, 132)).toNumber();
    return parameters;
}

export const signAndExtract = (message) => async (dispatch, getState) => {
    const web3 = getState().app.web3;
    const account = getState().auth.currentUserId;
    const signature = await web3.eth.sign(message, account);
    return extractEllipticCurveParameters(signature);
}