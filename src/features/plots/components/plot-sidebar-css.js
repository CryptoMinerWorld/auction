import styled from "styled-components";
import buyNowImage from "../../../app/images/pinkBuyNowButton.png";

export const SidebarSection = styled.div`
    display: flex;
    align-items: center;
    color: white;
    background-color: #2B3035;
    padding: 4px 0px;
    
    @media(max-width: 599px) {
        height: 80px;
        margin: 0;
        flex: ${props => props.mobileFlex ? props.mobileFlex : "1"};
        flex-direction: ${props => props.mobileDirection ? props.mobileDirection : "row"};
        justify-content: space-evenly;
        display: ${props => props.isShown ? "flex" : "none" }
    }
    
    @media(min-width: 600px) {
        margin: 0 0 10px 0px;
        flex-direction: column;
        border-radius: ${props => props.selectedTab && props.selectedTab === "selected" ? "0 0 10px 0" : "0 10px 10px 0"};
    }
    
`;

export const BuyButton = styled.div`
    @media(max-width: 599px) {
        font-size: 11px;
        padding: 0;
    }

    opacity: ${props => props.disabled ? "0.5" : "1"};
    flex: 4;
    background-image: url(${buyNowImage});
    background-position: center center;
    width: 100%;
    height: 100%;
    text-align: center;
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    padding: 12px;
    cursor: ${props => props.disabled ? "default" : "pointer"};
    color: white;
    font-size: 16px
`;

export const Sidebar = styled.div`
    @media(max-width: 599px) {
        width: 100%;
        flex-wrap: wrap;
        bottom: 0;
        flex-direction: row;
        position: fixed;
        padding: 0px;
        z-index: 15;
    }
    
    @media(min-width: 600px) {
        flex-direction: column;    
        width: 150px;
        align-items: stretch;
    }

    display: flex;
    background-color: #383F45;
    font-size: 14px;
    padding: 5px 5px 5px 0;
    position: relative;
    color: white
`;

export const SidebarIcon = styled.div`

    @media(max-width: 599px) {
        padding: 29px 15px;
        background-size: contain;
        
        &:nth-child(2) {
            padding: 29px 22px;
        }
        
        &:only-child {
            padding: 29px 20px;
        }
    }
    
    margin: 3px 0;
    background-size: contain;
    background-image: url(${props => props.icon});
    background-position: center center;
    text-align: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    padding: 45px 45px;
    cursor: pointer;
    color: white;
    font-size: 16px;     
    opacity: ${props => props.disabled ? "0.25" : "1"};       
`;

export const SidebarTabs = styled.div`
   @media(max-width: 599px) {
        width: 100%;
        font-size: 14px;
   }
   display: flex;
`;

export const SidebarTab = styled.div`
    flex: 1;
    ${props => props.selected ? 'background-color: #2B3035;' : ''}
    ${props => props.selected ? 'border-radius: 5px 5px 0 0;' : ''}
    padding: 5px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
`;

export const ProcessAllInfo = styled.div`
    @media(max-width: 599px) {
        display: none;
    }
`;

export const ProcessAllButtonInfo = styled.span`
    @media(min-width: 600px) {
        display: none;
    }
`;