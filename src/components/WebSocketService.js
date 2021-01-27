class WebSocketService {

    async waitForConnection() {
        if (this.webSocket.readyState === WebSocket.OPEN) {
            return;
        }
        return await new Promise(resolve => {
            this.webSocket.addEventListener('open', () => {
                resolve();
            });
        });
    }

    initialize(messageHandler) {
        this.webSocket = new WebSocket('ws://localhost:8000');
        this.webSocket.addEventListener('message', event => {
            const data = JSON.parse(event.data);
            console.log(data);
            messageHandler(data);
        });
    }
}

export default WebSocketService;
