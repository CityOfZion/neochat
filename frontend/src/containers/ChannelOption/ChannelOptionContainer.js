import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { UserList } from "components";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import {
  getOptedOutUserChannel,
  optInUserForChannel,
} from "../../actions/channels";

class ChannelOptionContainer extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    getOptedOutUserChannel(id)
      .then(response => this.setState({ users: response.data }))
      .catch((error) => {});
  }

  render() {
    const { id } = this.props.match.params;

    const addUserToChannel = (user_id) => {
      optInUserForChannel(id, user_id)
        .then((response) => {
          const users = this.state.users.filter(user => user.id !== user_id);
          this.setState({ users });
        })
        .catch((error) => {});
    };

    return (
      <div>
        <Link to={`/channel/${id}`}>Return to chat</Link>
        <div>
          <Row>
            <Col span={10} offset={7}>
              <h3 style={{ marginBottom: "2rem", textAlign: "center" }}>
                Users
              </h3>
              <UserList
                users={this.state.users}
                addUserToChannel={addUserToChannel}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default connect(() => {})(ChannelOptionContainer);
