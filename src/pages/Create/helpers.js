// export const handleApproveGemTransfer = (
//   _contract,
//   _approvedContract,
//   _tokenId
// ) =>
//   new Promise((resolve, reject) => {
//     _contract.approve(_approvedContract, _tokenId, (error, result) => {
//       if (!error) resolve(_tokenId, result);
//       else reject(error);
//     });
//   });

export const ethToWei = eth => Number((eth * 1000000000000000000).toFixed(20));

export const daysToMilliseconds = days => Number((days * 86400000).toFixed(20));

export const daysToSeconds = days => Number(days * 86400);

