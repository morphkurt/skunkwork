videojs.registerPlugin('pluginDev', function(options) {
	var myPlayer = this;
	var videoId;
	myPlayer.ready(function(){
	  videoId = myPlayer.mediainfo.id;
	  myPlayer.catalog.getVideo(videoId, function(error, video){
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
