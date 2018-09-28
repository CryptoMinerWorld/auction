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

const SortBox = ({ handleGetSoonest, handleGetLowest, handleGetHighest }) => (
  <div className="flex pv4 ">
    <NavLink
      exact
      to="/market"
      className="ttu mr4 white o-90 link"
      onClick={handleGetSoonest}
      activeStyle={{ borderBottom: "1px solid purple" }}
    >
      finishing soonest
    </NavLink>
    <NavLink
      exact
      to="/market/lowest"
      className="ttu mr4 white o-90 link"
      onClick={handleGetLowest}
      activeStyle={{ borderBottom: "1px solid purple" }}
    >
      lowest price
    </NavLink>
    <NavLink
      exact
      to="/market/highest"
      className="ttu mr4 white o-90 link"
      onClick={handleGetHighest}
      activeStyle={{ borderBottom: "1px solid purple" }}
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
  connect(
    null,
    actions,
    null,
    { pure: false }
  ),
  withRouter
)(SortBox);

SortBox.propTypes = {
  handleGetSoonest: PropTypes.func.isRequired,
  handleGetLowest: PropTypes.func.isRequired,
  handleGetHighest: PropTypes.func.isRequired
};
