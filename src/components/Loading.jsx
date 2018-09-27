import React from "react";
import { Spin, Icon } from "antd";

const antIcon = (
  <Icon type="loading" style={{ fontSize: 24, color: "#e406a5" }} spin />
);

export default () => (
  <div className="w-100 h5 flex aic jcc">
    <Spin indicator={antIcon} />
  </div>
);
