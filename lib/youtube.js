// *************************************************************
//   This class is part of the  Sizmek HTML5 YouTube Ad Feature
//   ALL RIGHTS RESERVED TO © 2016 Sizmek, Inc.
// *************************************************************
// *************************************************************

youTubeAdFeature = function (config)
{
	// Save Reference to Script Name
	var scriptName		= "youtube";
	// Script Version
	var scriptVersion	= "0.0.1";
	// Last Modified
	var lastModified	= "2016-2-26";
	// Template version
	var templateVersion = "1.0.0";
	// Debugging
	var isDebug = false;
	// Establish Boolean to track if YouTube Script has been loaded
    var youtubeAPILoaded = false;
    // Determine Format
    var isStandard;
    // Create Object to hold YouTube Players
    this.youtubePlayer;
    // Establish Reference to this
    var self = this;
    // Establish Reference to YouTube API onReady on the window
    window.onYouTubeIframeAPIReady = initPlayer;
    //boolean indicates if the video is ready
    this.isVideoReady = false;

    init();

	// Initiliaze YouTube Player
    function init()
    {
    	// Show Content - Flicker Fix
    	document.body.style.display = "block";

    	// Get Format
    	try { isStandard = EB._adConfig.templateName === "Html5Banner" ? true : false; } catch (err) {};

    	// Check if YouTube Script has been added already && ad isn't Standard
        if (!youtubeAPILoaded && !isStandard)
        {
            // Update Boolean
            youtubeAPILoaded = true;
            // Create Script Tag
            var youtubeScript = document.createElement("script");
            // Update Script Tag Source
            youtubeScript.src = "https://www.youtube.com/iframe_api";
            // Add Script to page
            document.getElementsByTagName("head")[0].appendChild(youtubeScript);
            // DO NOT REMOVE THE FOLLOWING
            // Track Ad Feature for Billing
            //trackAdFeatures('impression', 'AF_HTML5_Youtube_Video_6231');
        }

        // DO NOT REMOVE THE FOLLOWING
        // Track Ad Features - accepts interaction name and impression type

       /* function trackAdFeatures(_interaction, _noun)
        {
        	// Establish var to track local mode
        	var isServed;
        	// Verify ad is not local
        	try { isServed = EB._isServingMode(); } catch (err) {};

			if (isServed)
			{
				try
				{
					// Grab Ad ID
					var adId = EB._adConfig.adId;
					// Grab Session ID
					var sId = EB._adConfig.sID;
					// Build Tracking Pixel
					var trackingPixel = "https://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=19&mc=imp&pli=16479316&PluID=0&ord=%time%&rtu=-1&pcp=$$sID=" + sId + "|adID=" + adId + "|interactionName=" + _interaction + "|noun=" + _noun + "$$";
					// Fire Tracking Pixel by creating a new image.
					new Image().src = trackingPixel;
				}
					catch (err)
				{}
			}
        }*/

        // Create YouTube Object to pass to youTube API
        var player =
        {
           	// Update Element Id from Element
            elementId: config.playerObj.containerId,
            // Update Asset Source from Element
            //assetSrc: EB.getAssetUrl(config.containerId),
            // Update Container Id from Element
            container: config.playerObj.containerId,
            // Reference to the YouTube Player Element
            player: null,
            // Interval Counter for Progress Monitoring
            monitor: null,
            // Interface & Event Dispatcher for the EBG.VideoModule
            youtubeWrapper: null,
            // Establish Object to hold new YouTube Player
            config: {
            	// YouTube Video Id, found in YouTube Video URL
                videoId: config.setIdVideo,
                // YouTube Video Width
                width: config.playerObj.width,
                // YouTube Video Height
                height: config.playerObj.height,
                // Additional YouTube Player Vars
                playerVars: config.youtubePlayerOptions,
                // Create Event Listeners for YouTube Player
                events:
                {
                	// Listen for Ready State
                    'onReady': onReady,
                    // Listen for Errors
                    'onError': function(_obj) { onError(_obj); },
                    // Listen for State Change
                    'onStateChange': function(_obj) { onStateChange(_obj); }
                }
            },
            // Create An Object to hold Player Properties
            properties: {}
        };
        // Add This YouTube Instance to Array of YouTube Players
        this.youtubePlayer = player;
    }

	// Called once YouTube API is available
    function initPlayer()
    {
    	if (!isStandard)
    	{
    		this.youtubePlayer.player = new YT.Player(this.youtubePlayer.container, this.youtubePlayer.config);
    	}
    }

    // Handle YouTube onReady Event
    function onReady()
    {
		// Check if YouTube Wrapper Exists for this YouTube Instance
        if (!this.youtubePlayer.youtubeWrapper)
        {
        	// Create youtube Wrapper For this YouTube Instance
            onBeforeVideoStart(this.youtubePlayer);
        }

        this.isVideoReady = true;

        //this.youtubePlayer.player.playVideo();

    }

    // Handle YouTube Errors
    function onError(_obj)
    {
    	var error = _obj.data;

    	//console.log('onError: ' + error);

        /*
         2 – The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.
         5 – The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.
         100 – The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.
         101 – The owner of the requested video does not allow it to be played in embedded players.
         150 – This error is the same as 101. It's just a 101 error in disguise!
        //*/

    }

    // Handle YouTube Player State Change
    function onStateChange(_obj)
    {
		// Save Reference to Current State
        var state = _obj.data;
		// Handle Player State
        switch(state) {
            // Unstarted, triggered with HTML5 only
            case -1:
                break;
            // Video Ended - 0
            case YT.PlayerState.ENDED:
            	// Handle onComplete Event
                onComplete(this.youtubePlayer);
                break;
            // Video Playing - 1
            case YT.PlayerState.PLAYING:
            	// Handle Playing Event
                onResume(this.youtubePlayer);
                break;
            // Video Paused Event - 2
            case YT.PlayerState.PAUSED:
            	// Handle Paused Event
                onPause(this.youtubePlayer);
                break;
            // Video Buffering - 3
            case YT.PlayerState.BUFFERING:
            	// Do Something
                break;
            // Video Cued - 5
            case YT.PlayerState.CUED:
                onBeforeVideoStart(this.youtubePlayer);
                break;
        }
    }

    // Triggered on replay (single video) and next (playlist)
    function onBeforeVideoStart(_youtubePlayer)
    {
        // Stop Monitoring the Video
        stopProgressMonitor(_youtubePlayer);
        // Start Monitor the Video
        startProgressMonitor(_youtubePlayer);
		// Save YouTube Properties
        _youtubePlayer.properties = {
        	// Save Reference to Player Volume Method
            volume: _youtubePlayer.player.getVolume(),
            // Save Reference to Player Muted Method
            muted: _youtubePlayer.player.isMuted(),
            // Save Reference to Player Time Method
            currentTime: _youtubePlayer.player.getCurrentTime(),
            // Playing Timer
            triggerPause: null
        };

		// Create New YouTube Wrapper
        if(_youtubePlayer.youtubeWrapper != undefined) _youtubePlayer.youtubeWrapper = undefined;
		_youtubePlayer.youtubeWrapper = new youtubeWrapper(_youtubePlayer);

        // Check If EBG Object Exists
        if (typeof EBG != "undefined" && typeof EBG.VideoModule != "undefined")
        {
        	// Initialize EBG Video Module
            new EBG.VideoModule(_youtubePlayer.youtubeWrapper);
        }
    }

	// Handle On Complete Event, Dispatch Ended Event
    function onComplete(_youtubePlayer)
    {
    	_youtubePlayer.youtubeWrapper.dispatchEvent("ended");
    }

	// Handle Playing Event
    function onResume(_youtubePlayer)
    {
    	// Dispath Playing Event
        _youtubePlayer.youtubeWrapper.dispatchEvent("play");

        // Stop Timer
        clearTimeout(_youtubePlayer.triggerPause);
        // Clear Timer
        _youtubePlayer.triggerPause = null;
    }

    // Handle Pause Event
    function onPause(_youtubePlayer)
    {
		// Save Reference to Current Video Time
        var vidTime = _youtubePlayer.player.getCurrentTime();
        // Save Reference to Video Duration
        var vidDuration = _youtubePlayer.player.getDuration();

        // At the end of the video, PAUSED is triggered before ENDED. Don't track this as pauses interaction.
        if (vidTime < vidDuration && !_youtubePlayer.triggerPause)
        {
			// Clear Timer
            _youtubePlayer.triggerPause = null;
            // Start Pause Timer
            _youtubePlayer.triggerPause = setTimeout(function() { _youtubePlayer.youtubeWrapper.dispatchEvent("pause"); }, 250);
        }
    }

    // Handle Progress Monitor
    function startProgressMonitor(_youtubePlayer)
    {
    	// Create Progress Timer
        _youtubePlayer.monitor = window.setInterval(function()
        {
			// Establish Reference to Player Volume, Check if Muted
            var vol = _youtubePlayer.player.isMuted() ? 0 : _youtubePlayer.player.getVolume();
			// Check for Volume Change
            if (_youtubePlayer.properties.volume !== vol || _youtubePlayer.properties.muted !== _youtubePlayer.player.isMuted())
            {
            	// Update Volume
                _youtubePlayer.properties.volume = vol;
                // Update Mute State
                _youtubePlayer.properties.muted = _youtubePlayer.player.isMuted();
                // Dispatch Volume Change Event
                _youtubePlayer.youtubeWrapper.dispatchEvent("volumechange");
        	}

			// Check For Time Change
            if(_youtubePlayer.properties.currentTime !== _youtubePlayer.player.getCurrentTime())
            {
				// Check to see if User is Seeking
                if(Math.abs(_youtubePlayer.player.getCurrentTime() - _youtubePlayer.properties.currentTime) > 1)
                {
                	// Dispatch Seeking Event
                    _youtubePlayer.youtubeWrapper.dispatchEvent("seeking");
					// Do Not Trigger Pause, Stop Timer
                    clearTimeout(_youtubePlayer.triggerPause);
                    // Clear Timer
                    _youtubePlayer.triggerPause = null;
            	}
				// Update Current Time
                _youtubePlayer.properties.currentTime = _youtubePlayer.player.getCurrentTime();
                // Dispatch Time Event
                _youtubePlayer.youtubeWrapper.dispatchEvent("timeupdate");
            }
        }, 200);
    }

    // Stop Progress Monitor
    function stopProgressMonitor(_youtubePlayer)
    {
    	window.clearInterval(_youtubePlayer.monitor);
    }

}

// Open Playback controls and player settings
youTubeAdFeature.prototype = {

    isReady: function(){
        return self.isVideoReady;
    },

    // Make Player Resize Method Public
    changeVideo: function(_id)
    {
        self.youtubePlayer.player.stopVideo();
        //self.youtubePlayer.player.seekTo(0, true);
        self.youtubePlayer.player.loadVideoById(_id,0);
    },

	// Make Player Resize Method Public
	setSize: function(_h, _w)
	{
		self.youtubePlayer.player.setSize(_h, _w);
    },

    // Make Player Play Method Public
    playVideo: function()
    {
	   	self.youtubePlayer.player.playVideo();
    },

    // Make Player Pause Method Public
    pauseVideo: function()
    {
	    self.youtubePlayer.player.pauseVideo();
    },

    // Make Player Stop Method Public
	stopVideo: function()
    {
	    self.youtubePlayer.player.stopVideo();
    },

    clearVideo: function()
    {
        self.youtubePlayer.player.clearVideo();
    },

    destroyVideo: function()
    {
        self.youtubePlayer.player.destroy();
    },

    // Make Player Stop Method Public
	seekTo: function(_seconds, _allowSeekAhead)
    {
	    self.youtubePlayer.player.seekTo(_seconds, _allowSeekAhead);
    }
}

youtubeWrapper = function(_config)
{
	// Establish Reference to script
	var self = this;
	// Establish Reference to YouTube ID from Config Object
    var id = _config.elementId;
    // Establish Reference to Player container from Config Object
    var player = _config.player;
    // Establish Reference to Dummy Asset Url, asset url + id , e.g. //Site-2/WSFolders/429112//youtube_1
    var src = _config.assetSrc;
    // Create Array to hold Event Listeners
    self.listeners = [];

    // Mimic the Video Module Id Method, return YouTube Video ID
	Object.defineProperty(self, "id", { get: function() { return id;}  });
	// Mimic the Video Module Source Method, Return Dummy Asset URL used for tracking
    Object.defineProperty(self, "src", { get: function() { return src;} });
    // Mimic the Video Module Current Source Method, Return Dummy Asset URL used for tracking
    Object.defineProperty(self, "currentSrc", { get: function() { return src;} });
    // Mimic the Video Module Volume Method, return 0 - 100
    Object.defineProperty(self, "volume", { get: function() { return player.getVolume();} });
    // Mimic the Video Module Mute Method, returns true/false
    Object.defineProperty(self, "muted", { get: function() { return player.isMuted();} });
    // Mimic the Video Module Current Time Method, returns seconds
    Object.defineProperty(self, "currentTime", { get: function() { return player.getCurrentTime();} });
    // Mimic the Video Module Duration Method, returns seconds
    Object.defineProperty(self, "duration", { get: function() { return player.getDuration();} });
    // Youtube doesn't support Fullscreen, return false
    Object.defineProperty(self, "webkitSupportsFullscreen", { get: function() { return false; } });
    // Youtube doesn't support Fullscreen, return false
    Object.defineProperty(self, "webkitDisplayingFullscreen", { get: function() { return false; } });

	return self;
}

youtubeWrapper.prototype = {
    // Public Methods that mimic the <video> element's methods
    addEventListener: function(_event, _listener, _bubbles)
    {
    	// Add Event Listener to Listener Array
        this.listeners.push({ event: _event, listener: _listener, bubbles: _bubbles});
    },
    // Handle the Removal of Event Listeners
    removeEventListener: function(_event)
    {
    	// Loop through Listener Array
        for (var i = 0; i < this.listeners.length; i++)
        {
        	// Check for Event
            if (this.listeners[i].event === _event)
            {
            	// Remove Event
                this.listeners.splice(i, 1);
            }
        }
    },
    // Handle Play Function
    play: function()
    {
    	this.player.play();
    },

    // Non-Public Methods, used by the YouTube component
    dispatchEvent: function(_event, _info)
    {
		// Loop through Listeners Array
        for (var i = 0; i < this.listeners.length; i++)
        {
			// Establish Refence to current Listener
            var eventListener = this.listeners[i];
			// Check for Event
            if (eventListener.event === _event)
            {
				// Create Object to hold Params
                var params = { type: _event, info: _info };
				// Check for function
                if (typeof(eventListener.listener) === 'function')
                {
                    // Add Params to Event Listener
                    eventListener.listener(params);
                }
                	else
                {
                	// Fire Event
                    eventListener.listener.handleEvent(params);
                }
            }
        }
    }
};



