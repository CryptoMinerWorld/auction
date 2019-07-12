import React, {Component} from "react";
import styled from "styled-components";
import buyNowImage from "../../../app/images/pinkBuyNowButton.png";
import stubIcon from "./../../../app/images/icons/gem1.png";
import artifactIcon from "../../../app/images/artifactIcon.png";
import filterIcon from "../../../app/images/filterIconNew.png";
import gemIcon from "../../../app/images/singleGemIconNew.png";
import gemsIcon from "../../../app/images/gemIconNew.png"
import plotsIcon from "../../../app/images/plotIconNew.png";
import plotIcon from "../../../app/images/singlePlotIconNew.png";
import {Link} from "react-router-dom";
import {
    BuyButton,
    ProcessAllButtonInfo,
    ProcessAllInfo,
    Sidebar,
    SidebarIcon,
    SidebarSection,
    SidebarTab,
    SidebarTabs
} from "./plot-sidebar-css"


class PlotSidebar extends Component {

    state = {
        showSidebarFilters: false,
        selectedTab: "all",
    };

    shouldComponentUpdate(props, state) {
        return state.selectedTab !== this.state.selectedTab || props.plotSelected !== this.props.plotSelected || props.isOwner !== this.props.isOwner;
    }

    componentDidUpdate(prevProps) {
        if (this.props.plotSelected && this.props.plotSelected !== prevProps.plotSelected) {
            this.setState({selectedTab: "selected"});
        }
    }

    render() {
        const {plotSelected, isOwner, totalUnprocessedBlocksNumber} = this.props;
        const {selectedTab} = this.state;
        const selectedIsActive = selectedTab === "selected";
        const disableSidebarIcons = ((selectedIsActive) && !plotSelected) || !isOwner;
        const disableSidebarGemIcon = ((selectedIsActive) && (!plotSelected || (plotSelected && !plotSelected.gemMines))) || !isOwner;
        return (
            <Sidebar>
                <SidebarTabs>
                    <SidebarTab onClick={() => this.setState({selectedTab: "all"})}
                                selected={selectedTab === "all"}>
                        ALL
                    </SidebarTab>
                    <SidebarTab onClick={() => this.setState({selectedTab: "selected"})}
                                selected={selectedIsActive}>
                        Selected
                    </SidebarTab>
                </SidebarTabs>
                <SidebarSection selectedTab={selectedTab} mobileFlex={4} mobileDirection={"row"}>
                    <SidebarIcon disabled={disableSidebarIcons} icon={selectedIsActive ? plotIcon : plotsIcon}
                                 onClick={() => !disableSidebarIcons && this.props.showSidebarPopup("plots-" + selectedTab)}/>
                    <SidebarIcon disabled={disableSidebarGemIcon} icon={selectedIsActive ? gemIcon : gemsIcon}
                                 onClick={() => !disableSidebarGemIcon && this.props.showSidebarPopup("gems-" + selectedTab)}/>
                    <SidebarIcon disabled={true} icon={artifactIcon} style={{margin: "10px 0"}}
                                 onClick={() => this.props.showSidebarPopup("coming-soon")}
                    />
                </SidebarSection>
                <SidebarSection mobileFlex={3} mobileDirection={"column"}>
                    <BuyButton><a style={{width: "100%", color: "white"}} href={'/plots'}>BUY PLOTS</a></BuyButton>
                    <ProcessAllInfo
                        style={{fontSize: "14px", lineHeight: "1.3"}}>{totalUnprocessedBlocksNumber}</ProcessAllInfo>
                    <ProcessAllInfo style={{color: "#828689", lineHeight: "1"}}>Unprocessed Blocks</ProcessAllInfo>
                    <BuyButton onClick={() => this.props.showSidebarPopup("process-all")}>
                        PROCESS ALL <ProcessAllButtonInfo>({totalUnprocessedBlocksNumber})</ProcessAllButtonInfo>
                    </BuyButton>
                </SidebarSection>
                <SidebarSection mobileFlex={1} mobileDirection={"row"}>
                    <SidebarIcon icon={filterIcon} onClick={() => this.props.showSidebarPopup("filter")}/>
                </SidebarSection>
            </Sidebar>
        )
    }
}

export default PlotSidebar;