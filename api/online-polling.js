let onlineUsers = 0;
let clients = [];

export default function handler(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clients.push(res);
    onlineUsers++;
    broadcastOnlineUsers();

    req.on('close', () => {
        clients = clients.filter((client) => client !== res);
        onlineUsers--;
        broadcastOnlineUsers();
    });
}

function broadcastOnlineUsers() {
    clients.forEach((client) => {
        client.write(`data: ${JSON.stringify({ onlineUsers })}\n\n`);
    });
}
