

//document.addEventListener('DOMContentLoaded', function(event) {

//(function(window, document, vjs, undefined) {

videojs.registerPlugin('AdobeConviva', function (options) {
    
    function log(m,testing){
        if (testing){
         console.log(m)   
        }
    }

    var testing = true;
    log(JSON.stringify(options),testing)
    if (!options) {
        log("Options has not been added, please add the options on video cloud",testing)
    } else {
        testing = (options["env"] == "testing");
    }
    var myPlayer = this;
    var isContentLoaded = false;
    var videoDuration;
    var mediaName;
    var mediaPlayerName = window.location.hostname;
    var currentTime;
    var isPlaying = false;

    var metadata = {};
    convivaHelper = new ConvivaHelper(options);
    convivaHelper.initializeConviva();
    convivaHelper._testingEnvironment = testing; // set to false in production 


    function ABDMediaOPEN() {
        log("++ IN ABDMediaOPEN TOP ++",testing);
        //Check the metadata is loaded
        if (isContentLoaded) {
            log("++ IN ABDMediaOPEN content loaded ++",testing);
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
                log("++IN ABDMediaOPEN video is playing " + mediaName + " | " + videoDuration,testing);
              
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
        log("++loadstart - " + myPlayer.mediainfo.name,testing);
        //Check that metadata is loaded
        if (myPlayer.mediainfo.name) {
            isContentLoaded = true;
            //Initiate Adobe Analytics Media Module tracking && Conviva Analytics
            ABDMediaOPEN();
        }
    });

    myPlayer.on('firstplay', function () {
        log("++firstplay - " + myPlayer.mediainfo.name,testing);

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
        log("++Played - " + myPlayer.mediainfo.name,testing);
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
        log("++ In Playing ++",testing)
        convivaHelper.setPlayerWidthAndHeight(myPlayer.videoWidth(), myPlayer.videoHeight());
        convivaHelper.updatePlayerState("playing");
    });


    myPlayer.on('pause', function () {
        isPlaying = false;
        log("++paused - " + myPlayer.mediainfo.name,testing);
        //Check if metadata loaded - needed to make sure correct video media module instance is tracked.
        if (isContentLoaded) {
            currentTime = myPlayer.currentTime();
            //Play Adobe Analytics Media module from the current head.
            s.Media.stop(mediaName, currentTime);
            convivaHelper.updatePlayerState("pause");
        }
    });

    myPlayer.on('progress', function () {
        log("progressed - " + myPlayer.mediainfo.name,testing);
    });

    myPlayer.on('resize', function () {
        log("resized - " + myPlayer.mediainfo.name,testing);
    });

    myPlayer.on('seeked', function () {
        log("++seeked - " + myPlayer.mediainfo.name,testing);
        //Check if metadata loaded - needed to make sure correct video media module instance is tracked.
        if (isContentLoaded) {
            currentTime = myPlayer.currentTime();
            //Play Adobe Analytics Media module from the current head.
            s.Media.play(mediaName, currentTime);
            convivaHelper.contentSeeked();
        }
    });

    myPlayer.on('seeking', function () {
        log("++seeking - " + myPlayer.mediainfo.name,testing);
        //Check if metadata loaded - needed to make sure correct video media module instance is tracked.
        if (isContentLoaded) {
            currentTime = myPlayer.currentTime();
            //Play Adobe Analytics Media module from the current head.
            s.Media.stop(mediaName, currentTime);
        }
    });

    myPlayer.on('timeupdate', function () {
        log("++timeupdate - " + myPlayer.mediainfo.name,testing);
    });

    myPlayer.on('volumechange', function () {
        log("++volumechange - " + myPlayer.mediainfo.name,testing);
    });

    myPlayer.on('waiting', function () {
        log("++waiting - " + myPlayer.mediainfo.name,testing);
        if (isContentLoaded) {
            convivaHelper.updatePlayerState("waiting");
        }
    });

    myPlayer.on('durationchange', function () {
        log("++durationchange - " + myPlayer.mediainfo.name,testing);
    });

    myPlayer.on('ended', function () {
        log("++ended - " + myPlayer.mediainfo.description,testing);
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
        log("++ In Catalog Error ++",testing);
        const error = myPlayer.error_;
        const code = error.code;
        const message = error.message;
        const type = error.type;
        convivaHelper.contentReportError(code + ": " + message + " " + type, Conviva.Client.ErrorSeverity.FATAL);
        convivaHelper.cleanupConvivaSession();
    });

    myPlayer.on("error", function () {
        log("++ In Error ++",testing);
        const error = myPlayer.error_;
        const code = error.code;
        const message = error.message;
        const type = error.type;
        convivaHelper.contentReportError(code + ": " + message + " " + type, Conviva.Client.ErrorSeverity.FATAL);
        convivaHelper.cleanupConvivaSession();
    });

    myPlayer.on('fullscreenchange', function () {
        log("++fullscreenchange - " + myPlayer.mediainfo.name,testing);
    });

    myPlayer.on('loadedalldata', function () {
        log("++loadedalldata - " + myPlayer.mediainfo.name,testing);

    });

    myPlayer.on('loadeddata', function () {
        log("++loadeddata - " + myPlayer.mediainfo.name,testing);
        const tech_ = myPlayer.tech_;
        if (tech_) {
            const hls = tech_.hls; // Brightcove hls plugin
            if (hls && hls.playlists && hls.playlists.media) {
                const media = hls.playlists.media();
                if (media && media.attributes && media.attributes.BANDWIDTH) {
                    convivaHelper.contentSetBitrateKbps(media.attributes.BANDWIDTH / 1000);
                    log(media.attributes.BANDWIDTH / 1000,testing);
                }
            }
        }
    });

    myPlayer.on('loadedmetadata', function () {
        log("++loadedmetadata - " + myPlayer.mediainfo.name,testing);
        if (myPlayer.mediainfo.name) {
            isContentLoaded = true;
            //Initiate Adobe Analytics Media Module tracking && Conviva Analytics
            ABDMediaOPEN();
        }

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

