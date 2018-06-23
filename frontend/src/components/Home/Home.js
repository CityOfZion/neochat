import React from "react";
import { Navbar, NewChannelForm } from "components";
import PropTypes from "prop-types";
import { List, Button, Row, Col } from "antd";
import "./Home.css";

class Home extends React.Component {
  static propTypes = {
    createChannel: PropTypes.func.isRequired,
    joinChannel: PropTypes.func.isRequired,
    currentUserChannels: PropTypes.array.isRequired,
    channels: PropTypes.array.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  onChannelJoin = channelId =>
    this.props.joinChannel(channelId, this.context.router);

  handleNewChannelSubmit = data =>
    this.props.createChannel(data, this.context.router);

  renderChannels() {
    const currentUserChannelIds = [];
    this.props.currentUserChannels.map(channel =>
      currentUserChannelIds.push(channel.id));

    const isJoined = id => currentUserChannelIds.includes(id);

    return (<List
      itemLayout="horizontal"
      dataSource={this.props.channels}
      renderItem={channel => (

        <List.Item actions={[

          <Button
            onClick={() => this.onChannelJoin(channel.id)}
            className="btn btn-sm"
            disabled={isJoined(channel.id)}
          >Join
          </Button>]}
        >
          <List.Item.Meta
            title={channel.name}
          />
        </List.Item>)}
    />
    );
  }

  render() {
    return (
      <div style={{ flex: "1" }}>
        <Navbar />
        <Row>
          <Col span={10} offset={7} style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "1rem" }}>
              Create a new channel
            </h3>
            <NewChannelForm onSubmit={this.handleNewChannelSubmit} />
          </Col>
        </Row>
        <Row>
          <Col span={10} offset={7}>
            <h3 style={{ marginBottom: "2rem", textAlign: "center" }}>
            Join a channel
            </h3>
            {this.renderChannels()}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
