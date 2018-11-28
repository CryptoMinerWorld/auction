import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import smoothscroll from 'smoothscroll-polyfill';

class ScrollToTop extends Component {
  static propTypes = {
    children: PropTypes.shape({}).isRequired,
    location: PropTypes.shape({}).isRequired,
  };

  componentDidMount() {
    smoothscroll.polyfill();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      // window.scrollTo(0, 0);
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  render() {
    // eslint-disable-next-line
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
