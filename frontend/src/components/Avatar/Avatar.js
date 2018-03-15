import React, {Component} from 'react';
import PropTypes from 'prop-types';
import md5 from 'md5';

const Avatar = (props) => {
        const hash = md5(props.email);
        const uri = `https://secure.gravatar.com/avatar/${hash}`;
        return (
            <img
                src={uri}
                alt={props.email}
                style={{
                    width: `${props.size}px`,
                    height: `${props.size}px`,
                    borderRadius: '4px', ...props.style
                }}
            />
        )
}

Avatar.propTypes = {
    email: PropTypes.string.isRequired,
    size: PropTypes.string,
    style: PropTypes.object
}
Avatar.defaultProps = {
    size: 40,
    style: {}
}

export default Avatar;