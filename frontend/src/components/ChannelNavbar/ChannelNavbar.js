import React from "react";
import { Link } from "react-router-dom";
import { Layout, Row, Col } from "antd";
import PropTypes from "prop-types";
import "./ChannelNavbar.css";

const ChannelNavbar = ({ channel }) => (
  <Layout.Header style={{ background: "#fff", padding: 0 }}>
    <Row>
      <Col span={8}>
        <span className="Name">#{channel.name}</span>
      </Col>
      <Col span={4} offset={12}>
        <div className="Options">
          <Link to={`/channel/${channel.id}/options`}>
            Options
          </Link>
        </div>
      </Col>

    </Row>
  </Layout.Header>
);

ChannelNavbar.propTypes = {
  channel: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};
export default ChannelNavbar;
