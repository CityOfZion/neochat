import React from 'react';
import PropTypes from 'prop-types';

const Avatar = (props) => {
  const uri = `https://secure.gravatar.com/avatar/${props.email_hash}`;
  return (
    <img
      src={uri}
      alt={props.email_hash}
      style={{
        width: `${props.size}px`,
        height: `${props.size}px`,
        borderRadius: '4px',
        ...props.style,
      }}
    />
  );
};

Avatar.propTypes = {
  email_hash: PropTypes.string.isRequired,
  size: PropTypes.number,
  style: PropTypes.object,
};
Avatar.defaultProps = {
  size: 40,
  style: {},
};

export default Avatar;
