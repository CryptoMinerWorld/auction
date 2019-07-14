import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './ripple.css';
import styled from 'styled-components';
import Ripple from './Ripple';

const Button = styled.button`
  display: inline-block;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: #FA04BC  
  &:hover {
    outline: none;
  }
`;

class RippleButton extends PureComponent {
  static defaultProps = {
    className: '',
    href: '#',
  };

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
    href: PropTypes.string,
  };

  state = {
    ripples: [],
  };

  render() {
    const {
      className, href, onClick, title,
    } = this.props;
    const { ripples } = this.state;

    return (
      <a href={href}>
        <Button
          className={className}
          onClick={(e) => {
            onClick();
            const left = e.pageX - e.currentTarget.offsetLeft;
            const top = e.pageY - e.currentTarget.offsetTop;
            const id = Math.random().toString();
            this.setState({ ripples: [...ripples, { left, top, id }] });
          }}
        >
          {title}

          {ripples.map(({ left, top, id }) => (
            <Ripple
              left={`${left}px`}
              top={`${top}px`}
              key={id}
              onRequestRemove={() => {
                this.setState(state => ({
                  ripples: state.ripples.filter(x => x.id !== id),
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
