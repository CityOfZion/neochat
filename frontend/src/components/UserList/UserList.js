import React from "react";
import PropTypes from "prop-types";
import { List, Button } from "antd";
import Avatar from "../Avatar/Avatar";
import "./UserList.css";

const UserList = ({ users, addUserToChannel }) => (
  <List
    itemLayout="horizontal"
    dataSource={users}
    renderItem={user => (
      <List.Item actions={[
        <Button
          onClick={() => addUserToChannel(user.id)}
          className="btn btn-sm"
        >Add
        </Button>]}
      >
        <Avatar email={user.email} />
        <List.Item.Meta title={user.username} />

      </List.Item>)}
  />
);

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  addUserToChannel: PropTypes.func.isRequired,
};

export default UserList;
