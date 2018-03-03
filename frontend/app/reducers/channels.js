const initialState = {
    all: [],
    currentUserChannels: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'FETCH_CHANNELS_SUCCESS':
            return {
                ...state,
                all: action.response.data,
            };
        case 'FETCH_USER_CHANNELS_SUCCESS':
            return {
                ...state,
                currentUserChannels: action.response.data,
            };
        case 'CREATE_CHANNEL_SUCCESS':
            return {
                ...state,
                all: [
                    action.response.data,
                    ...state.all,
                ],
                currentUserChannels: [
                    ...state.currentUserChannels,
                    action.response.data,
                ],
            };
        case 'CHANNEL_JOINED':
            return {
                ...state,
                currentUserChannels: [
                    ...state.currentUserChannels,
                    action.response.data,
                ],
            };
        default:
            return state;
    }
}