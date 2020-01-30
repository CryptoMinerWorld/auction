import React from "react"
import Spin from "antd/lib/spin";
import Icon from "antd/lib/icon";
import Gold from "../../../app/images/dashboard/Gold.png";
import Silver from "../../../app/images/dashboard/Silver.png";
import gemCombinationButtonImage from "../../../app/images/dashboard/gemCombinationButton.png";
import {Avatar, SilverGoldBalance, Username, GemCombinationButton} from "./status-bar-css"

const StatusBar = ({dashboardUser, userBalance, currentUserId, openGemsCombinePopup}) => {
    return (
        <div className="flex aic wrap jcb relative">
            <div className=" flex aic pt0-ns">
                {dashboardUser && dashboardUser.imageURL ?
                    <Avatar src={dashboardUser.imageURL} className="dib" alt=""/> :
                    <Spin indicator={
                        <Icon type="loading" style={{fontSize: 24, color: '#e406a5'}} spin/>}
                    />
                }
                <Username data-testid="userName">
                    {dashboardUser && dashboardUser.name || "Loading..."}
                </Username>
            </div>
            {dashboardUser && currentUserId === dashboardUser.walletId ? 
            <GemCombinationButton src={gemCombinationButtonImage} onClick={openGemsCombinePopup}/>
            :""}
            <SilverGoldBalance className="flex col tc b">
                <div className="flex">
                    <div className="flex col justify-center-ns"
                         style={{color: "#FFCC1C", lineHeight: "1.3", paddingRight: "10px"}}>
                        <img src={Gold} alt="Gold" className="h3 w-auto ph3"/>
                        <span id="gold-label">GOLD</span>
                        <span>{userBalance && userBalance.goldAvailable}</span>
                    </div>
                    <div className="flex col justify-center-ns"
                         style={{color: "#C3D6FA", lineHeight: "1.3", paddingRight: "10px"}}>
                        <img src={Silver} alt="Silver" className="h3 w-auto ph3"/>
                        <span id="silver-label">SILVER</span>
                        <span>{userBalance && userBalance.silverAvailable}</span>
                    </div>
                </div>
            </SilverGoldBalance>
        </div>
    );
};

export default StatusBar;
