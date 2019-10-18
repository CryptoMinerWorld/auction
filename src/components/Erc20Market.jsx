import React from 'react';

const Iframe = ({src, height, width}) => {
    return (
      <div style={{marginBottom: "-8px", overflowX: "hidden"}}>
          <iframe src={src} height={height} width={width-13} style={{border: "0"}}/>
      </div>
    )
}

export const Erc20Market = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    return (
      <Iframe src={"https://market-backend.firebaseapp.com/#/erc20"} height={height} width={width}/>
    )
}