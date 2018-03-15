import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
    static propTypes = {
        input: PropTypes.object.isRequired,
        label: PropTypes.string,
        type: PropTypes.string,
        placeholder: PropTypes.string,
        style: PropTypes.object,
        meta: PropTypes.object.isRequired
    }

    render() {
        const {input, label, type, placeholder, style, meta} = this.props;
        return (
            <div style={{marginBottom: '1rem'}}>
                {label && <label htmlFor={input.name}>{label}</label>}
                <input
                    {...input}
                    type={type}
                    placeholder={placeholder}
                    className="form-control"
                    style={style && style}
                />
                {meta.touched && meta.error &&
                <div style={{fontSize: '85%', color: 'rgb(255,59,48)'}}>{meta.error}</div>
                }
            </div>

    )
    }
}

export default Input;
