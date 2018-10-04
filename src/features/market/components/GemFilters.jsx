import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Icon from 'antd/lib/icon';
import { connect } from 'react-redux';

import { toggleGem } from '../marketActions';

const select = store => ({
  filterLoading: store.marketActions.filterLoading,
  selection: store.marketActions.gems
});

const Loading = () => (
  <Icon type="loading" style={{ fontSize: 24, color: '#bb207e' }} spin />
);

class Filters extends Component {
  static propTypes = {
    handleToggleGem: PropTypes.func,
    filterLoading: PropTypes.bool.isRequired,
    selection: PropTypes.shape({
      amethyst: PropTypes.bool.isRequired,
      garnet: PropTypes.bool.isRequired
    }).isRequired
  };

  render() {
    const { handleToggleGem, filterLoading, selection } = this.props;
    return (
      <div>
        <p className="ttu pv4 pl4">{/* hide filters */}</p>
        <div>
          <ReactCSSTransitionGroup
            transitionName="slideinFromLeft"
            transitionAppear
            transitionAppearTimeout={5000}
            transitionEnterTimeout={5000}
            transitionLeaveTimeout={5000}
          >
            <div
              className="mv4 pa3 bg-dark-pink-50 relative pl4 b"
              style={{
                right: '6rem',
                clipPath:
                  window.screen.availWidth >= 1920
                    ? 'polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)'
                    : 'polygon(0.5% 101.33%, 92.54% 99.33%, 98.51% 95.33%, 100.25% 82.67%, 100% 18%, 99.26% 8px, 96% 0px, -0.49% -1.33%)'
              }}
            >
              <div>
                {/* <p className="o-60 tc">X</p> */}
                <div className="flex mw5 jcc pl3">
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

                  {/* <div className="w-33">
                        <GemFilter
                          gemType="amethyst"
                          ifItsSelected={selection.amethyst}
                          url="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAmethyst%20Face%20Emoji.png?alt=media&token=b38e3f31-7711-4e6a-a633-56edac59e6e6"
                          toggleGem={toggleGem}
                        />

                        <GemFilter
                          gemType="garnet"
                          ifItsSelected={selection.garnet}
                          url="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                          toggleGem={toggleGem}
                        />

                        <GemFilter
                          gemType="opal"
                          ifItsSelected={selection.opal}
                          url="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FOpal%20Face%20Emoji.png?alt=media&token=1a515351-bd5c-4ff3-9ef9-89ea94526aa0"
                          toggleGem={toggleGem}
                        />
                        <GemFilter
                          gemType="sapphire"
                          ifItsSelected={selection.sapphire}
                          url="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FSapphire%20Face%20Emoji.png?alt=media&token=5a1214f5-968c-491f-9cfc-a4ef02230afc"
                          toggleGem={toggleGem}
                        />
                      </div>
                      <div className="w-33">
                        <GemFilter
                          gemType="amethyst"
                          ifItsSelected={selection.amethyst}
                          url="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAmethyst%20Face%20Emoji.png?alt=media&token=b38e3f31-7711-4e6a-a633-56edac59e6e6"
                          toggleGem={toggleGem}
                        />

                        <GemFilter
                          gemType="garnet"
                          ifItsSelected={selection.garnet}
                          url="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55"
                          toggleGem={toggleGem}
                        />

                        <GemFilter
                          gemType="opal"
                          ifItsSelected={selection.opal}
                          url="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FOpal%20Face%20Emoji.png?alt=media&token=1a515351-bd5c-4ff3-9ef9-89ea94526aa0"
                          toggleGem={toggleGem}
                        />
                        <GemFilter
                          gemType="sapphire"
                          ifItsSelected={selection.sapphire}
                          url="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FSapphire%20Face%20Emoji.png?alt=media&token=5a1214f5-968c-491f-9cfc-a4ef02230afc"
                          toggleGem={toggleGem}
                        />
                      </div> */}
                </div>
              </div>
            </div>
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

const actions = {
  handleToggleGem: toggleGem
};

export default connect(
  select,
  actions
)(Filters);

const GemFilter = ({
  gemType,
  ifItsSelected,
  url,
  toggleGem,
  filterLoading
}) => {
  return (
    <figure
      className={` w-100 pv3 pointer tc ${ifItsSelected ? 'o-70' : 'o-20'}`}
      onClick={() => toggleGem(gemType)}
    >
      {filterLoading ? (
        <div className="pa3">
          <Loading />
        </div>
      ) : (
        <img src={url} alt={gemType} className="pa2" />
      )}
      <figcaption className="o-60 tc f6 ttu">{`${gemType}`}</figcaption>
    </figure>
  );
};

GemFilter.propTypes = {
  handleToggleGem: PropTypes.func,
  ifItsSelected: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  gemType: PropTypes.string.isRequired
};
