import React, { Component } from 'react';
import PropTypes from 'prop-types';

const DURATION = 230;

class Ripple extends Component {
    static propTypes = {
        onRequestRemove: PropTypes.func.isRequired,
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = { inn: false, out: false };
    }

    componentDidMount() {
        const { onRequestRemove } = this.props
        setTimeout(() => {
            this.setState({ inn: true, out: false });
            setTimeout(() => {
                this.setState({ inn: false, out: true });
                setTimeout(() => {
                    onRequestRemove();
                }, DURATION);
            }, DURATION);
        }, 15);
    }

    render() {
        let className = `Ripple`;
        const { left, top } = this.props
        const { inn, out } = this.state
        if (inn) {
            className = `${className} Ripple--in`;
        }
        if (out) {
            className = `${className} Ripple--out`;
        }
        const style = {};
        if (left) style.left = left;
        if (top) style.top = top;

        return <div className={className} style={style} />;
    }
}

export default Ripple;