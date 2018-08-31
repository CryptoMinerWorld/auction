export const handleApproveGemTransfer = (
  _contract,
  _approvedContract,
  _tokenId
) =>
  new Promise((resolve, reject) => {
    _contract.approve(_approvedContract, _tokenId, (error, result) => {
      if (!error) resolve(_tokenId, result);
      else reject(error);
    });
  });
