import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "recompose";
import { onlyGemsInAuction, allMyGems } from "../dashboardActions";

const GemSortBox = ({ handleShowAllGems, handleShowGemsInAuction, match }) => (
  <div className="flex pv4">
    <NavLink
      exact
      to={`${match.url}`}
      className="ttu link white mh3 tc"
      onClick={handleShowAllGems}
      activeStyle={{ borderBottom: "1px solid purple" }}
    >
      All My Gems
    </NavLink>
    <NavLink
      exact
      to={`${match.url}/live`}
      className="ttu link white mh3 tc"
      onClick={handleShowGemsInAuction}
      activeStyle={{ borderBottom: "1px solid purple" }}
    >
      Only The Ones In Auction
    </NavLink>
  </div>
);

const actions = {
  handleShowAllGems: allMyGems,
  handleShowGemsInAuction: onlyGemsInAuction
};

export default compose(
  connect(
    null,
    actions,
    null,
    { pure: false }
  ),
  withRouter
)(GemSortBox);

GemSortBox.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string
  }).isRequired,
  handleShowAllGems: PropTypes.func.isRequired,
  handleShowGemsInAuction: PropTypes.func.isRequired
};
