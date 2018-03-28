import React from "react";
import PropTypes from "prop-types";

const UserListItem = ({ user, onChannelJoin }) => {
  return (
    <div
      key={user.id}
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px"
      }}
    >
      <span style={{ marginRight: "8px" }}>{user.username}</span>
      <button onClick={() => onChannelJoin(user.id)} className="btn btn-sm">
        Chat
      </button>
    </div>
  );
};

UserListItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onChannelJoin: PropTypes.func.isRequired
};

export default UserListItem;
