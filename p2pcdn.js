/* Copyright 2019 TeddyMurray.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */

var xhr = new XMLHttpRequest();
xhr.open("GET", "GoodGuy.mp4", true);
xhr.responseType = "blob";
xhr.send(null);

xhr.onload = function() {
	var video_file = new File([xhr.response], "GoodGuy.mp4", {type: "string"});
	var video_local_url = URL.createObjectURL(video_file);

	var peer = new Peer({host: 'ridekid.com', port: '7777',path: '/', secure: 'true'}); 

	peer.on('open', function(id) {
		peer.listAllPeers(function(peers) {
			var conn = peer.connect(peers[0]);
			conn.on('open', () => {
				document.getElementById('log').innerHTML += "Downloading from:" + peers[0];
				document.getElementById('log').innerHTML += "My ID:" + peer.id;
			  	var video = document.createElement('video');
				video.src = video_local_url;
				video.autoplay = true;
			});
		});
	});
	peer.on('connection', (conn) => {
	  	document.getElementById('log').innerHTML += "Sending to:" + conn.peer;
	  	conn.send(xhr.response);
	  	/*
	  	document.getElementsByTagName('body')[0].innerHTML = data;
	  	*/
	});

}