import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Avatar, Neoscan } from "components";
import { connect } from "react-redux";
import YouTube from "react-youtube";
import Linkify from "react-linkify";
import { Button, Row, Col, Card } from "antd";
import "./Message.css";
import { deleteMessage } from "../../actions/channels";

const WEB_URL = process.env.REACT_APP_API_URL.replace("/api", "");

const renderPayload = (payload) => {
  if (!payload) {
    return "";
  }
  switch (payload.type) {
    case "file":
      return (
        <a target="_blank" rel="noopener noreferrer" href={`${WEB_URL}/uploads/${payload.filename}`}>
          {payload.filename}
        </a>);
    case "link":
      return (
        <div>
          <Row gutter={0}>
            {payload.images[0] ?
              <Col span={4}>
                <img alt="example" src={payload.images[0]} style={{ width: "100%" }} />
              </Col> : ""}
            <Col span={20}>
              <Card title={payload.real_url} bordered={false}>{payload.description}</Card>
            </Col>
          </Row>
        </div>
      );
    case "image":
      return (<img src={payload.url} alt={payload.url} style={{ maxWidth: "100%", maxHeight: "200px" }} />);
    default:
      return "";
    case "youtube":
      return (<YouTube videoId={payload.id} />);
    case "neoscan":
      return (<Neoscan {...payload} />);
  }
};

const renderText = text => (
  <Linkify properties={{ target: "_blank" }}>{text}</Linkify>
);

const MessageContainer = ({
  message: {
    text, inserted_at, user, id, payload,
  },
  userId,
  phx_channel,
  connectedDeleteMessage,
}) => {
  const triggerDelete = () => {
    connectedDeleteMessage(phx_channel, id);
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
              color: "rgb(192,192,192)",
            }}
          >
            {moment(inserted_at).format("h:mm A")}
          </time>
        </div>
        <div>{renderPayload(payload)} <br /> {renderText(text)} </div>
      </div>
      {userId === user.id ? (
        <div className="messageOptions">
          <Button shape="circle" icon="delete" type="danger" onClick={triggerDelete} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

MessageContainer.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
    payload: PropTypes.object,
    inserted_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      email_hash: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }).isRequired,
  }),
  userId: PropTypes.number.isRequired,
  connectedDeleteMessage: PropTypes.func.isRequired,
  phx_channel: PropTypes.object.isRequired,
};

MessageContainer.defaultProps = {
  message: PropTypes.shape({
    text: "",
    payload: {},
  }),
};

export default connect(
  state => ({
    userId: state.session.currentUser.id,
  }),
  { connectedDeleteMessage: deleteMessage },
)(MessageContainer);
