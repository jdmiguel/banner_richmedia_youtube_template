var RichmediaYT = (function(){
  function RichmediaYT(containerRichmediaYT,imgPath,frameObj,timelineObj,configPlayer){
    RichmediaYT.scope = this;

    this.containerRichmediaYT = containerRichmediaYT;
    this.imgPath = imgPath;
    this.frameData = frameObj;
    this.timelineData = timelineObj;
    this.configPlayer = configPlayer;
    this.dataRichmediaYT;

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

    this.configureRichmediaYT();
    this.addListeners();
  }

  RichmediaYT.prototype.configureRichmediaYT = function(){
    this.dataRichmediaYT = {
      width: this.containerRichmediaYT.getAttribute('data-w'),
      height: this.containerRichmediaYT.getAttribute('data-h'),
      bgColor: this.containerRichmediaYT.getAttribute('data-bg-color'),
      border: this.containerRichmediaYT.getAttribute('data-border'),
      preload: this.containerRichmediaYT.getAttribute('data-preload'),
      cover: this.containerRichmediaYT.getAttribute('data-cover')
    }

    /* SET MAIN STYLES */

    this.containerRichmediaYT.style.width = this.dataRichmediaYT.width + 'px';
    this.containerRichmediaYT.style.height = this.dataRichmediaYT.height + 'px';
    this.containerRichmediaYT.style.backgroundColor = this.dataRichmediaYT.bgColor;
    this.containerRichmediaYT.style.border = this.dataRichmediaYT.border;

    /* SET COVER */

    if(this.dataRichmediaYT.cover == "true") {
      var divCover = document.createElement('div');
      divCover.style.backgroundColor = this.dataRichmediaYT.bgColor;
      divCover.style.zIndex = 2;
      divCover.setAttribute('id','cover');
      this.containerRichmediaYT.appendChild(divCover);
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
    this.containerRichmediaYT.appendChild(this.containerVideo);

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

    if(this.configPlayer.playerObj.arrayBtnSrc != undefined) {
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
        RichmediaYT.scope.arrayBtn.push(btnTemp);

        RichmediaYT.scope.containerVideo.appendChild(btnTemp);
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
      this.containerRichmediaYT.appendChild(divTemp);
      this.arrayFrames.push(divTemp);

      this.setImgs(this.arrayFrames[iii],this.arrayElements[iii]);
    };

    /* SET CLICKTAG */

    this.setClickTag();
  };

  RichmediaYT.prototype.setImgs = function(frameSelected,elementsSelected){
    elementsSelected.forEach(function(i){
      var imgTemp = new Image();
      imgTemp.src = RichmediaYT.scope.imgPath + i;
      frameSelected.appendChild(imgTemp);
      var pointerCut = i.indexOf(".");
      var stringSelected = i.substr(0,pointerCut);
      imgTemp.setAttribute('id',stringSelected);
      imgTemp.onload = RichmediaYT.scope.imgLoaded();
    });
  };

  RichmediaYT.prototype.imgLoaded = function(){
    RichmediaYT.scope.counterImg++;
    if(RichmediaYT.scope.counterImg == RichmediaYT.scope.totalImg) RichmediaYT.scope.createTimeLine();
  };

  /* SET LISTENERS */

  RichmediaYT.prototype.addListeners = function(){
    this.clicktag.addEventListener('click', RichmediaYT.scope.goClickTag);
    this.poster.addEventListener('click', RichmediaYT.scope.onClickBtn);

    for(var i=0; i < this.arrayBtn.length; i++) {
      this.arrayBtn[i].addEventListener('mouseenter', RichmediaYT.scope.overBtn);
      this.arrayBtn[i].addEventListener('mouseleave', RichmediaYT.scope.outBtn);
      this.arrayBtn[i].addEventListener('click', RichmediaYT.scope.onClickBtn);
    }
  }

  RichmediaYT.prototype.overBtn = function(e){
    TweenMax.to(e.currentTarget, .5, {scale:.9, ease:Back.easeInOut});
  }

  RichmediaYT.prototype.outBtn = function(e){
    TweenMax.to(e.currentTarget, .5, {scale:1, ease:Back.easeInOut})
  }

  /* CLICKTAG */

  RichmediaYT.prototype.setClickTag = function(){
    this.clicktag = document.createElement('div');
    this.clicktag.setAttribute('id','clicktag');
    this.clicktag.style.position = "absolute";
    this.clicktag.style.width = this.containerRichmediaYT.style.width;
    this.clicktag.style.height = this.containerRichmediaYT.style.height;
    this.clicktag.style.opacity = 0;
    this.clicktag.style.cursor = 'pointer';
    this.clicktag.style.zIndex = 3;
    this.containerRichmediaYT.appendChild(this.clicktag);
  }

  RichmediaYT.prototype.goClickTag = function(){
    if(!RichmediaYT.scope.firstVideoRunning) RichmediaYT.scope.player.stopVideo();
    RichmediaYT.scope.configPlayer.playerObj.clicktagFunction();
  }

 /* VIDEO FUNCTIONS */

  RichmediaYT.prototype.onClickBtn = function(e) {
    var idSelected = e.currentTarget.getAttribute('id');
    var posArrayBtn = RichmediaYT.scope.arrayBtn.indexOf(e.currentTarget);

    if(RichmediaYT.scope.initialLoad == true) {

      RichmediaYT.scope.firstVideoRunning = false;

      RichmediaYT.scope.initialLoad = false;

      if(idSelected == 'poster') RichmediaYT.scope.configPlayer.setIdVideo = RichmediaYT.scope.configPlayer.playerObj.arrayIdVideos[0];

      else RichmediaYT.scope.configPlayer.setIdVideo = RichmediaYT.scope.configPlayer.playerObj.arrayIdVideos[posArrayBtn];

      TweenMax.to(RichmediaYT.scope.poster, .5, {autoAlpha:0});

      RichmediaYT.scope.player = new youTubeAdFeature(RichmediaYT.scope.configPlayer);

      console.log('ver video');

      return;
    }

    RichmediaYT.scope.showVideo(idSelected);
  }

  RichmediaYT.prototype.showVideo = function(id){
    var idSelected = id;
    var indexBtn;

    if(idSelected === 'poster') {
      RichmediaYT.scope.changePlayer(RichmediaYT.scope.configPlayer.playerObj.arrayIdVideos[0]);
    } else {
      indexBtn = RichmediaYT.scope.arrayBtn.indexOf(document.getElementById(idSelected));
      RichmediaYT.scope.changePlayer(RichmediaYT.scope.configPlayer.playerObj.arrayIdVideos[indexBtn]);
    }
    console.log('ver siguiente video');
  }

  RichmediaYT.prototype.changePlayer = function(id){
    RichmediaYT.scope.player.changeVideo(id);
  }

  RichmediaYT.prototype.stopVideo = function(){
    RichmediaYT.scope.player.stopVideo();
  }

  RichmediaYT.prototype.createTimeLine = function(){

    /* CREATE TIMELINE */

    RichmediaYT.scope.tl = new TimelineMax();
    RichmediaYT.scope.tl.paused(true);

    /* SET TIMELINE */

    RichmediaYT.scope.timelineData.arrayTween.forEach(function(i){
      RichmediaYT.scope.numTween++;
      RichmediaYT.scope.tl.addLabel('step_' + RichmediaYT.scope.numTween);
      switch(i.type){
        case 'set':
          RichmediaYT.scope.tl.add(TweenMax.set(i.id, i.prop),i.delay);
        break;
        case 'to':
          RichmediaYT.scope.tl.add(TweenMax.to(i.id, i.time, i.prop),i.delay);
        break;
        case 'from':
          RichmediaYT.scope.tl.add(TweenMax.from(i.id, i.time, i.prop),i.delay);
        break;
        case 'fromTo':
          RichmediaYT.scope.tl.add(TweenMax.fromTo(i.id, i.time, i.propInit, i.propEnd),i.delay);
        break;
      }
    });

    RichmediaYT.scope.tl.addCallback(
      function(){RichmediaYT.scope.endTimeLine(RichmediaYT.scope.timelineData.loopIteration, RichmediaYT.scope.timelineData.loopLabelInit)}
    );

    if(RichmediaYT.scope.timelineData.initLabel == undefined || RichmediaYT.scope.timelineData.initLabel == false) RichmediaYT.scope.tl.resume(0);
    else RichmediaYT.scope.tl.resume(RichmediaYT.scope.timelineData.initLabel);

    if(RichmediaYT.scope.timelineData.addPauseAt != undefined) RichmediaYT.scope.addPauseAt(RichmediaYT.scope.timelineData.addPauseAt);
  };

  RichmediaYT.prototype.endTimeLine = function(numRepeat, label){
    if(numRepeat == 1) return;
    else if(numRepeat == -1 || numRepeat == undefined) RichmediaYT.scope.tl.resume(0);
    else{
      RichmediaYT.scope.iteration++;
      if(numRepeat > 1 && RichmediaYT.scope.iteration == numRepeat - 1) {
        var lastLabel;
        if(RichmediaYT.scope.timelineData.loopLabelEnd == undefined || RichmediaYT.scope.timelineData.loopLabelEnd == false) {
          lastLabel = RichmediaYT.scope.tl.getLabelsArray()[RichmediaYT.scope.tl.getLabelsArray().length-1];
          RichmediaYT.scope.lastLabelName = lastLabel.name;
        } else {
          lastLabel = RichmediaYT.scope.timelineData.loopLabelEnd;
          RichmediaYT.scope.lastLabelName = lastLabel;
        }
        RichmediaYT.scope.tl.addPause(RichmediaYT.scope.lastLabelName);
      }
      if(RichmediaYT.scope.iteration == numRepeat) return;
    }
    label != undefined || label == false ? RichmediaYT.scope.tl.resume(label) : RichmediaYT.scope.tl.resume(0);
  };

  RichmediaYT.prototype.addPauseAt = function(labelOrSecond){
    RichmediaYT.scope.tl.addPause(labelOrSecond);
  };

  return RichmediaYT;
})();





