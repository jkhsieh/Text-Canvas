
// Copyright 2010 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

Doodle = function (domID, history) {

var canvas;
var context;
var canvasWidth = 490;
var canvasHeight = 220;
var padding = 25;
var lineWidth = 8;
var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var outlineImage = new Image();
var crayonImage = new Image();
var markerImage = new Image();
var eraserImage = new Image();
var crayonBackgroundImage = new Image();
var markerBackgroundImage = new Image();
var eraserBackgroundImage = new Image();
var crayonTextureImage = new Image();

var clickX = new Array();
var clickY = new Array();
var clickColor = new Array();
var clickTool = new Array();
var clickSize = new Array();
var clickDrag = new Array();

var paint = false;
var curColor = colorPurple;
var curTool = "crayon";
var curSize = "normal";
var mediumStartX = 18;
var mediumStartY = 19;
var mediumImageWidth = 93;
var mediumImageHeight = 46;
var drawingAreaX = 111;
var drawingAreaY = 11;
var drawingAreaWidth = 267;
var drawingAreaHeight = 200;
var toolHotspotStartY = 23;
var toolHotspotHeight = 38;
var sizeHotspotStartY = 157;
var sizeHotspotHeight = 36;
var sizeHotspotWidthObject = new Object();
sizeHotspotWidthObject.huge = 39;
sizeHotspotWidthObject.large = 25;
sizeHotspotWidthObject.normal = 18;
sizeHotspotWidthObject.small = 16;
var totalLoadResources = 8
var curLoadResNum = 0;


/**
* Calls the redraw function after all neccessary resources are loaded.
*/
function resourceLoaded()
{
	if(++curLoadResNum >= totalLoadResources){
		redraw();
	}
}


var evalHistoryJson = function() {
    clickX = history.clickX;
	clickY = history.clickY;
	clickTool = history.clickTool;
	clickColor = history.clickColor;
	clickSize = history.clickSize;
	clickDrag = history.clickDrag;
	
	redraw();
}

/**
* Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
*/
var prepareCanvas = function(domID)
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', domID);   //
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d"); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
	//     context = document.getElementById('canvas').getContext("2d");
	
	// Load images
	// -----------
	crayonImage.onload = function() { resourceLoaded(); 
	}
	crayonImage.src = "images/crayon-outline.png";
	//context.drawImage(crayonImage, 0, 0, 100, 100);
	
	markerImage.onload = function() { resourceLoaded(); 
	}
	markerImage.src = "images/marker-outline.png";
	
	eraserImage.onload = function() { resourceLoaded(); 
	}
	eraserImage.src = "images/eraser-outline.png";	
	
	crayonBackgroundImage.onload = function() { resourceLoaded(); 
	}
	crayonBackgroundImage.src = "images/crayon-background.png";
	
	markerBackgroundImage.onload = function() { resourceLoaded(); 
	}
	markerBackgroundImage.src = "images/marker-background.png";
	
	eraserBackgroundImage.onload = function() { resourceLoaded(); 
	}
	eraserBackgroundImage.src = "images/eraser-background.png";

	crayonTextureImage.onload = function() { resourceLoaded(); 
	}
	crayonTextureImage.src = "images/crayon-texture.png";
	
	outlineImage.onload = function() { resourceLoaded(); 
	}
	outlineImage.src = "images/watermelon-duck-outline.png";

	// Add mouse events
	// ----------------
	$('#'+domID).mousedown(function(e)
	{
		// Mouse down location
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		
		if(mouseX < drawingAreaX) // Left of the drawing area
		{
			if(mouseX > mediumStartX)
			{
				if(mouseY > mediumStartY && mouseY < mediumStartY + mediumImageHeight){
					curColor = colorPurple;
				}else if(mouseY > mediumStartY + mediumImageHeight && mouseY < mediumStartY + mediumImageHeight * 2){
					curColor = colorGreen;
				}else if(mouseY > mediumStartY + mediumImageHeight * 2 && mouseY < mediumStartY + mediumImageHeight * 3){
					curColor = colorYellow;
				}else if(mouseY > mediumStartY + mediumImageHeight * 3 && mouseY < mediumStartY + mediumImageHeight * 4){
					curColor = colorBrown;
				}
			}
		}
		else if(mouseX > drawingAreaX + drawingAreaWidth) // Right of the drawing area
		{
			if(mouseY > toolHotspotStartY)
			{
				if(mouseY > sizeHotspotStartY)
				{
					var sizeHotspotStartX = drawingAreaX + drawingAreaWidth;
					if(mouseY < sizeHotspotStartY + sizeHotspotHeight && mouseX > sizeHotspotStartX)
					{
						if(mouseX < sizeHotspotStartX + sizeHotspotWidthObject.huge){
							curSize = "huge";
						}else if(mouseX < sizeHotspotStartX + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge){
							curSize = "large";
						}else if(mouseX < sizeHotspotStartX + sizeHotspotWidthObject.normal + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge){
							curSize = "normal";
						}else if(mouseX < sizeHotspotStartX + sizeHotspotWidthObject.small + sizeHotspotWidthObject.normal + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge){
							curSize = "small";						
						}
					}
				}
				else
				{
					if(mouseY < toolHotspotStartY + toolHotspotHeight){
						curTool = "crayon";
					}else if(mouseY < toolHotspotStartY + toolHotspotHeight * 2){
						curTool = "marker";
					}else if(mouseY < toolHotspotStartY + toolHotspotHeight * 3){
						curTool = "eraser";
					}
				}
			}
		}
		else if(mouseY > drawingAreaY && mouseY < drawingAreaY + drawingAreaHeight)
		{
			// Mouse click location on drawing area
		}
		paint = true;
		addClick(mouseX, mouseY, false);
		redraw();
	});
	
	$('#'+domID).mousemove(function(e){
		if(paint==true){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	});
	
	$('#'+domID).mouseup(function(e){
		paint = false;
	  	redraw();
	});
	
	$('#'+domID).mouseleave(function(e){
		paint = false;
	});
	
	evalHistoryJson();
	
}

prepareCanvas(domID);


/**
* Adds a point to the drawing array.
* @param x
* @param y
* @param dragging
*/
function addClick(x, y, dragging)
{
	clickX.push(x);
	clickY.push(y);
	clickTool.push(curTool);
	clickColor.push(curColor);
	clickSize.push(curSize);
	clickDrag.push(dragging);
	
	//console.log(clickX);
	//console.log(clickY);
}

/**
* Clears the canvas.
*/
function clearCanvas()
{
	context.fillStyle = '#ffffff'; // Work around for Chrome
	context.fillRect(0, 0, canvasWidth, canvasHeight); // Fill in the canvas with white
	canvas.width = canvas.width; // clears the canvas 
}

/**
* Redraws the canvas.
*/
function redraw()
{
	// Make sure required resources are loaded before redrawing
	if(curLoadResNum < totalLoadResources){ return; }
	
	clearCanvas();
	
	var locX;
	var locY;
	if(curTool == "crayon")
	{
		// Draw the crayon tool background
		context.drawImage(crayonBackgroundImage, 0, 0, canvasWidth, canvasHeight);
		
		// Purple
		locX = (curColor == colorPurple) ? 18 : 52;
		locY = 19;
		
		context.beginPath();
		context.moveTo(locX + 41, locY + 11);
		context.lineTo(locX + 41, locY + 35);
		context.lineTo(locX + 29, locY + 35);
		context.lineTo(locX + 29, locY + 33);
		context.lineTo(locX + 11, locY + 27);
		context.lineTo(locX + 11, locY + 19);
		context.lineTo(locX + 29, locY + 13);
		context.lineTo(locX + 29, locY + 11);
		context.lineTo(locX + 41, locY + 11);
		context.closePath();
		context.fillStyle = colorPurple;
		context.fill();	

		if(curColor == colorPurple){
			context.drawImage(crayonImage, locX, locY, mediumImageWidth, mediumImageHeight);
		}else{
			context.drawImage(crayonImage, 0, 0, 59, mediumImageHeight, locX, locY, 59, mediumImageHeight);
		}
		
		// Green
		locX = (curColor == colorGreen) ? 18 : 52;
		locY += 46;
		
		context.beginPath();
		context.moveTo(locX + 41, locY + 11);
		context.lineTo(locX + 41, locY + 35);
		context.lineTo(locX + 29, locY + 35);
		context.lineTo(locX + 29, locY + 33);
		context.lineTo(locX + 11, locY + 27);
		context.lineTo(locX + 11, locY + 19);
		context.lineTo(locX + 29, locY + 13);
		context.lineTo(locX + 29, locY + 11);
		context.lineTo(locX + 41, locY + 11);
		context.closePath();
		context.fillStyle = colorGreen;
		context.fill();	

		if(curColor == colorGreen){
			context.drawImage(crayonImage, locX, locY, mediumImageWidth, mediumImageHeight);
		}else{
			context.drawImage(crayonImage, 0, 0, 59, mediumImageHeight, locX, locY, 59, mediumImageHeight);
		}
		
		// Yellow
		locX = (curColor == colorYellow) ? 18 : 52;
		locY += 46;
		
		context.beginPath();
		context.moveTo(locX + 41, locY + 11);
		context.lineTo(locX + 41, locY + 35);
		context.lineTo(locX + 29, locY + 35);
		context.lineTo(locX + 29, locY + 33);
		context.lineTo(locX + 11, locY + 27);
		context.lineTo(locX + 11, locY + 19);
		context.lineTo(locX + 29, locY + 13);
		context.lineTo(locX + 29, locY + 11);
		context.lineTo(locX + 41, locY + 11);
		context.closePath();
		context.fillStyle = colorYellow;
		context.fill();	

		if(curColor == colorYellow){
			context.drawImage(crayonImage, locX, locY, mediumImageWidth, mediumImageHeight);
		}else{
			context.drawImage(crayonImage, 0, 0, 59, mediumImageHeight, locX, locY, 59, mediumImageHeight);
		}
		
		// Yellow
		locX = (curColor == colorBrown) ? 18 : 52;
		locY += 46;
		
		context.beginPath();
		context.moveTo(locX + 41, locY + 11);
		context.lineTo(locX + 41, locY + 35);
		context.lineTo(locX + 29, locY + 35);
		context.lineTo(locX + 29, locY + 33);
		context.lineTo(locX + 11, locY + 27);
		context.lineTo(locX + 11, locY + 19);
		context.lineTo(locX + 29, locY + 13);
		context.lineTo(locX + 29, locY + 11);
		context.lineTo(locX + 41, locY + 11);
		context.closePath();
		context.fillStyle = colorBrown;
		context.fill();	

		if(curColor == colorBrown){
			context.drawImage(crayonImage, locX, locY, mediumImageWidth, mediumImageHeight);
		}else{
			context.drawImage(crayonImage, 0, 0, 59, mediumImageHeight, locX, locY, 59, mediumImageHeight);
		}
	}
	else if(curTool == "marker")
	{
		// Draw the marker tool background
		context.drawImage(markerBackgroundImage, 0, 0, canvasWidth, canvasHeight);
		
		// Purple
		locX = (curColor == colorPurple) ? 18 : 52;
		locY = 19;
		
		context.beginPath();
		context.moveTo(locX + 10, locY + 24);
		context.lineTo(locX + 10, locY + 24);
		context.lineTo(locX + 22, locY + 16);
		context.lineTo(locX + 22, locY + 31);
		context.closePath();
		context.fillStyle = colorPurple;
		context.fill();	

		if(curColor == colorPurple){
			context.drawImage(markerImage, locX, locY, mediumImageWidth, mediumImageHeight);
		}else{
			context.drawImage(markerImage, 0, 0, 59, mediumImageHeight, locX, locY, 59, mediumImageHeight);
		}
		
		// Green
		locX = (curColor == colorGreen) ? 18 : 52;
		locY += 46;
		
		context.beginPath();
		context.moveTo(locX + 10, locY + 24);
		context.lineTo(locX + 10, locY + 24);
		context.lineTo(locX + 22, locY + 16);
		context.lineTo(locX + 22, locY + 31);
		context.closePath();
		context.fillStyle = colorGreen;
		context.fill();	

		if(curColor == colorGreen){
			context.drawImage(markerImage, locX, locY, mediumImageWidth, mediumImageHeight);
		}else{
			context.drawImage(markerImage, 0, 0, 59, mediumImageHeight, locX, locY, 59, mediumImageHeight);
		}
		
		// Yellow
		locX = (curColor == colorYellow) ? 18 : 52;
		locY += 46;
		
		context.beginPath();
		context.moveTo(locX + 10, locY + 24);
		context.lineTo(locX + 10, locY + 24);
		context.lineTo(locX + 22, locY + 16);
		context.lineTo(locX + 22, locY + 31);
		context.closePath();
		context.fillStyle = colorYellow;
		context.fill();	

		if(curColor == colorYellow){
			context.drawImage(markerImage, locX, locY, mediumImageWidth, mediumImageHeight);
		}else{
			context.drawImage(markerImage, 0, 0, 59, mediumImageHeight, locX, locY, 59, mediumImageHeight);
		}
		
		// Yellow
		locX = (curColor == colorBrown) ? 18 : 52;
		locY += 46;
		
		context.beginPath();
		context.moveTo(locX + 10, locY + 24);
		context.lineTo(locX + 10, locY + 24);
		context.lineTo(locX + 22, locY + 16);
		context.lineTo(locX + 22, locY + 31);
		context.closePath();
		context.fillStyle = colorBrown;
		context.fill();	

		if(curColor == colorBrown){
			context.drawImage(markerImage, locX, locY, mediumImageWidth, mediumImageHeight);
		}else{
			context.drawImage(markerImage, 0, 0, 59, mediumImageHeight, locX, locY, 59, mediumImageHeight);
		}
	}
	else if(curTool == "eraser")
	{
		context.drawImage(eraserBackgroundImage, 0, 0, canvasWidth, canvasHeight);
		context.drawImage(eraserImage, 18, 19, mediumImageWidth, mediumImageHeight);	
	}else{
		alert("Error: Current Tool is undefined");
	}
	
	if(curSize == "small"){
		locX = 467;
	}else if(curSize == "normal"){
		locX = 450;
	}else if(curSize == "large"){
		locX = 428;
	}else if(curSize == "huge"){
		locX = 399;
	}
	locY = 189;
	context.beginPath();
	context.rect(locX, locY, 2, 12);
	context.closePath();
	context.fillStyle = '#333333';
	context.fill();	
	
	// Keep the drawing in the drawing area
	context.save();
	context.beginPath();
	context.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
	context.clip();
		
	var radius;
	var i = 0;
	for(; i < clickX.length; i++)
	{		
		if(clickSize[i] == "small"){
			radius = 2;
		}else if(clickSize[i] == "normal"){
			radius = 5;
		}else if(clickSize[i] == "large"){
			radius = 10;
		}else if(clickSize[i] == "huge"){
			radius = 20;
		}else{
			alert("Error: Radius is zero for click " + i);
			radius = 0;	
		}
		
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i], clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		
		if(clickTool[i] == "eraser"){
			//context.globalCompositeOperation = "destination-out"; // To erase instead of draw over with white
			context.strokeStyle = 'white';
		}else{
			//context.globalCompositeOperation = "source-over";	// To erase instead of draw over with white
			context.strokeStyle = clickColor[i];
		}
		context.lineJoin = "round";
		context.lineWidth = radius;
		context.stroke();
		
	}
	//context.globalCompositeOperation = "source-over";// To erase instead of draw over with white
	context.restore();
	
	// Overlay a crayon texture (if the current tool is crayon)
	if(curTool == "crayon"){
		context.globalAlpha = 0.4; // No IE support
		context.drawImage(crayonTextureImage, 0, 0, canvasWidth, canvasHeight);
	}
	context.globalAlpha = 1; // No IE support
	
	// Draw the outline image
	context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);

}//redraw


/*
*/
function stringifyHistory() {
	var history = new Object();
	history.clickX = clickX;
	history.clickY = clickY;
	history.clickTool = clickTool;
	history.clickColor = clickColor;
	history.clickSize = clickSize;
	history.clickDrag = clickDrag;
	
	var jsonTextarea = document.getElementById("jsonTextarea");
	jsonTextarea.value = JSON.stringify(history);
}

}//Doodle


/**/
//modified from example on http://www.captain.at/howto-ajax-process-xml.php

var http_request = false;

function getDoodles(url) {   //returns HTML (external source)
    $.ajax({
        url:"selectJson.php", success:function(result){
            //get url doodles array, eval, add doodles
            doodles = (eval('(' + result + ')')).doodles;     //eval DANGER!!
            for(i = 0; i<doodles.length; i++){
                new Doodle("canvas"+doodles[i].id, doodles[i].history);
            }
        }
    });
    /*
    http_request = false;
    
    if(window.XMLHttpRequest) { //Mozilla, Safari, etc.
        http_request = new XMLHttpRequest();
        if(http_request.overrideMimeType) {
            http_request.overrideMimeType('text/xml');
        }
    } else if(window.ActiveXObject) {   //IE
        try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            try {
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) { }
        }
    }
    
    if(!http_request) {
        alert('Cannot create XMLHTTP instance. Abort getDoodles().');
        return false;
    }
    
    //parse params?
    
    http_request.onreadystatechange = alertContents;    //callback
    http_request.open('GET', url, true);
    http_request.send(null);
    */
}//function getDoodles

/**/
function alertContents() {
    if (http_request.readyState == 4) {     //http DONE
        if (http_request.status == 200) {   //OK
            
            //get url doodles array, eval, add doodles
            doodles = eval('(' + http_request.responseText + ')');  //DANGERous way!!
            for(i = 0; i<doodles.length; i++){
                addDoodle("canvasDiv", i, doodles[i].id, doodles[i].history);
            }
            
            
        } else {
            alert('There was a problem with the request.');
        }
    }
}//function alertContents

/**/
function addDoodle(doodleRID, doodleHistory) {
    new Doodle("canvas"+doodleRID, doodleHistory);
}
