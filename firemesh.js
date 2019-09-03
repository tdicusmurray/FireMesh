/* Copyright 2019 TeddyMurray.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR 
THE USE OR OTHER DEALINGS IN THE SOFTWARE. */
var FileList = Array();
function pushFileList(file_local_url) {
	FileList.push(file_local_url);
}
var FileBuffer = Array();
function pushFileBuffer(binaryString) {
	FileBuffer.push(binaryString);
}
function fileBufferToList(binaryString) {
	var file = new File([binaryString], 'background.png', {type: "string"});
	var file_local_url = URL.createObjectURL(file);
	pushFileList(file_local_url);
}
class Content {
	constructor(file_url,type) {
		this.type = type;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", file_url, true);
		xhr.responseType = "blob";
		
		xhr.onload = function() {
			var file = new File([xhr.response], file_url, {type: "string"});
			var file_local_url = URL.createObjectURL(file);
			pushFileList(file_local_url);
			pushFileBuffer(xhr.response);
		}
		xhr.send();
	}
	render() {
		switch(this.type) {
			case 'video': 
				return "<video src='" + this.file_local_url + "' autoplay />";
				break;
			case 'image':
				return "<img src='" + this.file_local_url + "' />";
				break;
		}
	}
}
var ContentList = [new Content('background.png','image')];
var peer = new Peer({host: 'ridekid.com', port: '7777',path: '/', secure: 'true', debug: true}); 

peer.on('open', function(id) {
	peer.listAllPeers(function(peers) {
		let conn = peer.connect(peers[0]);
		conn.on('open', () => {
			FileList = [];
			FileBuffer = [];
			conn.on('data', function(data) {
				fileBufferToList(data);
				document.getElementById('layout').innerHTML += "<img src='" + FileList[0] + "' />";
				var ContentList = [new Content('background.png','image')];
			});
		});
	});
});

peer.on('connection', (conn) => {
	conn.on("open", function () {
		  for ( let i = 0; i < FileBuffer.length; i++ )
  			conn.send(FileBuffer[i]);
	});
});