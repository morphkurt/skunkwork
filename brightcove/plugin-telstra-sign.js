videojs.registerPlugin('pluginDev', function(options) {
	var myPlayer = this;
	var videoId;
	myPlayer.ready(function(){
	  videoId = myPlayer.mediainfo.id;
	  console.log("loaded signing plugin");
	  console.log(videoId);
	  myPlayer.catalog.getVideo(videoId, function(error, video){
		if (error){
			console.log(error);	
		}
		console.log(video);
	  	for(var i=0;i<video.sources.length;i++){
      			if(video.sources[i].src){
        			video.sources[i].src = sign(video.sources[i].src,options);
      			}
    	  	}
		console.log(video.sources[i].src);
    	  	myPlayer.catalog.load(video);
    	  });
	});
});
