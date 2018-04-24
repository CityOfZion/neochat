import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Avatar } from "components";

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

const Message = ({ message: { text, inserted_at, user } }) => (
  <div style={{ display: "flex", marginBottom: "10px" }}>
    <Avatar email_hash={user.email_hash} style={{ marginRight: "10px" }} />
    <div>
      <div style={{ lineHeight: "1.2" }}>
        <b style={{ marginRight: "8px", fontSize: "14px" }}>{user.username}</b>
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
  </div>
);

Message.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    inserted_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      email_hash: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default Message;
