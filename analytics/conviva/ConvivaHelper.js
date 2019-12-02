/*! (C) 2016 Conviva, Inc. All rights reserved. Confidential and proprietary. */
/*! This is sample code meant to illustrate proper Conviva integration in video applications. */
/*! This file should not be included in video applications as part of integrating Conviva. */

/// Handles the complex/repetitive parts of the Conviva integration.

var ConvivaHelper = function (options) {

  // Whether the video application is in testing or production mode.
  this._testingEnvironment = (options["env"] == "testing");
 
  // A reference to the Conviva Client instance, if it exists.
  this._client = null;

  this._contentSessionPlayerStateManager = null;

  // A reference to the current Conviva session, if it exists.
  // Otherwise, defaults to Conviva.Client.NO_SESSION_KEY.
  this._currentConvivaSessionKey = Conviva.Client.NO_SESSION_KEY;

  // A reference to the current Conviva SystemFactory for HTML5.
  this._systemFactory = null;

  // Provides ClientSettings to configure Conviva Client in testing mode.
  function getTestingClientSettings () {
    var credentials = options["testing"];
    var clientSettings = null;
    try {
      clientSettings = new Conviva.ClientSettings(credentials.customerKey);
      clientSettings.heartbeatInterval = 5; // send data to Conviva more often, increases Touchstone/Pulse responsiveness
      if (credentials.gatewayUrl) {
          clientSettings.gatewayUrl = credentials.gatewayUrl; // use Conviva validation servers
      }
    } catch (e) {
      // Error occured while creating client settings
    }
    return clientSettings;
  }

  // Provides ClientSettings to configure Conviva Client in production mode.
  function getProductionClientSettings () {
    var credentials = options["production"];
    var clientSettings = null;
    try {
      clientSettings = new Conviva.ClientSettings(credentials.customerKey);
    } catch (e) {
      // Error occured while creating client settings.
    }
    return clientSettings;
  }

  // Provides SystemSettings to configure Conviva SystemFactory in testing mode.
  function getTestingSystemSettings () {
    var systemSettings = new Conviva.SystemSettings();
    systemSettings.logLevel = Conviva.SystemSettings.LogLevel.DEBUG; // log everything
    systemSettings.allowUncaughtExceptions = true; // do not silently catch exceptions, may help debugging
    return systemSettings;
  }

  // Provides SystemSettings to configure Conviva SystemFactory in production mode.
  function getProductionSystemSettings () {
    var systemSettings = new Conviva.SystemSettings();
    systemSettings.logLevel = Conviva.SystemSettings.LogLevel.ERROR; // default
    //systemSettings.logLevel = Conviva.SystemSettings.LogLevel.DEBUG; // default
    // systemSettings.allowUncaughtExceptions = false; // default
    return systemSettings;
  }

  this.setEnvironment = function (environment) {
    this._testingEnvironment = (environment === "testing");
  };

  // Constructs and stores a new Conviva Client with appropriate settings, given an existing SystemFactory object.
  this.buildConvivaClient = function () {
    // this.releaseConvivaClient();

    var clientSettings = this._testingEnvironment ? getTestingClientSettings() : getProductionClientSettings();
    if(clientSettings != null) {
      this._client = new Conviva.Client(clientSettings, this._systemFactory);
    }
  };

  // Frees the existing Conviva Client.
  this.releaseConvivaClient = function () {
    if (this._client != null) {
        this._client.release();
        this._client = null;
    }
  };

  // Constructs and stores a new Conviva SystemFactory for HTML5 with appropriate settings,
  // given an existing SystemInterface object for HTML5.
  this.buildConvivaFactory = function () {
    var systemSettings = this._testingEnvironment ? getTestingSystemSettings() : getProductionSystemSettings();
    var html5SystemInterface = new Conviva.SystemInterface(
      new Time(),
      new Timer(),
      new Http(),
      new Storage(),
      new Metadata(),
      new Logging()
    );
    this._systemFactory = new Conviva.SystemFactory(html5SystemInterface, systemSettings);

  };

  // Frees the existing Conviva SystemFactory.
  this.releaseConvivaFactory = function () {
     if (this._systemFactory != null) {
         this._systemFactory.release();
         this._systemFactory = null;
     }
  };

  // Initializes Conviva by creating a Conviva Client and all its dependencies.
  this.initializeConviva = function () {
    this.buildConvivaFactory();
    this.buildConvivaClient();
  };

  // Resets Conviva by releasing the existing Conviva Client and all its dependencies.
  this.unloadConviva = function () {
    this.releaseConvivaClient();
    this.releaseConvivaFactory();
  };

  // Creates a Conviva monitoring session given data pertaining to the current user
  // as well as metadata for the requested video content.
  this.createConvivaSession = function (userData, videoData) {
    if (this._currentConvivaSessionKey == Conviva.Client.NO_SESSION_KEY && this._client != null) {
      var contentMetadata = this.buildConvivaContentMetadata(userData, videoData);
      this._currentConvivaSessionKey = this._client.createSession(contentMetadata);
      //document.getElementById("contentMutable").style.display = "block";
      // #TODO: handle failure? wrap all other users of sessionKey?
    }
  };

  // Terminates the existing Conviva monitoring session.
  this.cleanupConvivaSession = function () {
    if (this._currentConvivaSessionKey != Conviva.Client.NO_SESSION_KEY && this._client != null) {
        this._client.releasePlayerStateManager(this._contentSessionPlayerStateManager);
        this._contentSessionPlayerStateManager = null;

        this._client.cleanupSession(this._currentConvivaSessionKey);
        this._currentConvivaSessionKey = Conviva.Client.NO_SESSION_KEY;
    }
  };

  // Links the existing PlayerInterface to the active Conviva monitoring session.
  this.attachPlayerToSession = function () {
    if (this._currentConvivaSessionKey != Conviva.Client.NO_SESSION_KEY && this._client != null) {
        this._contentSessionPlayerStateManager = this._client.getPlayerStateManager();
        this._contentSessionPlayerStateManager.setClientMeasureInterface(new ClientMeasureInterface());
        this._client.attachPlayer(this._currentConvivaSessionKey, this._contentSessionPlayerStateManager);
    }
  };

  // Maps relevant videojs events to the corresponding Conviva player state.
  this.updatePlayerState = function (event) {
      switch (event) {
          case "playing":
              this._contentSessionPlayerStateManager.setPlayerState(Conviva.PlayerStateManager.PlayerState.PLAYING);
              break;
          case "waiting":
          /*case "stalled":
          case "emptied":*/
              this._contentSessionPlayerStateManager.setPlayerState(Conviva.PlayerStateManager.PlayerState.BUFFERING);
              break;
          case "ended":
          case "stopped":
              this._contentSessionPlayerStateManager.setPlayerState(Conviva.PlayerStateManager.PlayerState.STOPPED);
              break;
          case "pause":
              this._contentSessionPlayerStateManager.setPlayerState(Conviva.PlayerStateManager.PlayerState.PAUSED);
              break;
          default:
              this._contentSessionPlayerStateManager.setPlayerState(Conviva.PlayerStateManager.PlayerState.UNKNOWN);
      }
  };

  // Severs the link between the existing PlayerInterface and the active Conviva monitoring session.
  this.detachPlayerFromSession = function () {
    if (this._currentConvivaSessionKey != Conviva.Client.NO_SESSION_KEY && this._client != null) {
        this._client.detachPlayer(this._currentConvivaSessionKey);
    }
  };

  this.contentSetBitrateKbps = function(bitrateKbps) {
    if (this._contentSessionPlayerStateManager != null) {
        this._contentSessionPlayerStateManager.setBitrateKbps(bitrateKbps);
    }
  };

  this.contentSeeked = function() {
    if (this._contentSessionPlayerStateManager != null) {
        this._contentSessionPlayerStateManager.setPlayerSeekEnd();
    }
  };

  this.setPlayerWidthAndHeight = function(width, height) {
    if (this._contentSessionPlayerStateManager != null) {
        this._contentSessionPlayerStateManager.setVideoResolutionWidth(width);
        this._contentSessionPlayerStateManager.setVideoResolutionHeight(height);
    }
  };

  this.contentReportCustomEvent = function(event, attributes) {
    if (this._client != null && this._currentConvivaSessionKey != Conviva.Client.NO_SESSION_KEY) {
        this._client.sendCustomEvent(this._currentConvivaSessionKey, event + ", " + attributes);
    }
  };

  this.contentReportError = function(errorMessage, errorSeverity) {
    if (this._client != null && this._currentConvivaSessionKey != Conviva.Client.NO_SESSION_KEY) {
        this._client.reportError(this._currentConvivaSessionKey, errorMessage, errorSeverity);
    }
  };
  // Gathers all relevant application information for a particular video playback
  // inside a Conviva ContentMetadata object.
  this.buildConvivaContentMetadata = function (userData, metadata) {
    var contentMetadata = new Conviva.ContentMetadata();

    // Recommended format for the assetName, using both the ID of the video content and its title
    contentMetadata.assetName = "[" + metadata.id + "] " + metadata.title;

    // The stream url for this video content.
    // For manifest-based streaming protocols, it should point to the top-level manifest.
    contentMetadata.streamUrl = metadata.url;

    // The type of stream for this content. Usually either live or VOD.
    // Sometimes the application may not know right away, in which case you have the option to set it to Unknown
    // and possibly fill the gap later on.
    contentMetadata.streamType = metadata.live ? Conviva.ContentMetadata.StreamType.LIVE : Conviva.ContentMetadata.StreamType.VOD;

    // Duration of this particular video stream.
    // If this information is available to your application from your Content Management System,
    // you can supply it here.
    // Otherwise, the PlayerInterface will have to extract it from the video player.
    contentMetadata.duration = metadata.durationSec; // in seconds

    // Frame rate this particular video stream was encoded at.
    // If this information is available to your application from your Content Management System,
    // you can supply it here.
    // Otherwise, the PlayerInterface will have to extract it from the video player.
    contentMetadata.encodedFrameRate = metadata.frameRate;

    // Here we are playing progressive download content with a static bitrate,
    // and the HTML5 video element does not expose bitrate information.
    // We set the default bitrate to report for this content based on metadata
    // since the PlayerInterface cannot retrieve it from the HTML5 video player.
    contentMetadata.defaultBitrateKbps = metadata.bitrateKbps; // in Kbps

    // The Conviva Platform will be setup to parse the stream urls for your video assets
    // and infer the resource it is served from (CDN-level, possibly bucket-level/server-level).
    // In cases where the video application does not have access to a meaningful stream url
    // (local video proxy / some DRM wrappers), the Conviva Platform can be configured to
    // infer the resource from the defaultResource field instead.
    contentMetadata.defaultResource = "Akamai";

    // A human-readable identifier for your application.
    // Very helpful to filter traffic and compare performance for different builds of
    // the video application.
    contentMetadata.applicationName = "Telstra Internal";

    // An identifier for the current user. Can be obfuscated to ensure privacy.
    // Can be used to isolate video traffic for a particular and help with
    // video quality assessements/troubleshooting for that particular user.
    contentMetadata.viewerId = userData.id;

    // Custom metadata, usually defined in a metadata spreadsheet.
    // Based on the type of video application and the expectations in terms of
    // Conviva metrics and filtering capabilities.
    if (metadata != null && metadata.streamType != null) {
        contentMetadata.custom.streamType = metadata.streamType;
    }
    return contentMetadata;
  };
};
