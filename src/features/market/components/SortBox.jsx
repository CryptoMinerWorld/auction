import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "recompose";
import {
  getSoonestAuctions,
  getLowestAuctions,
  getHighestAuctions
} from "../marketActions";

const SortBox = ({
  match,
  handleGetSoonest,
  handleGetLowest,
  handleGetHighest
}) => (
  <div className="flex pv4">
    <NavLink
      to={`${match.url}/soonest`}
      className="ttu pr4"
      onClick={handleGetSoonest}
    >
      finishing soonest
    </NavLink>
    <NavLink
      to={`${match.url}/lowest`}
      className="ttu pr4"
      onClick={handleGetLowest}
    >
      lowest price
    </NavLink>
    <NavLink
      to={`${match.url}/highest`}
      className="ttu pr4"
      onClick={handleGetHighest}
    >
      highest price
    </NavLink>
  </div>
);

const actions = {
  handleGetSoonest: getSoonestAuctions,
  handleGetLowest: getLowestAuctions,
  handleGetHighest: getHighestAuctions
};

export default compose(
  withRouter,
  connect(
    null,
    actions
  )
)(SortBox);

SortBox.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string
  }).isRequired,
  handleGetSoonest: PropTypes.func.isRequired,
  handleGetLowest: PropTypes.func.isRequired,
  handleGetHighest: PropTypes.func.isRequired
};
