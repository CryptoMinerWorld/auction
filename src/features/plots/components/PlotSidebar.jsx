import React, {Component} from "react";
import artifactIcon from "../../../app/images/artifactIcon.png";
import filterIcon from "../../../app/images/filterIconNew.png";
import gemIcon from "../../../app/images/singleGemIconNew.png";
import gemsIcon from "../../../app/images/gemIconNew.png"
import plotsIcon from "../../../app/images/plotIconNew.png";
import plotIcon from "../../../app/images/singlePlotIconNew.png";
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
        isShown: false
    };

    shouldComponentUpdate(props, state) {
        return state.selectedTab !== this.state.selectedTab ||
            props.plotSelected !== this.props.plotSelected ||
            props.isOwner !== this.props.isOwner ||
            state.isShown !== this.state.isShown
    }

    componentDidUpdate(prevProps) {
        if (this.props.plotSelected && this.props.plotSelected !== prevProps.plotSelected) {
            this.setState({selectedTab: "selected"});
        }
    }


    render() {
        const {plotSelected, isOwner, totalUnprocessedBlocksNumber} = this.props;
        const {selectedTab, isShown} = this.state;
        const isSelectedTabActive = selectedTab === "selected";
        const disableSidebarIcons = ((isSelectedTabActive) && !plotSelected) || !isOwner;
        const disableSidebarGemIcon = ((isSelectedTabActive) && (!plotSelected || (plotSelected && !plotSelected.gemMines))) || !isOwner;
        const handleAllTabClick = () => selectedTab === "all" && isShown ? this.setState({isShown: false}) : this.setState({
            selectedTab: "all",
            isShown: true
        });
        const handleSelectedTabClick = () => isSelectedTabActive && isShown ? this.setState({isShown: false}) : this.setState({
            selectedTab: "selected",
            isShown: true
        });
        return (
            <Sidebar>
                <SidebarTabs>
                    <SidebarTab onClick={handleAllTabClick}
                                selected={selectedTab === "all"}>
                        ALL
                    </SidebarTab>
                    <SidebarTab onClick={handleSelectedTabClick}
                                selected={isSelectedTabActive}>
                        Selected
                    </SidebarTab>
                </SidebarTabs>
                <SidebarSection selectedTab={selectedTab} mobileFlex={4} mobileDirection={"row"} isShown={isShown}>
                    <SidebarIcon disabled={disableSidebarIcons} icon={isSelectedTabActive ? plotIcon : plotsIcon}
                                 onClick={() => !disableSidebarIcons && this.props.showSidebarPopup("plots-" + selectedTab)}/>
                    <SidebarIcon disabled={disableSidebarGemIcon} icon={isSelectedTabActive ? gemIcon : gemsIcon}
                                 onClick={() => !disableSidebarGemIcon && this.props.showSidebarPopup("gems-" + selectedTab)}/>
                    <SidebarIcon disabled={true} icon={artifactIcon} style={{margin: "10px 0"}}
                                 onClick={() => this.props.showSidebarPopup("coming-soon")}
                    />
                </SidebarSection>
                <SidebarSection mobileFlex={3} mobileDirection={"column"} isShown={isShown}>
                    <BuyButton disabled={disableSidebarIcons}>
                        {!disableSidebarIcons ? <a style={{width: "100%", color: "white"}} href={'/plots'}>BUY PLOTS</a> : "BUY PLOTS"}
                        </BuyButton>
                    <ProcessAllInfo
                        style={{fontSize: "14px", lineHeight: "1.3"}}>{totalUnprocessedBlocksNumber}</ProcessAllInfo>
                    <ProcessAllInfo style={{color: "#828689", lineHeight: "1"}}>Unprocessed Blocks</ProcessAllInfo>
                    <BuyButton disabled={disableSidebarIcons} onClick={() => !disableSidebarIcons && this.props.showSidebarPopup("process-all")}>
                        PROCESS ALL <ProcessAllButtonInfo>({totalUnprocessedBlocksNumber})</ProcessAllButtonInfo>
                    </BuyButton>
                </SidebarSection>
                <SidebarSection mobileFlex={1} mobileDirection={"row"} isShown={isShown}>
                    <SidebarIcon icon={filterIcon} onClick={() => this.props.showSidebarPopup("filter")}/>
                </SidebarSection>
            </Sidebar>
        )
    }
}

export default PlotSidebar;