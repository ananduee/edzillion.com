---
layout: article
title: 'Colour Filtering Animations in CreateJS'
date: '2012-11-20'
categories: ['code','games']
tags: ['createjs','easeljs','coding','javascript','animation','games']
image: 'createjs-filters.png'
scripts: ['js/article.js']
---


I am games designer and (temporary, embarrased) programmer for [Simple Lifeforms](http://www.simplelifeforms.com) and we are currently working on a really cool html5/js/nodejs browser-based game called [Vampire Cities](http://vampirecities). We did quite a bit of testing of the various 2d engines out there (crafty.js kinetic.js etc) and decided upon using the easel.js library from the [create.js](http://www.createjs.com) suite because it seemed to have the right balance between functionality and ease of use. 

It's easy enough to do most basic animation stuff, and adding a colour filter to a sprite seemed obvious enough, but that was only for static (non-animating) `Bitmap` and `image` objects. What *wasn't* obvious, and why you are here (and if this is at all useful), is how to use a `ColorFilter` with a `BitmapAnimation`. I looked around and there isn't really any info on how to do this, so FWIW here is my solution.

**Note**, I am using code from a recent tower defense game I made as a test project for trying out CreateJS. It is in a mostly working state but not finished, if you are interested in having a look, commenting or whatever, the [full github repo is here](https://github.com/edzillion/towerzillion/).

Before We Start
---

If you haven't played with CreateJS before you will need to get up to speed. This tutorial doesn't cover setting up, but I encourage you to give it a go - [download EaselJS here](http://www.createjs.com/#!/EaselJS), and there are plenty of good tutorials out there though I think [this one is the best by far](http://blogs.msdn.com/b/davrous/archive/2011/07/21/html5-gaming-animating-sprites-in-canvas-with-easeljs.aspx) and includes and images etc to use which saves some time.

We will be using the ColorFilter.js class to apply colour transformations. **ColorFilter is not included in the default EaselJS package so you will need to download it seperately and include it in your scripts**. [Get it here](https://github.com/CreateJS/EaselJS/tree/master/src/easeljs/filters), and include it after EaselJS:

<gist>4348144</gist>


The Technique
---

At first I thought you would be able to apply a filter dynamically; by creating the filter `colorFilter = new ColorFilter();` and applying to the animation like so `bitmapanimation.filters = [colorFilter]` but I was probably hoping for too much out of EaselJS and javascript graphics rendering in general. Instead what I ended up doing was creating a duplicate spritesheet with the filter applied for every colour filter I wanted to use and then switch between them while animating. This will work as long as your spritesheet is a regular rectangle with no extra space around the sprite frames, and by-the-by the spritesheet doesn't need to be full either (i.e. you can have a sheet with missing frames).

![](./img/wizard-with-filters.png)

Creating The Extra Sprite Sheets On Load
---

The code below is pretty self-explanatory, adding more filters is just a case of creating more `ColorFilter`s, processing and adding them to the `imgArray` (although you would probably hit perfomance issues with a too many since the browser would be dealing with rather large images in memory):

<gist>4348984</gist>

This will create the extra frames we need to smoothly animate our sprite with filters, but the above has no animations set on the spritesheet so this wizard won't do a whole lot. We need to duplicate the sprite's animations in a similar manner. But first we should talk about managing graphics data. 

The Data Model
---

I am storing my graphics data in JSON format since JS understands it natively and we can just plug it straight in where we need it. My `gamemanifest.json` file looks something like this:

<gist>4349128</gist>

JSON array formatting is really long winded, but it's clear and concise.

Creating The Filter Animations
---

So now that we have some animation data we can use that to create our 'filter animations'. Animations in EaselJS are just arrays of frame numbers, or a start and end frame if the frames are in sequence. So the first animation, the left facing walk-cycle is `"left": [0,7,"left",16]`. The first two are start and end frames, "left" refers to the next animation to be played (so it loops), and the last is the speed of the animation. Since the frames start at 0 then the frame number of the first frame of the first filtered sheet (the top left red wizard in the image above) is going to be the amount of frames in the original sheet. By this logic we can take all the original animations and add `frames in original sheet * sheet index` where sheet index refers to the order that the sheet appears horizontally on the spritesheet (or the index in the `imgArray` - same thing).

The final code is straight from the game so there are a few things to note.

* I am using the new(ish) jQuery deferred object, and you should too. It's a clear way to code around those asynchronous javascript execution problems.
* This function just adds the rendered sprite sheet to the `game.graphics.spritesheets` for use later, we are using deferred to make sure our graphics are good before we continue with loading the game.

<gist>4349423</gist>

Then if we do something like:

<code>
var filter = 'blue';  
var wizard = new createjs.BitmapAnimation(game.graphics.spritesheets[0]);  
stage.addChild(wizard);  
wizard.gotoAndPlay(filter+'down');  
</code>

We have a filtered wizard!
---

![](./img/wizard-filtered.png)

In my game I was using filters to show damage and effects (red for hit, blue for slow), so I had to figure out how to transition between the different animations, and stack different effects if they lasted different lengths. I am not going to go through that here but if there is some interest (?) I could do a part 2 ...

Comments & questions are always welcome.