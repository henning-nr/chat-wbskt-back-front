const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) =>{
	index = fs.readFileSync('index.html');
	res.writeHead(200);
	res.end(index);
})

const wss = new WebSocket.Server({ server });


// Armazenamento de conexões de clientes
const clients = [];

// Função para enviar uma mensagem para todos os clientes conectados
function broadcast(message) {
		clients.forEach(client => {
				if (client.readyState === WebSocket.OPEN) {
						client.send(message);
				}
		});
}

wss.on('connection', function connection(ws) {
		// Adiciona o cliente à lista de clientes
		clients.push(ws);

		ws.on('message', function incoming(message) {
				// Quando uma mensagem é recebida, envia-a para todos os clientes
				broadcast(message);
		});

		ws.on('close', function () {
				// Remove o cliente da lista de clientes quando a conexão é fechada
				const index = clients.indexOf(ws);
				if (index > -1) {
						clients.splice(index, 1);
				}
		});
});


server.listen(8080, () =>{
	console.log('Servidor rodando na porta 8080');
})