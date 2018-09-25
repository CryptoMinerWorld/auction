import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "recompose";
import { onlyGemsInAuction, allMyGems } from "../dashboardActions";

const GemSortBox = ({ handleShowAllGems, handleShowGemsInAuction, match }) => (
  <div className="flex pv4">
    <NavLink
      to={`${match.url}/all`}
      className="ttu pr4"
      onClick={handleShowAllGems}
    >
      All My Gems
    </NavLink>
    <NavLink
      to={`${match.url}/live`}
      className="ttu pr4"
      onClick={handleShowGemsInAuction}
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
  withRouter,
  connect(
    null,
    actions
  )
)(GemSortBox);

GemSortBox.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string
  }).isRequired,
  handleShowAllGems: PropTypes.func.isRequired,
  handleShowGemsInAuction: PropTypes.func.isRequired
};
