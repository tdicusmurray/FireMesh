var fs = require('fs');
var PeerServer = require('peer').PeerServer;
 
var server = PeerServer({
  port: 7777,
  allow_discovery: true,
  ssl: {
    key: fs.readFileSync('/etc/letsencrypt/live/ridekid.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/ridekid.com/fullchain.pem')
  }
});
server.on('connection', (client) => {
	console.log(client);
});