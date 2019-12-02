

//document.addEventListener('DOMContentLoaded', function(event) {

//(function(window, document, vjs, undefined) {

videojs.registerPlugin('AdobeConviva', function (options) {

    simpleAnalytics = function (options) {
	var prod = false;
	console.log(JSON.stringfy(options))
	if (options && options["env"] == "prod"){
	  prod = true;
	} 
        var myPlayer = this;
        var isContentLoaded = false;
        var videoDuration;
        var mediaName;
        var mediaPlayerName = window.location.hostname;
        var currentTime;
        var isPlaying = false;

        var metadata = {};
        convivaHelper = new ConvivaHelper();
        convivaHelper.initializeConviva();
        convivaHelper._testingEnvironment = prod; // set to false in production 


        function ABDMediaOPEN() {
            console.log("++ IN ABDMediaOPEN TOP ++");
            //Check the metadata is loaded
            if (isContentLoaded) {
                console.log("++ IN ABDMediaOPEN content loaded ++");
                //Get all required metadata
                currentTime = myPlayer.currentTime();
                mediaName = myPlayer.mediainfo.name;
                videoDuration = myPlayer.mediainfo.duration;
                metadata = {};

                metadata["id"] = myPlayer.mediainfo.id;
                metadata["title"] = mediaName;
                metadata["url"] = myPlayer.mediainfo.sources[0].src;
                metadata["live"] = false;
                metadata["durationSec"] = videoDuration;
                metadata["streamType"] = myPlayer.mediainfo.sources[0].type;
                metadata["applicationName"] = window.location.hostname;

                //custom 
                metadata["assetID"] = myPlayer.mediainfo.id;
                //metadata["matchID"] = "round  - match1234";
                metadata["channel"] = window.location.hostname;
                metadata["playerName"] = getPlayerName();

                metadata["viewerID"] = "random:" + Math.random() * 1e9;
                //add all custom fields 
                Object.assign(metadata, myPlayer.mediainfo.customFields);




                //Open adobe Analytics Media Module	
                s.Media.open(mediaName, videoDuration, mediaPlayerName);
                //Check if video is playing
                if (isPlaying) {
                   console.log("++IN ABDMediaOPEN video is playing " + mediaName + " | " + videoDuration);
                    console.log();
                    //Play Adobe Analytics Media module from beginning.
                    s.Media.play(mediaName, currentTime);
                }
            }
        }

        //Used to reset the variables as when the next videos play, the play event is called before loadstart ...
        function resetVariables() {
            isContentLoaded = false;
            videoDuration = currentTime = "";
        }

        myPlayer.on('loadstart', function () {
            console.log("++loadstart - " + myPlayer.mediainfo.name);
            //Check that metadata is loaded
            if (myPlayer.mediainfo.name) {
                isContentLoaded = true;
                //Initiate Adobe Analytics Media Module tracking && Conviva Analytics
                ABDMediaOPEN();
            }
        });

        myPlayer.on('firstplay', function () {
            console.log("++firstplay - " + myPlayer.mediainfo.name);

            //Check if metadata loaded - needed to make sure correct video media module instance is tracked.
            if (isContentLoaded) {
                //conviva data
                userData = {}
                userData["id"] = "random:" + Math.random() * 1e9;//get adoobe id

                convivaHelper.createConvivaSession(userData, metadata);
                convivaHelper.attachPlayerToSession();
            }
        });

        myPlayer.on('play', function () {
            console.log("++Played - " + myPlayer.mediainfo.name);
            isPlaying = true;
            //Check if metadata loaded - needed to make sure correct video media module instance is tracked.
            if (isContentLoaded) {
                currentTime = myPlayer.currentTime();
                //Play Adobe Analytics Media module from the current head.
                s.eVar63 = mediaName;
                s.Media.play(mediaName, currentTime);
            }
        });

        myPlayer.on("playing", function () {
            console.log("++ In Playing ++")
            convivaHelper.setPlayerWidthAndHeight(myPlayer.videoWidth(), myPlayer.videoHeight());
            convivaHelper.updatePlayerState("playing");
        });


        myPlayer.on('pause', function () {
            isPlaying = false;
           console.log("++paused - " + myPlayer.mediainfo.name);
            //Check if metadata loaded - needed to make sure correct video media module instance is tracked.
            if (isContentLoaded) {
                currentTime = myPlayer.currentTime();
                //Play Adobe Analytics Media module from the current head.
                s.Media.stop(mediaName, currentTime);
                convivaHelper.updatePlayerState("pause");
            }
        });

        myPlayer.on('progress', function () {
           console.log("progressed - " + myPlayer.mediainfo.name);
        });

        myPlayer.on('resize', function () {
            console.log("resized - " + myPlayer.mediainfo.name);
        });

        myPlayer.on('seeked', function () {
            console.log("++seeked - " + myPlayer.mediainfo.name);
            //Check if metadata loaded - needed to make sure correct video media module instance is tracked.
            if (isContentLoaded) {
                currentTime = myPlayer.currentTime();
                //Play Adobe Analytics Media module from the current head.
                s.Media.play(mediaName, currentTime);
                convivaHelper.contentSeeked();
            }
        });

        myPlayer.on('seeking', function () {
            console.log("++seeking - " + myPlayer.mediainfo.name);
            //Check if metadata loaded - needed to make sure correct video media module instance is tracked.
            if (isContentLoaded) {
                currentTime = myPlayer.currentTime();
                //Play Adobe Analytics Media module from the current head.
                s.Media.stop(mediaName, currentTime);
            }
        });

        myPlayer.on('timeupdate', function () {
           console.log("++timeupdate - " + myPlayer.mediainfo.name);
        });

        myPlayer.on('volumechange', function () {
            console.log("++volumechange - " + myPlayer.mediainfo.name);
        });

        myPlayer.on('waiting', function () {
            console.log("++waiting - " + myPlayer.mediainfo.name);
            if (isContentLoaded) {
                convivaHelper.updatePlayerState("waiting");
            }
        });

        myPlayer.on('durationchange', function () {
            console.log("++durationchange - " + myPlayer.mediainfo.name);
        });

        myPlayer.on('ended', function () {
            console.log("++ended - " + myPlayer.mediainfo.description);
            //Check if metadata loaded - needed to make sure correct video media module instance is tracked.
            if (isContentLoaded) {
                currentTime = myPlayer.currentTime();
                //Play Adobe Analytics Media module from the current head.
                s.Media.stop(mediaName, currentTime);
                s.Media.close(mediaName);
                convivaHelper.updatePlayerState("ended");
                convivaHelper.cleanupConvivaSession();
                resetVariables();
            }
        });

        myPlayer.on("bc-catalog-error", function () {
            console.log("++ In Catalog Error ++");
            const error = myPlayer.error_;
            const code = error.code;
            const message = error.message;
            const type = error.type;
            convivaHelper.contentReportError(code + ": " + message + " " + type, Conviva.Client.ErrorSeverity.FATAL);
            convivaHelper.cleanupConvivaSession();
        });

        myPlayer.on("error", function () {
            console.log("++ In Error ++");
            const error = myPlayer.error_;
            const code = error.code;
            const message = error.message;
            const type = error.type;
            convivaHelper.contentReportError(code + ": " + message + " " + type, Conviva.Client.ErrorSeverity.FATAL);
            convivaHelper.cleanupConvivaSession();
        });

        myPlayer.on('fullscreenchange', function () {
            console.log("++fullscreenchange - " + myPlayer.mediainfo.name);
        });

        myPlayer.on('loadedalldata', function () {
           console.log("++loadedalldata - " + myPlayer.mediainfo.name);

        });

        myPlayer.on('loadeddata', function () {
            console.log("++loadeddata - " + myPlayer.mediainfo.name);
            const tech_ = myPlayer.tech_;
            if (tech_) {
                const hls = tech_.hls; // Brightcove hls plugin
                if (hls && hls.playlists && hls.playlists.media) {
                    const media = hls.playlists.media();
                    if (media && media.attributes && media.attributes.BANDWIDTH) {
                        convivaHelper.contentSetBitrateKbps(media.attributes.BANDWIDTH / 1000);
                        console.log(media.attributes.BANDWIDTH / 1000);
                    }
                }
            }
        });

        myPlayer.on('loadedmetadata', function () {
            console.log("++loadedmetadata - " + myPlayer.mediainfo.name);
            if (myPlayer.mediainfo.name) {
                isContentLoaded = true;
                //Initiate Adobe Analytics Media Module tracking && Conviva Analytics
                ABDMediaOPEN();
            }

        });

    };

    // register simpleAnalytics plugin with the player
    //		var registerPlugin = videojs.registerPlugin || videojs.plugin;
    //		registerPlugin("simpleAnalytics", simpleAnalytics);
    //})(window, document, videojs);

    //	for(var v in videojs.getPlayers()){
    //		videojs.getPlayers()[v].simpleAnalytics();
    //	}

 
    //});
    
    window.addEventListener('load', function() {
				console.log('All assets are loaded');
  
        var wait_for_videojs_afl;

wait_for_videojs_afl = setInterval(function() {
  if (typeof videojs == "function")	{
     clearInterval(wait_for_videojs_afl);
      var registerPlugin = videojs.registerPlugin || videojs.plugin;
      registerPlugin("simpleAnalytics", simpleAnalytics);

      for(var v in videojs.getPlayers()){
        videojs.getPlayers()[v].simpleAnalytics();
      }
    
  	}//end if
  	}, 750);

});


    function getPlayerName() {
        var hostname = window.location.hostname.replace(/^(www\.|m\.)/, '');

        aflSitesArray = new Object();
        aflSitesArray['afl.com.au'] = 'AFL Network';
        aflSitesArray['fantasy.afl.com.au'] = 'AFL Fantasy';
        aflSitesArray['tipping.afl.com.au'] = 'AFL Tipping';
        aflSitesArray['afc.com.au'] = 'Adelaide Crows';
        aflSitesArray['lions.com.au'] = 'Brisbane Lions';
        aflSitesArray['carltonfc.com.au'] = 'Carlton Blues';
        aflSitesArray['collingwoodfc.com.au'] = 'Collingwood Magpies';
        aflSitesArray['essendonfc.com.au'] = 'Essendon Bombers';
        aflSitesArray['fremantlefc.com.au'] = 'Fremantle';
        aflSitesArray['geelongcats.com.au'] = 'Geelong Cats';
        aflSitesArray['goldcoastfc.com.au'] = 'Gold Coast';
        aflSitesArray['gwsgiants.com.au'] = 'GWS';
        aflSitesArray['hawthornfc.com.au'] = 'Hawthorn Hawks';
        aflSitesArray['melbournefc.com.au'] = 'Melbourne Demons';
        aflSitesArray['nmfc.com.au'] = 'Kangaroos';
        aflSitesArray['portadelaidefc.com.au'] = 'Port Adelaide';
        aflSitesArray['richmondfc.com.au'] = 'Richmond Tigers';
        aflSitesArray['saints.com.au'] = 'St.Kilda Saints';
        aflSitesArray['sydneyswans.com.au'] = 'Sydney Swans';
        aflSitesArray['westcoasteagles.com.au'] = 'West Coast Eagles';
        aflSitesArray['westernbulldogs.com.au'] = 'Western Bulldogs';
        aflSitesArray[''] = 'AFL W';

        return aflSitesArray[hostname] || "test";
    }

});

