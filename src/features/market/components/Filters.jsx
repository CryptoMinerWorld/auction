import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'antd/lib/slider';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Icon from 'antd/lib/icon';
import { connect } from 'react-redux';
import {gradeConverter, GWeiToEth} from '../helpers';
import { filterChange, filterMarketplaceResults } from '../marketActions';

const Loading1 = () => <Icon type="loading" style={{ fontSize: 24, color: '#e89e59' }} spin />;

const Loading2 = () => <Icon type="loading" style={{ fontSize: 24, color: '#95c9fc' }} spin />;

const Loading4 = () => <Icon type="loading" style={{ fontSize: 24, color: '#945cbe' }} spin />;

const select = store => ({
  level: store.marketActions.level,
  gradeType: store.marketActions.gradeType,
  currentPrice: store.marketActions.currentPrice,
  filterLoading: store.marketActions.filterLoading,
});

const Filters = ({
  handleChange, filterLoading, finalFilter, level, gradeType, currentPrice,
}) => (
  <div>
    <p className="ttu pv4 pl4">{/* hide filters */}</p>
    <div>
      <ReactCSSTransitionGroup
        transitionName="example1"
        transitionAppear
        transitionAppearTimeout={5000}
        transitionEnterTimeout={5000}
        transitionLeaveTimeout={5000}
      >
        <div
          className="pa3 mt4 bg-dark-orange-50 relative left-2 pl4 b"
          style={{
            clipPath:
              window.screen.availWidth >= 1920
                ? 'polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)'
                : 'polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 100% 100%, 100% 90%, 100% 14%, 100% 0, 96% 0, 5% 0%, 1% 2%, 0 12%)',
          }}
        >
          <div>
            {filterLoading ? (
              <div className="w-100 flex jcc pv4">
                <Loading1 />
              </div>
            ) : (
              <div>
                <p className="o-60">Levels from</p>
                <p>
                  <span className=" f3" style={{ color: '#e89e59' }}>{`${level.min}`}</span>
                  {' '}
                  <span className="o-60"> to </span>
                  <span className=" f3" style={{ color: '#e89e59' }}>{`${level.max}`}</span>
                </p>
              </div>
            )}
            <Slider
              range
              defaultValue={[level.min, level.max]}
              max={5}
              className="slider1"
              onChange={values => handleChange('level', values)}
              onAfterChange={() => finalFilter()}
            />
          </div>
        </div>
      </ReactCSSTransitionGroup>
      <ReactCSSTransitionGroup
        transitionName="example2"
        transitionAppear
        transitionAppearTimeout={5000}
        transitionEnterTimeout={5000}
        transitionLeaveTimeout={5000}
      >
        <div
          className="pa3 mv4 bg-dark-blue-50 relative left-2 pl4 b"
          style={{
            clipPath:
              window.screen.availWidth >= 1920
                ? 'polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)'
                : 'polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 100% 100%, 100% 90%, 100% 14%, 100% 0, 96% 0, 5% 0%, 1% 2%, 0 12%)',
          }}
        >
          {filterLoading ? (
            <div className="w-100 flex jcc pv4">
              <Loading2 />
            </div>
          ) : (
            <div>
              <p className="o-60">Grades from</p>
              <p>
                <span className=" f3" style={{ color: '#95c9fc' }}>
                  {`${gradeConverter(gradeType.min)}`}
                </span>
                {' '}
                <span className="o-60"> to </span>
                <span className=" f3" style={{ color: '#95c9fc' }}>
                  {`${gradeConverter(gradeType.max)}`}
                </span>
              </p>
            </div>
          )}

          <Slider
            range
            defaultValue={[gradeType.min, gradeType.max]}
            max={6}
            min={1}
            onChange={values => handleChange('gradeType', values)}
            onAfterChange={() => finalFilter()}
            className="slider2"
            tipFormatter={val => gradeConverter(val)}
          />
        </div>
      </ReactCSSTransitionGroup>

      <ReactCSSTransitionGroup
        transitionName="example3"
        transitionAppear
        transitionAppearTimeout={5000}
        transitionEnterTimeout={5000}
        transitionLeaveTimeout={5000}
      >
        <div
          className="pa3 mv4  bg-dark-purple-50 relative left-2 pl4 b "
          style={{
            clipPath:
              window.screen.availWidth >= 1920
                ? 'polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 99% 97%, 100% 90%, 100% 14%, 99% 4%, 96% 0, 5% 0%, 1% 2%, 0 12%)'
                : 'polygon(0 84%, 1% 96%, 5% 100%, 97% 100%, 100% 100%, 100% 90%, 100% 14%, 100% 0, 96% 0, 5% 0%, 1% 2%, 0 12%)',
          }}
        >
          {filterLoading ? (
            <div className="w-100 flex jcc pv4">
              <Loading4 />
            </div>
          ) : (
            <div>
              <p className="o-60">Prices from </p>
              <p>
                <span className="basic">Ξ </span>
                <span className=" f3" style={{ color: '#945cbe' }}>
                  {`${currentPrice.min}`}
                </span>
                {' '}
                <span className="o-60"> to </span>
                <span className="basic">Ξ </span>
                <span className=" f3" style={{ color: '#945cbe' }}>
                  {`${GWeiToEth(currentPrice.max)}`}
                </span>
              </p>
            </div>
          )}

          <Slider
            range
            defaultValue={[GWeiToEth(currentPrice.min), GWeiToEth(currentPrice.max)]}
            max={100}
            onChange={values => handleChange('currentPrice', values)}
            onAfterChange={() => finalFilter()}
            className="slider4"
            tipFormatter={val => val}
          />
        </div>
      </ReactCSSTransitionGroup>
    </div>
  </div>
);

const actions = {
  handleChange: filterChange,
  finalFilter: filterMarketplaceResults,
};

export default connect(
  select,
  actions,
)(Filters);

Filters.propTypes = {
  filterLoading: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  finalFilter: PropTypes.func.isRequired,
  level: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
  }).isRequired,
  gradeType: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
  }).isRequired,
  currentPrice: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
  }).isRequired,
};
