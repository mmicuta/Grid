// 1.0 Install paper.js event handlers
paper.install(window);


// 1.1 VARIABLES

var n = 10;
var fadeIncrement = 0.1;
var lightnessLimit = 0.5;

var hueInit = Math.floor(Math.random() * 360);
var paperHue = hueInit;
var paperSaturation = 0.8;
var radiusFactor = 0.86;
var gw = 0;
var patternCode;

var ratioWidth;
var ratioHeight;


// 1.2 FUNCTIONS

// Change Base (i.e. binary to hex)
(function(){

    var ConvertBase = function (num) {
        return {
            from : function (baseFrom) {
                return {
                    to : function (baseTo) {
                        return parseInt(num, baseFrom).toString(baseTo);
                    }
                };
            }
        };
    };
        
    // binary to decimal
    ConvertBase.bin2dec = function (num) {
        return ConvertBase(num).from(2).to(10);
    };
    
    // binary to hexadecimal
    ConvertBase.bin2hex = function (num) {
        return ConvertBase(num).from(2).to(16);
    };
    
    // binary to radix-36
    ConvertBase.bin2rad = function (num) {
        return ConvertBase(num).from(2).to(36);
    };
    
    // decimal to binary
    ConvertBase.dec2bin = function (num) {
        return ConvertBase(num).from(10).to(2);
    };
    
    // decimal to hexadecimal
    ConvertBase.dec2hex = function (num) {
        return ConvertBase(num).from(10).to(16);
    };
    
    // hexadecimal to binary
    ConvertBase.hex2bin = function (num) {
        return ConvertBase(num).from(16).to(2);
    };
    
    // radix-64 to binary
    ConvertBase.rad2bin = function (num) {
        return ConvertBase(num).from(36).to(2);
    };
    
    // hexadecimal to decimal
    ConvertBase.hex2dec = function (num) {
        return ConvertBase(num).from(16).to(10);
    };
    
    this.ConvertBase = ConvertBase;
    
})(this);


// 1.3 UI CONTROLS

// Slider to control grid density
$(function () {
	$( "#slider_count" ).slider({
		value: n,
		min: 5,
		max: 15,
		step: 1,
		slide: function (event, ui) {
			n = ui.value;
			circles();
        },
        change: function (event, ui) {
			n = ui.value;
			circles();
		}
	});
});

// Slider to control hue
$(function () {
	$( "#slider_hue" ).slider({
		value: hueInit,
		min: 0,
		max: 360,
		step: 10,
		slide: function (event, ui) {
            paperHue = ui.value;
		}
	});
});

// Slider to control saturation
$(function () {
	$( "#slider_sat" ).slider({
		value: 0.8,
		min: 0.5,
		max: 0.8,
		step: 0.02,
        slide: function (event, ui) {
			paperSaturation = ui.value;
		}
	});
});

// Slider to control circle radius
$(function () {
	$( "#slider_rad" ).slider({
		value: 0.5,
		min: 0.2,
		max: 0.86,
		step: 0.02,
        slide: function (event, ui) {
			radiusFactor = ui.value;
		}
	});
});

// Switch state and fill of object
function switchState(input, delay) {
    stepCount = 1/fadeIncrement;
    fadeDelay = Math.floor(delay * (stepCount*(1 / 60)) * 1000) / 2;
    setTimeout(function(){
        if (input.state === 0) {
            input.fadeToggle = 2;
            input.state = 1;
            input.strokeWidth = 0.5;
        } else if (input.state === 1) {
            input.fadeToggle = 1;
            input.state = 0;
            input.strokeWidth = 0.5;
        }
    }, fadeDelay);
}

// Change opacity of object based on its colour
function fadeFill(input) {
    if (input.state === 0) {
        input.fillColor.lightness = 0.5;
    } else {
        input.fillColor.lightness = 0.8;
    }
}

// Change opacity of object based on its colour
function scaleStroke(input) {
    input.strokeWidth = 1.5;
    if (input.borderState === 1) {
        input.strokeColor = 0;
    }
}

// Change opacity of object based on its colour
function unScaleStroke(input) {
    input.strokeWidth = 0.5;
    if (input.borderState === 1) {
        input.strokeColor = 1;
    }
}

// Invert fill of all circles
function invertFill(input) {
    for (var i = 0; i < input.children.length; i++) {
        switchState(input.children[i]);
    }
}

// Clear fill to all white
function clearFill(input) {
    for (var i = 0; i < input.children.length; i++) {
        if (input.children[i].state === 0) {
            switchState(input.children[i]);
        }
    }
    //recordPattern(input);
}

// Switch border style
function switchStroke(input) {
    for (var i = 0; i < input.children.length; i++) {
        if (input.children[i].borderState === 1) {
            input.children[i].strokeColor = 0;
            input.children[i].borderState = 0;
        } else if (input.children[i].borderState === 0) {
            input.children[i].strokeColor = 1;
            input.children[i].borderState = 1;
        }
        //console.log(input.children[i].borderState);
    }
}

// Random fill x% of cells
function randomFill(input) {
    for (var i = 0; i < input.children.length; i++) {
        if (input.children[i].state === 0) {
            if (Math.random()<0.05) {
                switchState(input.children[i]);
            }
        } else {
            if (Math.random()>0.05) {
                switchState(input.children[i]);
            }
        }
    }
    //recordPattern(input);
}

// Use slider to change hue
function changeHue(input) {
    for (var i = 0; i < input.children.length; i++) {
        input.children[i].fillColor.hue = paperHue;
    }
}

// Use slider to change saturation
function changeSat(input) {
    for (var i = 0; i < input.children.length; i++) {
        if (input.children[i].state != 1) {
            input.children[i].fillColor.lightness = paperSaturation;
        }
    }
}

// Use slider to change radius
function changeRadius(input) {
    for (var i = 0; i < input.children.length; i++) {
        input.children[i].radius = (radiusFactor*gw) / 2;
    }
}

// Clear data for circle group and children
function clearData(input) {
    for (var i = 0; i < input.children.length; i++) {
        delete input.children[i];
    }
    delete input;
}

// Record Pattern
function recordPattern(input) {
    patternCode = "";
    for (var i = 0; i < input.children.length; i++) {
        codeItem = input.children[i].state;
        patternCode.concat(codeItem.toString());
        patternCode = patternCode + codeItem.toString();
        //console.log(patternCode);
    }
    patternHex = ConvertBase.bin2rad(patternCode);
    $("#patternCode").text(patternHex);
    //console.log(patternHex);
}

// Open Canvas preview in new tab
function previewCanvas(input) {
    var canvasPreview = input.toDataURL();
    window.open(canvasPreview, "Grid Preview");
}

// Change to Poster Aspect Ratio
function ratioPoster() {
    //ratioWidth = $(".canvascontainer").innerWidth();
    //ratioHeight = ratioWidth * 1.618;
    
    ratioHeight = $(document).innerHeight() - 200;
    ratioWidth = ratioHeight / 1.618;
    
    //console.log(ratioWidth, ratioHeight);
    //circles();
}

// Change to Screen Aspect Ratio
function ratioScreen() {
    screenWidth = screen.width;
    screenHeight = screen.height;
    
    ratioWidth = $(".canvascontainer").innerWidth();
    //canvasScale = screenWidth / ratioWidth;
    canvasScale = ratioWidth / screenWidth;
    ratioHeight = canvasScale * screenHeight;
    
    //console.log(ratioWidth, ratioHeight);
    //circles();
}

// Set grid parameters from aspect ratio



// 2.0 PAPER.JS

function circles() {
	// Reference canvas element
	var canvas = document.getElementById("canvas01"); 

	// Clear previous canvas
	paper.clear(canvas);
    if (typeof circleGroup !== 'undefined') {
        clearData(circleGroup);
    }
    
    var canvasWidth = ratioWidth;
    var canvasHeight = ratioHeight;
    
    //console.log(canvasWidth, canvasHeight);

    // Define height and width divisions by screen proportions
    if (canvasHeight >= canvasWidth) {
        var nw = n;
        var gw = canvasWidth/n;
        var nh = Math.floor(canvasHeight/gw);
        var h3 = canvasHeight-(nh*gw);
        var w3 = 0;
    } else {
        var nh = n;
        var gw = canvasHeight/n;
        var nw = Math.floor(canvasWidth/gw);
        var w3 = canvasWidth-(nw*gw);
        var h3 = 0;
    }


	var h1 = canvasHeight;
	var w1 = canvasWidth;
	var h2 = canvasHeight - gw;
	var w2 = canvasWidth - gw;
	var radius = (radiusFactor*gw) / 2;


	// Adjust canvas size to window size and centre it
	canvas.height = h1;
	canvas.width = w1;
	canvas.style.margin = "0 auto";



    
	// Setup Paper.js project
	paper.setup(canvas);


	// Choose a random next direction for the switchState pathway to move to
	function randomPath(oldX, oldY, oldAdds) {

		possiblePaths = [[1,0],[-1,0],[0,1],[0,-1]]
		shuffleArray(possiblePaths);

		newXAdd = [];
		newYAdd = [];
		invalidCircle = 1;
		
		for (var z = 0; z < 4; z++) {
			newPath = possiblePaths[z];
			newX = oldX + newPath[0];
			newY = oldY + newPath[1];

			if (newX < 0) {
				continue;
			} else if (newX >= nw) {
				continue;
			} else if (newY < 0) {
				continue;
			} else if (newY >= nh) {
				continue;
			}

			newCoords = [newX,newY];
			checkIndex = -1
			testVal = []
			testVal2 = []

			for (var zz = 0; zz < oldAdds.length; zz++) {
				checkAdd = []
				checkAddX = oldAdds[zz].address_x
				checkAddY = oldAdds[zz].address_y
				testVal.push([checkAddX,checkAddY] + " ")
				if ((newX == checkAddX)&&(newY == checkAddY)) {
					checkIndex = 0
					continue
				}
			}


			testVal2.push([newX,newY] + " ")

			if (checkIndex === -1) {
				newXAdd = newX;
				newYAdd = newY;
				invalidCircle = 0;
				break;
			} else {
				invalidCircle = 1;
			}
		}
	}

    
	// Cellular Automata function, switch circle state based on neighbours
	function automata(input, delay) {
			var count = 0;
			var neighbours = [];
			for (var i = -1; i <= 2; i++) {
				for (var j = -1; j <= 2; j++) {
					var x = input.address_x + i;
					var y = input.address_y + j;

					// Check against boundary conditions, stop process when adjacent to edges.
					if (x < 0) {
						continue;
					} else if (x >= nw) {
						continue;
					} else if (y < 0) {
						continue;
					} else if (y >= nh) {
						continue;
					}

					var neighbour = project.getItem({address_x: x, address_y: y})
					var value = neighbour.state;
					count += value;
					neighbours.push(neighbour);
				}
			}	

			switchState(input, delay);
	}    

	// Create automata pathway from selected circle
	function automataPathway(input) {

		var oldAddresses = []
		var possibleAddresses = []
		var firstAddress = [input.address_x,input.address_y];
		oldX = input.address_x
		oldY = input.address_y
		var firstAddressCoords = {address_x:oldX, address_y:oldY}
		oldAddresses.push(firstAddressCoords);
		switchState(input);

		for (var k = 0; k < (Math.min(nw,nh)/2); k++){

			if (k < 2) {

				negXAdd = input.address_x - k;
				posXAdd = input.address_x + k;
				negYAdd = input.address_y - k;
				posYAdd = input.address_y + k;

				if (negXAdd < 0) {
					continue;
				} else if (negXAdd >= nw) {
					continue;
				} else if (posXAdd < 0) {
					continue;
				} else if (posXAdd >= nw) {
					continue;
				} else if (negYAdd < 0) {
					continue;
				} else if (negYAdd >= nh) {
					continue;
				} else if (posYAdd < 0) {
					continue;
				} else if (posYAdd >= nh) {
					continue;
				}

				negX = project.getItem({
					address_x: negXAdd,
					address_y: oldY
				})

				posX = project.getItem({
					address_x: posXAdd,
					address_y: oldY
				})

				negY = project.getItem({
					address_x: oldX,
					address_y: negYAdd
				})		

				posY = project.getItem({
					address_x: oldX,
					address_y: posYAdd
				}) 

				negXCoords = {address_x:negXAdd, address_y:oldY}
				posXCoords = {address_x:posXAdd, address_y:oldY}
				negYCoords = {address_x:oldX, address_y:negYAdd}
				posYCoords = {address_x:oldX, address_y:posYAdd}

				oldAddresses.push(negXCoords);
				oldAddresses.push(posXCoords);
				oldAddresses.push(negYCoords);
				oldAddresses.push(posYCoords);

				automata(negX, k/2);
				automata(posX, k/2);
				automata(negY, k/2);
				automata(posY, k/2);

			} else {

				randomPath(negX.address_x, negX.address_y, oldAddresses);
				if (invalidCircle === 0) {
					negX = project.getItem({
						address_x: newXAdd,
						address_y: newYAdd
					})
					newCoords = {address_x:newXAdd, address_y:newYAdd}
					oldAddresses.push(newCoords);
					automata(negX, k/2);			
				}


				randomPath(posX.address_x, posX.address_y, oldAddresses);
				if (invalidCircle === 0) {
					posX = project.getItem({
						address_x: newXAdd,
						address_y: newYAdd
					})
					newCoords = {address_x:newXAdd, address_y:newYAdd}
					oldAddresses.push(newCoords);
					automata(posX, k/2);
				}

				randomPath(negY.address_x, negY.address_y, oldAddresses);
				if (invalidCircle === 0) {
					negY = project.getItem({
						address_x: newXAdd,
						address_y: newYAdd
					})
					newCoords = {address_x:newXAdd, address_y:newYAdd}
					oldAddresses.push(newCoords);
					automata(negY, k/2);
				}

				randomPath(posY.address_x, posY.address_y, oldAddresses);
				if (invalidCircle === 0) {
					posY = project.getItem({
						address_x: newXAdd,
						address_y: newYAdd
					})
					newCoords = {address_x:newXAdd, address_y:newYAdd}
					oldAddresses.push(newCoords);
					automata(posY, k/2);
				}
			}
		}	
	};

	

	// Record if the mouse is clicked
	mouse = 1;
	$("#canvas01").mousedown(function(){
		mouse = 0;
	});
	$("#canvas01").mouseup(function(){
		mouse = 1;
	});



	// Create centroid point coordinates
	var centroidsArray = []
	for (var i = 0; i <= nw-1; i++) {
		for (var j = 0; j <= nh-1; j++) {
			var centroid = new paper.Point({state:1});
			centroid.x = ((w1-w2)/2)+gw*i+(w3/2);
			centroid.y = ((h1-h2)/2)+gw*j+(h3/2);
			centroid.address_x = i;
			centroid.address_y = j;
			centroidsArray.push(centroid);
		}
	};

	// Draw circles from point coordinates and radius
	circleGroup = new Group();

	for (var i = 0; i < centroidsArray.length; i++) {
		var centroid = centroidsArray[i]
		var circle = []
		circle = new paper.Path.Circle(new paper.Point(centroid.x, centroid.y), radius);
		circle.state = centroidsArray[i].state;
		circle.activated = 0;
		circle.address_x = centroidsArray[i].address_x;
		circle.address_y = centroidsArray[i].address_y;
		circle.fadeToggle = 0;
		circle.fillColor = {hue: paperHue, saturation: 0.5, lightness: paperSaturation};
		circle.strokeColor = {hue: 0, saturation: 0, lightness: 0};
		circle.strokeWidth = 0.5;
        circle.borderState = 0;
		if (circle.state === 1) {
            
		} else {
			circle.fillColor.lightness = paperSaturation;
			circle.state = 0;
		}
		circleGroup.addChild(circle);


		// Mouse event based behaviour
		circle.onMouseEnter = function(){		
			scaleStroke(this);
		}

		circle.onMouseLeave = function(){		
			if (mouse === 0) {
				switchState(this,0);
            }
            unScaleStroke(this);
            
		}		

		circle.onClick = function(){
			automataPathway(this);
		}		

	};
    
    view.onFrame = function(event){
            
        // Record live pattern
        recordPattern(circleGroup);


        // Gradual fade using onFrame functionality
        function fadeTo(increment, delay) {
            eventStart = event.count;
            eventDelta = eventStart

            stepCount = paperSaturation/increment;
            fadeStart = (delay * stepCount) + eventStart;
            stepSize = [];

            if (event.count >= fadeStart) {
                stepSize = 0;
            } else {
                stepSize = increment;
            }

            for (var i = 0; i < circleGroup.children.length; i++) {
                fadeValue = circleGroup.children[i].fillColor.lightness;
                if ((circleGroup.children[i].fadeToggle === 1) && (fadeValue >= (paperSaturation + increment))) {
                    circleGroup.children[i].fillColor.lightness -= stepSize;
                } else if ((circleGroup.children[i].fadeToggle === 2) && (fadeValue < 1)) {
                    circleGroup.children[i].fillColor.lightness += stepSize;
                } else {
                    circleGroup.children[i].fadeToggle = 0;
                }
            }
        }
        fadeTo(fadeIncrement);
    }

	$( "#bdr" ).click(function() {
		switchStroke(circleGroup);
	} );

	$( "#inv" ).click(function() {
		invertFill(circleGroup);
	} );

	$( "#clr" ).click(function() {
		clearFill(circleGroup);
	} );

	$( "#rnd" ).click(function() {
		randomFill(circleGroup);
	} );
    
    $( "#poster" ).click(function() {
        ratioPoster();
    } );

    $( "#screen" ).click(function() {
        ratioScreen();
    } );
    
    $( "#prev" ).click(function() {
        previewCanvas(canvas);
	} );
    
    $( "#slider_hue" ).on( "slidechange", function( event, ui ) {
        changeHue(circleGroup);
        console.log(paperHue);
    } );
    
    $( "#slider_hue" ).on( "slide", function( event, ui ) {
        changeHue(circleGroup);
        console.log(paperHue);
    } );
    
    $( "#slider_sat" ).on( "slidechange", function() {
        changeSat(circleGroup);
        console.log(paperSaturation);
    } );
    
    $( "#slider_sat" ).on( "slide", function( event, ui ) {
        changeSat(circleGroup);
        console.log(paperSaturation);
    } );
    
    $( "#slider_rad" ).on( "slide", function( event, ui ) {
        changeRadius(circleGroup);
        console.log(radius);
    } );

	paper.view.draw();

};

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}



//Setup SVG Canvas
$(document).ready(function() {
    ratioPoster()
    circles();
    //recordPattern(circleGroup);
});

//Resize canvas to match window size
$(window).resize(function() {
	//circles();
});