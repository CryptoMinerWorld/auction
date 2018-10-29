import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class ScrollToTop extends Component {
  static propTypes = {
    children: PropTypes.shape({
    }).isRequired,
    location: PropTypes.shape({
    }).isRequired,
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    // eslint-disable-next-line
   return this.props.children;
  }
}

export default withRouter(ScrollToTop);
