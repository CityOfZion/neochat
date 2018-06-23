import React from "react";
import { Navbar, UserList } from "components";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import "./DirectMessageAdd.css";

class DirectMessageAdd extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    createChannel: PropTypes.func.isRequired,
    createDirectMessage: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
  };

  onChannelJoin = userId =>
    this.props.createDirectMessage({ user_id: userId }, this.context.router);

  render() {
    return (
      <div style={{ flex: "1" }}>
        <Navbar />
        <Row>
          <Col span={10} offset={7}>
            <h3 style={{ marginBottom: "2rem", textAlign: "center" }}>
              Users
            </h3>
            <UserList
              users={this.props.users}
              addUserToChannel={this.onChannelJoin}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default DirectMessageAdd;
