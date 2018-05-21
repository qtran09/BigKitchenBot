var tmi = require('tmi.js');
var channel_name = "BigKitchenSink";
var options = {
	uri: 'https://www.youtube.com/watch?v=b36bPZi9_Jk',
	transform: function(body){
		return cheerio.load(body);
	},
	options: {
		debug: true,
	},
	connection: {
		cluster: "aws",
		reconnect: true
	},
	identity: {
		username: "BigKitchenBot",
		password: "oauth:rahiys3f86kla38vj99ls4ldg6k20o"
	},
	channels: [channel_name]
};

var client = new tmi.client(options);
client.connect();

//BigKitchenBot connection
client.on("connected", function(address,port){
	client.action(channel_name,"Connected");
});

//Say this every 30 seconds
(function periodic_echo(){
	client.action(channel_name,"Make sure to follow");
	setTimeout(periodic_echo, 300000);
})();

//All chat stuff
client.on("chat", function(channel, user, message, self){
	if(self) return;
	if(message == "!ig") 
		client.action(channel_name, "https://www.instagram.com/ssbmq/");
	
	if(message.includes("!mod") && user.username == channel_name){
		let toMod = message.split(" ");
		if(toMod.length == 2)
			client.mod(channel_name,toMod[1]);
		else
			console.log("!mod __username__");
	}
	
	if(message.includes("!ban") && (user.mod || user.username == channel_name)){
		let toBan = message.split(" ");
		if(toBan.length == 2)
			client.mod(channel_name,toBan[1]);
		else{
			console.log("!ban __username__");
		}
	}
	
	if(message == "!playlist"){
		client.action(channel_name, "Chill jams: https://www.youtube.com/playlist?list=PLTRJNdRyy4GEgN8IOQaqRtxsHusyPf9pP")
		client.action(channel_name, "If anyone has recommendations, please let me know!");
	}
});

//User subscribes
client.on("subscription", function(channel,username,method,message,userstate){
	client.action(channel_name, username + " has subbed");
});

//User resubscribes
client.on("resub", function (channel, username, months, message, userstate, methods) {
    client.action(channel_name, username + " has resubbed for " + months + " months!");
});
//Bot disconnects manually
client.on("disconnected", function(reason){
	client.action(channel_name,"Disconnected");
});
