import React, { Component } from "react";
import moment from "moment";
import groupBy from "lodash/groupBy";
import mapKeys from "lodash/mapKeys";
import { MessageContainer } from "containers";
import PropTypes from "prop-types";
import "./MessageList.css";

class MessageList extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      inserted_at: PropTypes.string.isRequired,
    })),
    phx_channel: PropTypes.object.isRequired,
  };
  static defaultProps = {
    messages: [],
  };

  renderMessages = messages =>
    messages.map(message => (
      <MessageContainer
        key={message.id}
        message={message}
        phx_channel={this.props.phx_channel}
      />
    ));

  renderDays() {
    const { messages } = this.props;
    messages.map((message) => {
      const m = message;
      m.day = moment(message.inserted_at).format("MMMM Do");
      return m;
    });
    const dayGroups = groupBy(messages, "day");
    const days = [];
    mapKeys(dayGroups, (value, key) => {
      days.push({ date: key, messages: value });
    });
    const today = moment().format("MMMM Do");
    const yesterday = moment()
      .subtract(1, "days")
      .format("MMMM Do");
    return days.map(day => (
      <div key={day.date}>
        <div className="dayDivider">
          <span className="dayText">
            {day.date === today && "Today"}
            {day.date === yesterday && "Yesterday"}
            {![today, yesterday].includes(day.date) && day.date}
          </span>
        </div>
        {this.renderMessages(day.messages)}
      </div>
    ));
  }

  render() {
    return <div className="container">{this.renderDays()}</div>;
  }
}

export default MessageList;
