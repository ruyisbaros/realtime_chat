export const WS_CONNECTED = 'WS_CONNECTED';
export const WS_DISCONNECTED = 'WS_DISCONNECTED';
export const WS_MESSAGE_RECEIVED = 'WS_MESSAGE_RECEIVED';
export const WS_ERROR = 'WS_ERROR';

export const wsConnected = () => ({
    type: WS_CONNECTED,
});

export const wsDisconnected = () => ({
    type: WS_DISCONNECTED,
});

export const wsMessageReceived = (message) => ({
    type: WS_MESSAGE_RECEIVED,
    payload: message,
});

export const wsError = (error) => ({
    type: WS_ERROR,
    payload: error,
});