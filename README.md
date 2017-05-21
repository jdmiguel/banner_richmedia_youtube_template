## RICHMEDIA YOUTUBE PLUGIN JAVASCRIPT

### DESCRIPTION

This repository provides a javascript plugin (no JQUERY) to develop richmedia banners with video youtube embed. When you try this, you will check how your **production performance** has improved.

### REQUERIMENTS

Before starting, you need to save images to the banner size (as .png or .jpg) because in the template, the images are positioned absolutely, in left 0 and top 0...
Furthermore, you need to know the [GSAP] (https://greensock.com/gsap) libraries because this template use those to animate.

### LAYOUT

You shouldn´t be worry with the banner layout. The only thing you have to do is *customize the data attributes of the div that contains the banner*.

### CUSTOMIZING IMG AND VIDEO PATH

The only thing you have to do is introducing the correct path in the vars (imgPath and videoPath).

### CUSTOMIZING THE FRAME OBJECT

This object creates the layout inside the wrap container.

Firstly, You should decide the frames number of your banner (it depends on the animation). Once you have decided it, you choose the frame order into frame object to position the div created (with an id equal to the name of the frame that you have choosen) inside the banner container div. Finally, you have to push into the frame array the image src for each image you are going to use and you have to put in the correct order for positioning into each frame.

### CUSTOMIZING THE CLICKTAG

A function called *clicktagFunction* where you can put the clicktag code.

### CUSTOMIZING THE CONFIG PLAYER

Inside this object, you will find a couple of objects:

*PLAYEROBJ*

This object lets you customize the player. You have the next properties:

* WIDTH: **The player width**
* HEIGHT: **The player height**
* POS: **The player positions** in x and y
* CONTAINERPARENTID: **The id of the parent player container**
* CONTAINERPARENTAUTOALPHA: If this value is zero, **the parent player container sets its opacity** to zero **and its visibility** to hidden.
* CLICKTAGFUNCTION: **The clicktag function**.
* SETIDVIDEO: By setting the **initial video**.
* ARRAYIDVIDEOS: By setting the **order of the videos**
* ARRAYBTNSRC: **The file name of every video button**.
* ARRAYBTNPOSX: **The x position of every video button**.
* ARRAYBTNPOSY: **The y position of every video button**.

*YOUTUBEPLAYEROPTIONS*

With this object, you can change differents video properties such as setting video controls or activating the video autoplay.

### CUSTOMIZING THE TIMELINE OBJECT

This object creates a specific timeline based in the [GSAP TIMELINEMAX] (https://greensock.com/docs/#/HTML5/GSAP/TimelineMax/).

At the beginning, there are some properties such as the initial label which the timeline starts or the loops number of the banner...
After, there is the tweens array. It´s really the hard job... For each element of this array you have the next properties:

* TYPE: This is the *main [TWEENMAX] (https://greensock.com/docs/#/HTML5/GSAP/TweenMax/) method*. You can choose between **set, to, from or fromTo**.
* ID: **The object id**. It´s been composed with *the hash symbol plus the name of the correspondent image src*, without the extension (.png or .jpg). For instance: *'#txt1'*
* TIME: It´s **the animation duration**. It only works with the to, from and fromTo types.
* PROP: **The properties have been changed across the tweens**. In the case of the fromTo type, you must customize both initial and ending properties.
* DELAY: **The delay time of the tween**.
