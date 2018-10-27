import React from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Icon from 'antd/lib/icon';
import { connect } from 'react-redux';

import { toggleGem } from '../marketActions';

const select = store => ({
  filterLoading: store.marketActions.filterLoading,
  selection: store.marketActions.gems,
});

const Loading = () => <Icon type="loading" style={{ fontSize: 24, color: '#bb207e' }} spin />;

const Filters = ({ handleToggleGem, filterLoading, selection }) => (
  <div className="w-100">
    <div>
      <ReactCSSTransitionGroup
        transitionName="example1"
        transitionAppear
        transitionAppearTimeout={5000}
        transitionEnterTimeout={5000}
        transitionLeaveTimeout={5000}
      >
        <div
          className=" pa3 bg-dark-pink-50 relative pl4 b left-2"
          style={{
            clipPath:
              window.screen.availWidth >= 1920
                ? 'polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)'
                : 'polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 100% 100%, 100% 90%, 100% 14%, 100% 0, 96% 0, 5% 0%, 1% 2%, 0 12%)',
          }}
        >
          <div>
            <div className="flex mw5 jca ">
              <div className="w-33">
                <GemFilter
                  gemType="amethyst"
                  ifItsSelected={selection.amethyst}
                  url="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAmethyst%20Face%20Emoji.png?alt=media&token=b38e3f31-7711-4e6a-a633-56edac59e6e6"
                  toggleGem={handleToggleGem}
                  filterLoading={filterLoading}
                />

                <GemFilter
                  gemType="garnet"
                  ifItsSelected={selection.garnet}
                  url="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                  toggleGem={handleToggleGem}
                  filterLoading={filterLoading}
                />
              </div>
              <div className="w-33">
                <GemFilter
                  gemType="opal"
                  ifItsSelected={selection.opal}
                  url="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FOpal%20Face%20Emoji.png?alt=media&token=1a515351-bd5c-4ff3-9ef9-89ea94526aa0"
                  toggleGem={handleToggleGem}
                  filterLoading={filterLoading}
                />
                <GemFilter
                  gemType="sapphire"
                  ifItsSelected={selection.sapphire}
                  url="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FSapphire%20Face%20Emoji.png?alt=media&token=5a1214f5-968c-491f-9cfc-a4ef02230afc"
                  toggleGem={handleToggleGem}
                  filterLoading={filterLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    </div>
  </div>
);

Filters.propTypes = {
  handleToggleGem: PropTypes.func.isRequired,
  filterLoading: PropTypes.bool.isRequired,
  selection: PropTypes.shape({
    amethyst: PropTypes.bool.isRequired,
    garnet: PropTypes.bool.isRequired,
  }).isRequired,
};

const actions = {
  handleToggleGem: toggleGem,
};

export default connect(
  select,
  actions,
)(Filters);

const GemFilter = ({
  gemType, ifItsSelected, url, toggleTheGem, filterLoading,
}) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => toggleTheGem(gemType)}
    onKeyPress={() => toggleTheGem(gemType)}
  >
    <figure className={` w-100 pv3 pointer tc ${ifItsSelected ? 'o-70' : 'o-20'}`}>
      {filterLoading ? (
        <div className="pa3">
          <Loading />
        </div>
      ) : (
        <img src={url} alt={gemType} className="pa2" />
      )}
      <figcaption className="o-60 tc f6 ttu">{`${gemType}`}</figcaption>
    </figure>
  </div>
);

GemFilter.propTypes = {
  toggleTheGem: PropTypes.func.isRequired,
  ifItsSelected: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  gemType: PropTypes.string.isRequired,
  filterLoading: PropTypes.bool.isRequired,
};
