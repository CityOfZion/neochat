import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Avatar } from "components";
import "./Message.css";
import { connect } from "react-redux";
import { deleteMessage } from "../../actions/channels";
const WEB_URL = process.env.REACT_APP_API_URL.replace("/api", "");

const renderText = text => {
  try {
    const json = JSON.parse(text);
    // use neochat key to allow other json to be displayed
    if (json.neochat !== undefined) {
      return (
        <a target="_blank" href={`${WEB_URL}/${json.path}`}>
          {json.filename}
        </a>
      );
    }
  } catch (e) {
    return text;
  }
  return text;
};

const MessageContainer = ({
  message: { text, inserted_at, user, id },
  userId,
  phx_channel,
  deleteMessage
}) => {
  const triggerDelete = () => {
    deleteMessage(phx_channel, id);
  };
  return (
    <div className="messageBlock">
      <Avatar email_hash={user.email_hash} style={{ marginRight: "10px" }} />
      <div className="messageContent">
        <div style={{ lineHeight: "1.2" }}>
          <b style={{ marginRight: "8px", fontSize: "14px" }}>
            {user.username}
          </b>
          <time
            style={{
              fontSize: "12px",
              color: "rgb(192,192,192)"
            }}
          >
            {moment(inserted_at).format("h:mm A")}
          </time>
        </div>
        <div>{renderText(text)}</div>
      </div>
      {userId === user.id ? (
        <div className="messageOptions">
          <button className="btn" onClick={triggerDelete}>
            ❌
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

MessageContainer.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    inserted_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      email_hash: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired
    }).isRequired
  }).isRequired,
  userId: PropTypes.number.isRequired,
  deleteMessage: PropTypes.func.isRequired
};

export default connect(
  state => ({
    userId: state.session.currentUser.id
  }),
  { deleteMessage }
)(MessageContainer);
