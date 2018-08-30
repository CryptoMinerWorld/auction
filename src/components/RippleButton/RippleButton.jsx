import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './ripple.css';
import styled from 'styled-components';

const Button = styled.button`
  display: inline-block;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &:hover {
    outline: none;
  }
`;

const DURATION = 230;

class Ripple extends React.Component {
  static propTypes = {
    onRequestRemove: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { in: false, out: false };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ in: true, out: false });
      setTimeout(() => {
        this.setState({ in: false, out: true });
        setTimeout(() => {
          this.props.onRequestRemove();
        }, DURATION);
      }, DURATION);
    }, 15);
  }

  render() {
    let className = `Ripple`;

    if (this.state.in) {
      className = `${className} Ripple--in`;
    }
    if (this.state.out) {
      className = `${className} Ripple--out`;
    }

    const style = {};
    if (this.props.left) style.left = this.props.left;
    if (this.props.top) style.top = this.props.top;

    return <div className={className} style={style} />;
  }
}

class RippleButton extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    className: PropTypes.string
  };

  state = {
    ripples: []
  };

  render() {
    return (
      <a href={this.props.href}>
        <Button
          className={this.props.className}
          onClick={e => {
            this.props.onClick();
            const left = e.pageX - e.currentTarget.offsetLeft;
            const top = e.pageY - e.currentTarget.offsetTop;
            const id = Math.random().toString();
            const ripples = [...this.state.ripples, { left, top, id }];
            this.setState({ ripples });
          }}
        >
          {this.props.title}

          {this.state.ripples.map(({ left, top, id }) => (
            <Ripple
              left={`${left}px`}
              top={`${top}px`}
              key={id}
              onRequestRemove={() => {
                this.setState(state => ({
                  ripples: state.ripples.filter(x => x.id !== id)
                }));
              }}
            />
          ))}
        </Button>
      </a>
    );
  }
}

export default RippleButton;
