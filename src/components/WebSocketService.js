import MESSAGE_TYPES from '../types';

class WebSocketService {

    async waitForConnection() {
        if (this.webSocket.readyState === WebSocket.OPEN) {
            return;
        }
        return new Promise(resolve => {
            this.webSocket.addEventListener('open', () => {
                resolve();
            });
        });
    }

    keepAlive() {
        let keepAlive = setInterval(() => {
            if (this.webSocket.readyState === WebSocket.CONNECTING) {
                return;
            }
            if (this.webSocket.readyState === WebSocket.OPEN) {
                this.webSocket.send(JSON.stringify({ type: MESSAGE_TYPES.KEEP_ALIVE }));
                return;
            }
            clearInterval(keepAlive);
        }, 30 * 1000);
    }

    initialize(messageHandler) {
        this.webSocket = new WebSocket(API_URL);
        this.webSocket.addEventListener('message', event => {
            const data = JSON.parse(event.data);
            console.log(data);
            messageHandler(data);
        });
        this.keepAlive();
    }
}

export default WebSocketService;
