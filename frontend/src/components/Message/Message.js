import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Avatar} from 'components';

class Message extends Component {
    static propTypes = {
        message: {
            text: PropTypes.string.isRequired,
            inserted_at: PropTypes.string.isRequired,
            user: {
                email: PropTypes.string.isRequired,
                username: PropTypes.string.isRequired,
            }
        }
    }

    render() {
        const {message: {text, inserted_at, user}} = this.props;
        return (
            <div style={{display: 'flex', marginBottom: '10px'}}>
                <Avatar email={user.email} style={{marginRight: '10px'}}/>
                <div>
                    <div style={{lineHeight: '1.2'}}>
                        <b style={{marginRight: '8px', fontSize: '14px'}}>{user.username}</b>
                        <time style={{
                            fontSize: '12px',
                            color: 'rgb(192,192,192)'
                        }}>{moment(inserted_at).format('h:mm A')}</time>
                    </div>
                    <div>{text}</div>
                </div>
            </div>
        )
    }
}

export default Message;