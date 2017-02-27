var JDMRichmediaYT = (function(){
  function JDMRichmediaYT(containerJDMRichmediaYT,imgPath,frameObj,timelineObj,configPlayer){
    JDMRichmediaYT.scope = this;

    this.containerJDMRichmediaYT = containerJDMRichmediaYT;
    this.imgPath = imgPath;
    this.frameData = frameObj;
    this.timelineData = timelineObj;
    this.configPlayer = configPlayer;
    this.dataJDMRichmediaYT;

    this.initialLoad = true;

    this.containerVideo;
    this.containerYT;
    this.poster;
    this.arrayBtn = [];
    this.player;
    this.firstVideoRunning = true;

    this.counterImg = 0;
    this.totalImg = 0;
    this.arrayFrames = [];
    this.arrayElements = [];

    this.clicktag;

    this.iteration = 0;
    this.numTween = 0;
    this.lastLabelName;

    this.configureJDMRichmediaYT();
    this.addListeners();
  }

  JDMRichmediaYT.prototype.configureJDMRichmediaYT = function(){
    this.dataJDMRichmediaYT = {
      width: this.containerJDMRichmediaYT.getAttribute('data-w'),
      height: this.containerJDMRichmediaYT.getAttribute('data-h'),
      bgColor: this.containerJDMRichmediaYT.getAttribute('data-bg-color'),
      border: this.containerJDMRichmediaYT.getAttribute('data-border'),
      preload: this.containerJDMRichmediaYT.getAttribute('data-preload'),
      cover: this.containerJDMRichmediaYT.getAttribute('data-cover')
    }

    /* SET MAIN STYLES */

    this.containerJDMRichmediaYT.style.width = this.dataJDMRichmediaYT.width + 'px';
    this.containerJDMRichmediaYT.style.height = this.dataJDMRichmediaYT.height + 'px';
    this.containerJDMRichmediaYT.style.backgroundColor = this.dataJDMRichmediaYT.bgColor;
    this.containerJDMRichmediaYT.style.border = this.dataJDMRichmediaYT.border;

    /* SET COVER */

    if(this.dataJDMRichmediaYT.cover == "true") {
      var divCover = document.createElement('div');
      divCover.style.backgroundColor = this.dataJDMRichmediaYT.bgColor;
      divCover.style.zIndex = 2;
      divCover.setAttribute('id','cover');
      this.containerJDMRichmediaYT.appendChild(divCover);
    }

    /* SET VIDEO CONTAINER AND POSTER */

    this.containerVideo = document.createElement('div');
    this.containerVideo.setAttribute('id',this.configPlayer.playerObj.containerParentId);
    this.containerVideo.style.position = "relative";
    if(this.configPlayer.playerObj.containerParentAutoAlpha === 0){
      this.containerVideo.style.opacity = 0;
      this.containerVideo.style.visibility = 'hidden';
    }
    this.containerVideo.style.zIndex = 4;
    this.containerJDMRichmediaYT.appendChild(this.containerVideo);

    this.containerYT = document.createElement('div');
    this.containerYT.setAttribute('id','youtube-container');
    this.containerYT.style.position = 'absolute';
    this.containerYT.style.left = this.configPlayer.playerObj.pos.x + 'px';
    this.containerYT.style.top = this.configPlayer.playerObj.pos.y + 'px';
    this.containerVideo.appendChild(this.containerYT);

    this.poster = new Image();
    this.poster.src= this.imgPath + 'poster.png';
    this.poster.style.left = this.configPlayer.playerObj.pos.x + 'px';
    this.poster.style.top = this.configPlayer.playerObj.pos.y + 'px';
    this.poster.style.cursor = 'pointer';
    this.poster.style.zIndex = 2;
    this.poster.setAttribute('id','poster');
    this.poster.setAttribute('data','video1');
    this.containerVideo.appendChild(this.poster);

    /* SET BTNS VIDEO */

    var totalBtns = 0;

    this.configPlayer.playerObj.arrayIdVideos.forEach(function(i){
      totalBtns++;
    });

    if(this.configPlayer.playerObj.arrayBtnSrc.length > 1) {
      for (var i = 0; i < totalBtns; i++) {
        var btnTemp = new Image();
        var pointerCut = this.configPlayer.playerObj.arrayBtnSrc[i].indexOf(".");
        var stringSelected = this.configPlayer.playerObj.arrayBtnSrc[i].substr(0,pointerCut);

        btnTemp.src = this.imgPath + this.configPlayer.playerObj.arrayBtnSrc[i];
        btnTemp.style.left = this.configPlayer.playerObj.arrayBtnPosX[i] + 'px';
        btnTemp.style.top = this.configPlayer.playerObj.arrayBtnPosY[i] + 'px';
        btnTemp.style.cursor = 'pointer';
        btnTemp.setAttribute('id',stringSelected);
        btnTemp.setAttribute('data','video' + (i+1));
        JDMRichmediaYT.scope.arrayBtn.push(btnTemp);

        JDMRichmediaYT.scope.containerVideo.appendChild(btnTemp);
      }
    };

    /* SET FRAMES */

    var totalFrames = 0;
    var arrayIdFrames = [];

    for(var items in this.frameData){
      this.arrayElements.push(this.frameData[items]);
      arrayIdFrames.push(items.toString());
      totalFrames++;
    };

    for (var ii = 0; ii < totalFrames; ii++) {
      this.totalImg += this.arrayElements[ii].length;
    };

    for (var iii = 0; iii < totalFrames; iii++) {
      var divTemp = document.createElement('div');
      divTemp.classList.add('frame');
      divTemp.setAttribute('id',arrayIdFrames[iii]);
      this.containerJDMRichmediaYT.appendChild(divTemp);
      this.arrayFrames.push(divTemp);

      this.setImgs(this.arrayFrames[iii],this.arrayElements[iii]);
    };

    /* SET CLICKTAG */

    this.setClickTag();
  };

  JDMRichmediaYT.prototype.setImgs = function(frameSelected,elementsSelected){
    elementsSelected.forEach(function(i){
      var imgTemp = new Image();
      imgTemp.src = JDMRichmediaYT.scope.imgPath + i;
      frameSelected.appendChild(imgTemp);
      var pointerCut = i.indexOf(".");
      var stringSelected = i.substr(0,pointerCut);
      imgTemp.setAttribute('id',stringSelected);
      imgTemp.onload = JDMRichmediaYT.scope.imgLoaded();
    });
  };

  JDMRichmediaYT.prototype.imgLoaded = function(){
    JDMRichmediaYT.scope.counterImg++;
    if(JDMRichmediaYT.scope.counterImg == JDMRichmediaYT.scope.totalImg) JDMRichmediaYT.scope.createTimeLine();
  };

  /* SET LISTENERS */

  JDMRichmediaYT.prototype.addListeners = function(){
    this.clicktag.addEventListener('click', JDMRichmediaYT.scope.goClickTag);
    this.poster.addEventListener('click', JDMRichmediaYT.scope.onClickBtn);

    for(var i=0; i < this.arrayBtn.length; i++) {
      this.arrayBtn[i].addEventListener('mouseenter', JDMRichmediaYT.scope.overBtn);
      this.arrayBtn[i].addEventListener('mouseleave', JDMRichmediaYT.scope.outBtn);
      this.arrayBtn[i].addEventListener('click', JDMRichmediaYT.scope.onClickBtn);
    }
  }

  JDMRichmediaYT.prototype.overBtn = function(e){
    TweenMax.to(e.currentTarget, .5, {scale:.9, ease:Back.easeInOut});
  }

  JDMRichmediaYT.prototype.outBtn = function(e){
    TweenMax.to(e.currentTarget, .5, {scale:1, ease:Back.easeInOut})
  }

  /* CLICKTAG */

  JDMRichmediaYT.prototype.setClickTag = function(){
    this.clicktag = document.createElement('div');
    this.clicktag.setAttribute('id','clicktag');
    this.clicktag.style.position = "absolute";
    this.clicktag.style.width = this.containerJDMRichmediaYT.style.width;
    this.clicktag.style.height = this.containerJDMRichmediaYT.style.height;
    this.clicktag.style.opacity = 0;
    this.clicktag.style.cursor = 'pointer';
    this.clicktag.style.zIndex = 3;
    this.containerJDMRichmediaYT.appendChild(this.clicktag);
  }

  JDMRichmediaYT.prototype.goClickTag = function(){
    if(!JDMRichmediaYT.scope.firstVideoRunning) JDMRichmediaYT.scope.player.stopVideo();
    JDMRichmediaYT.scope.configPlayer.playerObj.clicktagFunction();
  }

 /* VIDEO FUNCTIONS */

  JDMRichmediaYT.prototype.onClickBtn = function(e) {
    var idSelected = e.currentTarget.getAttribute('id');
    var posArrayBtn = JDMRichmediaYT.scope.arrayBtn.indexOf(e.currentTarget);

    if(JDMRichmediaYT.scope.initialLoad == true) {

      JDMRichmediaYT.scope.firstVideoRunning = false;

      JDMRichmediaYT.scope.initialLoad = false;

      if(idSelected == 'poster') JDMRichmediaYT.scope.configPlayer.youtubeVideoId = JDMRichmediaYT.scope.configPlayer.playerObj.arrayIdVideos[0];

      else JDMRichmediaYT.scope.configPlayer.youtubeVideoId = JDMRichmediaYT.scope.configPlayer.playerObj.arrayIdVideos[posArrayBtn];

      TweenMax.to(JDMRichmediaYT.scope.poster, .5, {autoAlpha:0});

      JDMRichmediaYT.scope.player = new youTubeAdFeature(JDMRichmediaYT.scope.configPlayer);

      console.log('ver video');

      return;
    }

    JDMRichmediaYT.scope.showVideo(idSelected);
  }

  JDMRichmediaYT.prototype.showVideo = function(id){
    var idSelected = id;
    var indexBtn;

    if(idSelected === 'poster') {
      JDMRichmediaYT.scope.changePlayer(JDMRichmediaYT.scope.configPlayer.playerObj.arrayIdVideos[0]);
    } else {
      indexBtn = JDMRichmediaYT.scope.arrayBtn.indexOf(document.getElementById(idSelected));
      JDMRichmediaYT.scope.changePlayer(JDMRichmediaYT.scope.configPlayer.playerObj.arrayIdVideos[indexBtn]);
    }
    console.log('ver siguiente video');
  }

  JDMRichmediaYT.prototype.changePlayer = function(id){
    JDMRichmediaYT.scope.player.changeVideo(id);
  }

  JDMRichmediaYT.prototype.stopVideo = function(){
    JDMRichmediaYT.scope.player.stopVideo();
  }

  JDMRichmediaYT.prototype.createTimeLine = function(){

    /* CREATE TIMELINE */

    JDMRichmediaYT.scope.tl = new TimelineMax();
    JDMRichmediaYT.scope.tl.paused(true);

    /* SET TIMELINE */

    JDMRichmediaYT.scope.timelineData.arrayTween.forEach(function(i){
      JDMRichmediaYT.scope.numTween++;
      JDMRichmediaYT.scope.tl.addLabel('step_' + JDMRichmediaYT.scope.numTween);
      switch(i.type){
        case 'set':
          JDMRichmediaYT.scope.tl.add(TweenMax.set(i.id, i.prop),i.delay);
        break;
        case 'to':
          JDMRichmediaYT.scope.tl.add(TweenMax.to(i.id, i.time, i.prop),i.delay);
        break;
        case 'from':
          JDMRichmediaYT.scope.tl.add(TweenMax.from(i.id, i.time, i.prop),i.delay);
        break;
        case 'fromTo':
          JDMRichmediaYT.scope.tl.add(TweenMax.fromTo(i.id, i.time, i.propInit, i.propEnd),i.delay);
        break;
      }
    });

    JDMRichmediaYT.scope.tl.addCallback(
      function(){JDMRichmediaYT.scope.endTimeLine(JDMRichmediaYT.scope.timelineData.loopIteration, JDMRichmediaYT.scope.timelineData.loopLabelInit)}
    );

    if(JDMRichmediaYT.scope.timelineData.initLabel == undefined || JDMRichmediaYT.scope.timelineData.initLabel == false) JDMRichmediaYT.scope.tl.resume(0);
    else JDMRichmediaYT.scope.tl.resume(JDMRichmediaYT.scope.timelineData.initLabel);

    if(JDMRichmediaYT.scope.timelineData.addPauseAt != undefined) JDMRichmediaYT.scope.addPauseAt(JDMRichmediaYT.scope.timelineData.addPauseAt);
  };

  JDMRichmediaYT.prototype.endTimeLine = function(numRepeat, label){
    if(numRepeat == 1) return;
    else if(numRepeat == -1 || numRepeat == undefined) JDMRichmediaYT.scope.tl.resume(0);
    else{
      JDMRichmediaYT.scope.iteration++;
      if(numRepeat > 1 && JDMRichmediaYT.scope.iteration == numRepeat - 1) {
        var lastLabel;
        if(JDMRichmediaYT.scope.timelineData.loopLabelEnd == undefined || JDMRichmediaYT.scope.timelineData.loopLabelEnd == false) {
          lastLabel = JDMRichmediaYT.scope.tl.getLabelsArray()[JDMRichmediaYT.scope.tl.getLabelsArray().length-1];
          JDMRichmediaYT.scope.lastLabelName = lastLabel.name;
        } else {
          lastLabel = JDMRichmediaYT.scope.timelineData.loopLabelEnd;
          JDMRichmediaYT.scope.lastLabelName = lastLabel;
        }
        JDMRichmediaYT.scope.tl.addPause(JDMRichmediaYT.scope.lastLabelName);
      }
      if(JDMRichmediaYT.scope.iteration == numRepeat) return;
    }
    label != undefined || label == false ? JDMRichmediaYT.scope.tl.resume(label) : JDMRichmediaYT.scope.tl.resume(0);
  };

  JDMRichmediaYT.prototype.addPauseAt = function(labelOrSecond){
    JDMRichmediaYT.scope.tl.addPause(labelOrSecond);
  };

  return JDMRichmediaYT;
})();





