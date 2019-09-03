videojs.getPlayer('pluginName', function(options) {
    var myPlayer = this;
    myPlayer.on('loadstart', function(evt) {
	    var sources = myPlayer.mediainfo.sources;
	    for(var i=0;i<sources.length;i++){
      			if(sources[i].src){
        			sources[i].src = sign(sources[i].src,options);
      			}
    	    }
	    
    }
});
