import React, {Component} from "react";
import styled from "styled-components";
import {compose} from "redux";
import connect from "react-redux/es/connect/connect";
import {processPlots} from "../plotActions";

const select = store => ({
    unprocessedPlots: store.plots.userPlots && store.plots.userPlots.filter(plot => plot.currentPercentage - plot.processedBlocks > 0),
    plotService: store.app.plotService,
    miners: store.app.plotService && store.app.plotService.minerContracts
});

const plotsPerTx = 7;

export class ProcessAllPopup extends Component {

    state = {
        plotIdsByMiners: [[], []]
    };

    componentDidMount() {
        const {handleProcessPlots, unprocessedPlots, plotService, miners} = this.props;
        if (!unprocessedPlots || !plotService) return;
        const plotIdsByMiners = plotService.groupPlotIdsByMiners(unprocessedPlots);
        console.info("Did mount:", plotIdsByMiners, unprocessedPlots);
        plotIdsByMiners.forEach((minerPlotIds, index) => {
            for (let i = 0; i < Math.ceil(minerPlotIds.length / plotsPerTx); i++) {
                handleProcessPlots(minerPlotIds.slice(i * plotsPerTx, Math.min((i + 1) * plotsPerTx, minerPlotIds.length)), miners[index]);
            }
        });
        this.setState({plotIdsByMiners});
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
        const {unprocessedPlots} = this.props;
        const {plotIdsByMiners} = this.state;
        return (
          <PopupContainer>
              <div>Unprocessed plots: {unprocessedPlots.length}</div>
              {plotIdsByMiners[1] && plotIdsByMiners[1].length > 0 &&
              <div>Plots mined with country gems: {plotIdsByMiners[1].length} of {unprocessedPlots.length}</div>
              }
              <div>{`Please confirm `}
                  {Math.ceil(plotIdsByMiners[0].length / plotsPerTx) + (plotIdsByMiners[1] ? Math.ceil(plotIdsByMiners[1].length / plotsPerTx) : 0)}
                  {` transactions to process all plots`}
              </div>
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