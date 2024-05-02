const MESSAGE_TYPES = require('./src/types');
const { customAlphabet } = require('nanoid');
const express = require('express')
const nanoIdGenerator = customAlphabet('3679cdefghjkmnpqrtuvwxy', 6)
const { Server } = require('ws')
const port = process.env.PORT || 8000;

const app = express()
let rooms = new Map();

// TODO: assign X randomly to one of the players.
// TODO: cleanup player rooms on quit

function handleMessage(message, ws) {
    console.log(`Received message => ${JSON.stringify(message)}`);
    switch (message.type) {
        case MESSAGE_TYPES.CREATE_ROOM: {
            return handleCreateRoom(message, ws);
        }
        case MESSAGE_TYPES.JOIN_ROOM: {
            return handleJoinRoom(message, ws);
        }
        case MESSAGE_TYPES.SEND_MOVE: {
            return handleSendMove(message, ws);
        }
    }
    return JSON.stringify({});
}

function handleJoinRoom(message, ws) {
    const roomCode = message.body.roomCode;
    if (!rooms.has(roomCode)) {
        ws.send(JSON.stringify({
            type: MESSAGE_TYPES.ERROR,
            body: {
                subType: MESSAGE_TYPES.JOIN_ROOM,
                message: `Room code ${roomCode} not found.`
            }
        }));
        return;
    }

    rooms.set(roomCode, {
        ...rooms.get(roomCode),
        player2: ws,
        turn: 'x',
        x: 'player1',
        o: 'player2'
    });

    const room = rooms.get(roomCode);
    const gameStartMessage = { type: MESSAGE_TYPES.ASSIGN_SYMBOL_AND_START_GAME, };
    room.player1.send(JSON.stringify({ ...gameStartMessage, body: { symbol: 'x', roomCode: roomCode } }));
    room.player2.send(JSON.stringify({ ...gameStartMessage, body: { symbol: 'o', roomCode: roomCode } }));
}

function handleCreateRoom(message, ws) {
    let roomCode;
    do {
        roomCode = nanoIdGenerator().toUpperCase();
    } while (rooms.has(roomCode));
    console.log(`Created unique room code: ${roomCode}`);
    rooms.set(roomCode, {
        code: roomCode,
        player1: ws,
    });

    ws.send(JSON.stringify({
        type: MESSAGE_TYPES.ROOM_CREATED,
        body: { roomCode: roomCode }
    }));
}

function oppositeSymbol(symbol) {
    return symbol === 'x' ? 'o' : 'x';
}

function handleSendMove(message, ws) {
    const roomCode = message.body.roomCode;
    const room = rooms.get(roomCode);

    if (message.body.player !== room.turn) {
        return;
    }

    rooms.set(roomCode, {
        ...room,
        turn: oppositeSymbol(room.turn),
    });

    const opponentSymbol = oppositeSymbol(message.body.player);
    const opponent = room[room[opponentSymbol]];

    opponent.send(JSON.stringify({
        type: MESSAGE_TYPES.RECEIVE_MOVE,
        body: message.body
    }));
}

const httpServer = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})
const wsServer = new Server({ noServer: true })

httpServer.on('upgrade', (req, socket, head) => {
    wsServer.handleUpgrade(req, socket, head, (ws) => {
        wsServer.emit('connection', ws, req)
    })
})

app.get('/elb-status', (req, res, next) => {
    console.log('GET /elb-status 200 OK')
    res.status(200).send('OK')
})

wsServer.on('connection', (ws) => {
    ws.on('message', (message) => handleMessage(JSON.parse(message), ws));
});

