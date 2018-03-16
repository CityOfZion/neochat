import React from "react";
import PropTypes from "prop-types";
import Avatar from "../Avatar/Avatar";
import "./UserList.css";

const UserList = props => {
  const { users, addUserToChannel } = props;
  return (
    <div className="UserList">
      {users.map(user => (
        <User user={user} addUserToChannel={addUserToChannel} />
      ))}
    </div>
  );
};

function User(props) {
  const { user, addUserToChannel } = props;
  return (
    <div className="User" key={user.id}>
      <Avatar email={user.email} />
      <div className="UserName">{user.username}</div>
      <button
        className="AddToChannel"
        onClick={() => {
          addUserToChannel(user.id);
        }}
      >
        Add
      </button>
    </div>
  );
}

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  addUserToChannel: PropTypes.func.isRequired
};

User.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  }).isRequired,
  addUserToChannel: PropTypes.func.isRequired
};

export default UserList;
