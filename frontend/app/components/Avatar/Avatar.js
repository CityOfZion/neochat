import React, {Component} from 'react';
import PropTypes from 'prop-types';
import md5 from 'md5';

class Avatar extends Component {
    static props = {
        email: PropTypes.string.isRequired,
        size: PropTypes.string,
        style: PropTypes.object
    }
    static defaultProps = {
        size: 40
    }

    render() {
        const hash = md5(this.props.email);
        const uri = `https://secure.gravatar.com/avatar/${hash}`;
        return (
            <img
                src={uri}
                alt={this.props.email}
                style={{
                    width: `${this.props.size}px`,
                    height: `${this.props.size}px`,
                    borderRadius: '4px', ...this.props.style
                }}
            />
        )
    }
}

export default Avatar;