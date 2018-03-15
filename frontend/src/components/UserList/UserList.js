import React from "react";
import Avatar from "../Avatar/Avatar";
import "./UserList.css";

export default function UserList(props) {
  const { users, addUserToChannel } = props;
  return (
    <div className="UserList">
      {users.map(user => (
        <User user={user} addUserToChannel={addUserToChannel} />
      ))}
    </div>
  );
}

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
