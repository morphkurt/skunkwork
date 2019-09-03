videojs.registerPlugin('pluginName', function(options) {
    var myPlayer = this;
    	  myPlayer.catalog.getVideo('6082702003001', function(error, video){
	  	for(var i=0;i<video.sources.length;i++){
      			if(video.sources[i].src){
        			video.sources[i].src = sign(video.sources[i].src);
      			}
    	  	}
    	  	myPlayer.catalog.load(video);
    	  });    
});
