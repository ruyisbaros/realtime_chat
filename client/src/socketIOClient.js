import { store } from './store'; // Your Redux store
import { wsConnected, wsDisconnected, wsMessageReceived, wsError } from './redux/actions'; // Your Redux actions

let ws = null;

export const connectWebSocket = (userId) => {
    if (ws) {
        return; // Already connected
    }

    ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);

    ws.onopen = () => {
        store.dispatch(wsConnected());
    };

    ws.onclose = () => {
        store.dispatch(wsDisconnected());
        ws = null;
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            store.dispatch(wsMessageReceived(data));
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    ws.onerror = (error) => {
        store.dispatch(wsError(error));
        ws = null;
    };
};

export const disconnectWebSocket = () => {
    if (ws) {
        ws.close();
    }
};

export const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    }
};