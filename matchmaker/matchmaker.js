const functions = require("../structs/functions.js");

// file d'attente globale (un array d'objets joueurs)
let playerQueue = [];

// nombre de joueurs pour lancer une game
const PLAYERS_PER_MATCH = 3;

module.exports = async (ws) => {
    const ticketId = functions.MakeID().replace(/-/ig, "");
    const matchId = functions.MakeID().replace(/-/ig, "");
    const sessionId = functions.MakeID().replace(/-/ig, "");

    const player = {
        ws,
        ticketId,
        matchId,
        sessionId,
        isInMatch: false,
    };

    // Ajouter le joueur à la queue
    playerQueue.push(player);

    // Envoyer états de départ
    sendState(ws, "Connecting");
    await functions.sleep(800);
    sendState(ws, "Waiting", {
        totalPlayers: playerQueue.length,
        connectedPlayers: 1
    });

    // Boucle d'attente dans la queue tant qu'on n'est pas en match
    let estimatedWaitSec = 0;
    while (!player.isInMatch) {
        const queuedPlayers = playerQueue.indexOf(player); // position dans la queue
        estimatedWaitSec += 2;
        sendState(ws, "Queued", {
            ticketId,
            queuedPlayers,
            estimatedWaitSec,
            status: {}
        });
        await functions.sleep(2000);

        // Check si on peut lancer une partie
        if (playerQueue.length >= PLAYERS_PER_MATCH) {
            launchMatch();
        }
    }
};

// Fonction pour lancer une partie quand y a assez de joueurs
function launchMatch() {
    const playersForMatch = playerQueue.splice(0, PLAYERS_PER_MATCH);
    const matchId = functions.MakeID().replace(/-/ig, "");

    playersForMatch.forEach(async (player, i) => {
        player.isInMatch = true;
        const sessionId = functions.MakeID().replace(/-/ig, "");

        sendState(player.ws, "SessionAssignment", { matchId });
        await functions.sleep(1000);
        player.ws.send(JSON.stringify({
            payload: {
                matchId,
                sessionId,
                joinDelaySec: 1
            },
            name: "Play"
        }));
    });
}

// Envoi d’un état générique
function sendState(ws, state, extra = {}) {
    const basePayload = { state, ...extra };
    let name = "StatusUpdate";
    if (state === "Play") name = "Play";

    ws.send(JSON.stringify({
        payload: basePayload,
        name
    }));
}
