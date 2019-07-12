import React from "react"
import Spin from "antd/lib/spin";
import Icon from "antd/lib/icon";
import Gold from "../../../app/images/dashboard/Gold.png";
import Silver from "../../../app/images/dashboard/Silver.png";
import styled from "styled-components";

const Avatar = styled.img`
    @media(max-width: 800px) {
        height: 2rem;
        width: auto;
    }
    
    @media(min-width: 801px) {
        height: 4rem;
        width: auto;
    }
`;

const SilverGoldBalance = styled.div`
    @media(min-width: 900px) {
        position: absolute;
        right: 0;
        top: 15px;
        z-index: 2;
    }
`;



const StatusBar = ({dashboardUser, userBalance}) => {
    return (
        <div className="flex aic wrap jcc jcb-ns relative">
            <div className=" flex aic pt3 pt0-ns">
                {dashboardUser && dashboardUser.imageURL ?
                    <Avatar src={dashboardUser.imageURL} className="pr3 pl3-ns dib" alt=""/> :
                    <Spin indicator={
                        <Icon type="loading" style={{fontSize: 24, color: '#e406a5'}} spin/>}
                    />
                }
                <h1 className="white" data-testid="userName" style={{margin: "10px 0"}}>
                    {dashboardUser && dashboardUser.name || "Loading..."}
                </h1>
            </div>
            <SilverGoldBalance className="flex col tc">
                <div className="flex">
                    <div className="flex col tc">
                        <img src={Gold} alt="Gold" className="h3 w-auto ph3"/>
                        {userBalance && userBalance.goldAvailable}
                    </div>
                    <div className="flex col tc">
                        <img src={Silver} alt="Silver" className="h3 w-auto ph3"/>
                        {userBalance && userBalance.silverAvailable}
                    </div>
                </div>
            </SilverGoldBalance>
        </div>
    );
};

export default StatusBar;
