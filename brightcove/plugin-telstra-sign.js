videojs.registerPlugin('pluginDev', function(options) {
	var myPlayer = this;
	var videoId;
	myPlayer.one("loadstart", function(){
		console.log('loadstart')
		console.log(myPlayer.src())
		var src = {type: myPlayer.currentType(),  src: sign(myPlayer.src(),options) };
		console.log(src)
		myPlayer.src(src)
		console.log(myPlayer.src())
	});
});
