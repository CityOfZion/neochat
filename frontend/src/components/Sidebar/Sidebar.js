import React from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Menu, Icon, Layout } from "antd";
import ChannelLink from "./ChannelLink";
import "./Sidebar.css";

const Sidebar = ({
  channels,
  currentUserChannels,
  history,
  onLogoutClick,
  username: user,
  direct_messages,
}) => {
  if (!user) return null;

  // TODO channels[id] should not be undefined
  const newMessages = id =>
    channels[id] !== undefined &&
    channels[id] &&
    channels[id].newMessages.length !== 0;

  const directMessageLinks = direct_messages.map(channel => (
    <Menu.Item key={channel.id}>
      <ChannelLink
        key={channel.id}
        name={channel.name}
        id={channel.id}
        newMessages={newMessages(channel.id)}
      />
    </Menu.Item>
  ));

  const channelLinks = currentUserChannels.map(channel => (
    <Menu.Item key={channel.id}>
      <ChannelLink
        key={channel.id}
        name={channel.name}
        id={channel.id}
        newMessages={newMessages(channel.id)}
      />
    </Menu.Item>
  ));

  return (
    <Layout.Sider theme="light">
      Neochat
      <Menu
        theme=""
        mode="horizontal"
        style={{ lineHeight: "64px" }}
      >
        <Menu.ItemGroup
          key="channels"
          title={<span>Channels <Link to="/" className="link"><Icon type="plus" /></Link></span>}
        >
          {channelLinks}
        </Menu.ItemGroup>

        <Menu.ItemGroup
          key="dm"
          title={
            <span>Direct Messages
              <Link to="/direct_messages" className="link"><Icon type="plus" /></Link>
            </span>}
        >
          {directMessageLinks}
        </Menu.ItemGroup>
      </Menu>
    </Layout.Sider>
  );
};

Sidebar.defaultProps = {
  username: "",
};

Sidebar.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  username: PropTypes.string,
  channels: PropTypes.any.isRequired,
  currentUserChannels: PropTypes.array.isRequired,
  direct_messages: PropTypes.array.isRequired,
};

export default withRouter(Sidebar);
