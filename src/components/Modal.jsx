import { Modal } from 'antd';

export const showConfirm = (_tokenId, _handleBuyNow) => {
  Modal.warning({
    title: 'Please Make sure you have installed Metamask and are signed in.',
    content:
      'Once you pay for the Gem using Metamask, you will be redirected to your workshop, and it may take a few minutes for your new Gem to appear.',
    okText: 'Buy Now',
    maskClosable: true,
    keyboard: true,
    onOk() {
      _handleBuyNow(_tokenId);
    }
  });
};

export const showExpired = () => {
  Modal.error({
    title: 'This Auction No Longer Exists.',
    content:
      'The Item was most likely sold or you may have the wrong link.',
    okText: 'Take Me To My Workshop',
    maskClosable: false,
    keyboard: false,
    onOk() {
      window.location = 'https://cryptominerworld.com/workshop/';
    }
  });
};
