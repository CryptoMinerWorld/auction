import React from 'react';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#e406a5' }} spin />;



export default ({hidden}) => {
  return (
    <div className="w-100 h5 flex aic jcc"
         style={{
             opacity: hidden ? '0' : '1',
             transition: 'opacity 2s',
             WebkitTransition: 'opacity 2s',
         }}>
        <Spin indicator={antIcon}/>
    </div> );
}
