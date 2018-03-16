import React, { Component } from "react";
import moment from "moment";
import groupBy from "lodash/groupBy";
import mapKeys from "lodash/mapKeys";
import { Message } from "components";
import PropTypes from "prop-types";
import "./MessageList.css";

class MessageList extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf({
      id: PropTypes.number.isRequired,
      inserted_at: PropTypes.string.isRequired
    })
  };
  static defaultProps = {
    messages: []
  };

  renderMessages = messages =>
    messages.map(message => <Message key={message.id} message={message} />);

  renderDays() {
    const { messages } = this.props;
    messages.map(message => {
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
