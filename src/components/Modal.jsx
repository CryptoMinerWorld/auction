const Modal = require("antd/lib/modal");
require("antd/lib/modal/style/css");

export const confirmInMetamask = () => {
  Modal.info({
    title: "Please Confirm Your Transaction In Metamask to Proceed",
    content:
      "Once you pay for the Gem using Metamask, you will be redirected to your workshop. This may take a few moments. Thank you for your patience.",

    maskClosable: false,
    keyboard: false,
    iconType: "loading",
    zIndex: 1000,
    okText: false
  });
};

export const showConfirm = (_handleBuyNow, _tokenId, currentAccount) => {
  Modal.warning({
    title: "Please Make sure you have installed Metamask and are signed in.",
    content:
      "Once you pay for the Gem using Metamask, you will be redirected to your workshop, and it may take a few minutes for your new Gem to appear.",
    okText: "Buy Now",
    maskClosable: true,
    keyboard: true,
    onOk() {
      _handleBuyNow(_tokenId, currentAccount);
    }
  });
};

export const showExpired = () => {
  Modal.error({
    title: "This Auction No Longer Exists.",
    content: "The Item was most likely sold or you may have the wrong link.",
    okText: "Take Me To My Workshop",
    maskClosable: false,
    keyboard: false,
    onOk() {
      window.location = "https://cryptominerworld.com/workshop/";
    }
  });
};
