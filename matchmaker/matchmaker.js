const { Server: WebSocket } = require("ws");
const crypto = require("crypto");

const port = 80;
const wss = new WebSocket({ port });

const queue = [];
const PLAYERS_PER_MATCH = 2;

wss.on('listening', () => {
    console.log(`Matchmaker started listening on port ${port}`);
});

// Vérifie régulièrement si assez de joueurs sont en attente
setInterval(() => {
    while (queue.length >= PLAYERS_PER_MATCH) {
        const players = queue.splice(0, PLAYERS_PER_MATCH);
        const matchId = crypto.randomBytes(8).toString("hex");
        const sessionId = crypto.randomBytes(8).toString("hex");

        players.forEach(ws => {
            ws.send(JSON.stringify({
                payload: {
                    matchId,
                    state: "SessionAssignment"
                },
                name: "StatusUpdate"
            }));

            setTimeout(() => {
                ws.send(JSON.stringify({
                    payload: {
                        matchId,
                        sessionId,
                        joinDelaySec: 1
                    },
                    name: "Play"
                }));
            }, 2000);
        });
    }
}, 1000);

wss.on('connection', async (ws) => {
    if (ws.protocol.toLowerCase().includes("xmpp")) {
        return ws.close();
    }

    const ticketId = crypto.randomBytes(8).toString("hex");

    sendStatus(ws, "Connecting");

    setTimeout(() => {
        sendStatus(ws, "Waiting", {
            totalPlayers: 1,
            connectedPlayers: 1
        });
    }, 500);

    setTimeout(() => {
        queue.push(ws);

        sendStatus(ws, "Queued", {
            ticketId,
            queuedPlayers: queue.length,
            estimatedWaitSec: Math.ceil(queue.length / PLAYERS_PER_MATCH) * 5,
            status: {}
        });
    }, 1000);
});

function sendStatus(ws, state, extra = {}) {
    ws.send(JSON.stringify({
        payload: {
            state,
            ...extra
        },
        name: "StatusUpdate"
    }));
}
