const initialState = {
    channel: null,
    currentChannel: {},
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'CHANNEL_CONNECTED_TO_CHANNEL':
            console.log("CHANNEL_CONNECTED_TO_CHANNEL", action.response)
            return {
                ...state,
                channel: action.channel,
                currentChannel: action.response.channel,
                messages: action.response.messages.reverse(),
            };
        case 'USER_LEFT_CHANNEL':
            return initialState;
        case 'MESSAGE_CREATED': // new case
            return {
                ...state,
                messages: [
                    ...state.messages,
                    action.message,
                ],
            };
        default:
            return state;
    }
}