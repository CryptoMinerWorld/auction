import React, {Component} from "react";
import styled from "styled-components";
import GemSelectionCard from "./GemSelectionCard";
import InfiniteScroll from 'react-infinite-scroller';
import {compose} from "redux";
import connect from "react-redux/es/connect/connect";
import GemSelectionFilters from "./GemSelectionFilters";
import {gradeConverter, type} from "./propertyPaneStyles";
import {bindGem, processPlots} from "../plotActions";
import {ZERO_ADDRESS} from "../../../app/reduxConstants";
import {completedTx, ErrorTx, startTx} from "../../transactions/txActions";
import {parseTransactionHashFromError} from "../../transactions/helpers";

const select = store => ({
    unprocessedPlots : store.plots.userPlots && store.plots.userPlots.filter(plot => plot.currentPercentage - plot.processedBlocks > 0),
    plotService: store.app.plotService,
    miners: store.app.plotService && store.app.plotService.minerContracts
});

const plotsPerTx = 7;

export class ProcessAllPopup extends Component {

    state = {

    };

    componentDidMount() {
        const {handleProcessPlots, unprocessedPlots, plotService, miners} = this.props;
        if (!unprocessedPlots || !plotService) return;
        const plotIdsByMiners = plotService.groupPlotIdsByMiners(unprocessedPlots);
        plotIdsByMiners.forEach((minerPlotIds, index) => {
            for (let i = 0; i < Math.ceil(minerPlotIds.length / plotsPerTx); i++) {
                handleProcessPlots(minerPlotIds.slice(i*plotsPerTx, Math.min((i+1)*plotsPerTx, minerPlotIds.length)), miners[index]);
            }
        })
    }

    // componentDidUpdate(prevProps) {
    //     const {handleProcessPlots, unprocessedPlotIds} = this.props;
    //     if (!prevProps.unprocessedPlotIds && unprocessedPlotIds !== prevProps.unprocessedPlotIds) {
    //         for (let i = 0; i < Math.ceil(unprocessedPlotIds.length / 20); i++) {
    //             handleProcessPlots(unprocessedPlotIds.slice(i*20 + Math.min((i+1)*20, unprocessedPlotIds.length)));
    //         }
    //     }
    // }

    render() {
        const {unprocessedPlotIds} = this.props;
        return (
          <PopupContainer>
              <div>Unprocessed plots: {unprocessedPlotIds.length}</div>
              <div>Please confirm {Math.ceil(unprocessedPlotIds.length / plotsPerTx)} transactions to process all plots</div>
              <div>{plotsPerTx} plots are processed per transaction</div>
          </PopupContainer>
        );
    }
}

const PopupContainer = styled.div`
            @media (max-width: 600px) {
                font-size: 12px;
            }
        
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 0 1%;
            font-size: 14px;
            font-weight: bold;
            min-width: 320px;
            max-width: 520px;
        `;

export default compose(
  connect(
    select,
    {
        handleProcessPlots: processPlots
    }
  )
)(ProcessAllPopup);