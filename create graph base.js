var version = "1.4.0";

//screen size 1920 x 1080
var height = 1080;
var width = 1920;
var numberOfMiddleLines = 0;// if you want to add custom number of horizontal lines, change this value(0 means number of y values - 1)
var margin = 300;
var strokeWidth = 4;
var strokeColor = [0, 0, 0]; // Black color

var textYPosFromBottomLine = 50;
var xValues = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000"];

var textXPosFromLeftLine = 70;
var yValues = ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];

var numOfGraphs = 3;
var graphWidth = 10;
var graphColor = [25, 25, 25];

// var yValues = {'start': 0, 'end': 100, 'step': 10};




/***
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
 */

// get timestamp of datetime
function getTimestamp() {
    var date = new Date();
    var timestamp = date.getTime();
    return timestamp;
}

//create graph name with timestamp
var graphName = "graph_anim_" + getTimestamp() + "(" + version + ")";
var linesName = 'lines' + '(' + version + ')';
var xvaluesName = 'xvalues' + '(' + version + ')';
var yvaluesName = 'yvalues' + '(' + version + ')';
var graphsName = 'graphs' + '(' + version + ')';


// Create a new composition
var graphAnimComp = app.project.items.addComp(graphName, width, height, 1, 10, 30);
var linesComp = app.project.items.addComp(linesName, width, height, 1, 10, 30);
var xvaluesComp = app.project.items.addComp(xvaluesName, width, height, 1, 10, 30);
var yvaluesComp = app.project.items.addComp(yvaluesName, width, height, 1, 10, 30);
var graphsComp = app.project.items.addComp(graphsName, width, height, 1, 10, 30);
graphAnimComp.layers.add(linesComp);
graphAnimComp.layers.add(xvaluesComp);
graphAnimComp.layers.add(yvaluesComp);
graphAnimComp.layers.add(graphsComp);

function createGraphLayers() {
    var graphBaseName = "Graph_Base";

    for(index = 0; index < numOfGraphs; index++){
        var shapeLayer = graphsComp.layers.addShape();
        shapeLayer.name = graphBaseName + "_" + (index + 1);
        //make Path in Shape in Contents in Shape Layer
        var shapeGroup = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        var shapeGroupContents = shapeGroup.property("ADBE Vectors Group");
        shapeGroupContents.addProperty("ADBE Vector Shape - Group");
        var stroke = shapeGroupContents.addProperty("ADBE Vector Graphic - Stroke");

        stroke.property("ADBE Vector Stroke Color").setValue(graphColor); // Black color
        stroke.property("ADBE Vector Stroke Width").setValue(graphWidth); // Line width
    }

}


function zoomGraphs() {
    var layers = graphsComp.layers;
    for (var i = 1; i <= layers.length; i++) {
        var layer = layers[i];
        
        layer.property("Scale").expression =
        'var scaleControlLayer = comp("'+graphName+'").layer("Scale Control");\n'+
        'var endScaleValue = scaleControlLayer.scale;\n'+
        'value = endScaleValue;'
    }


    for (var i = 1; i <= layers.length; i++) {
        var layer = layers[i];

        var initialPos = layer.property("Position").value;

        layer.property("Position").expression =
        'var scaleControlLayer = comp("'+graphName+'").layer("Scale Control");\n'+
        'var endScaleValue = scaleControlLayer.scale;\n'+
        'var scaleFactor = endScaleValue / 100; // Assuming the start scale is 100%\n'+
        'var anchorValueX = scaleControlLayer.anchorPoint[0] + '+width/2+';\n'+
        'var anchorValueY = scaleControlLayer.anchorPoint[1] + '+height/2+';\n'+
        'var anchorValue = ['+initialPos[0]+' - anchorValueX, '+initialPos[1]+' - anchorValueY];\n'+
        'var moveDistance = [anchorValue[0]*scaleFactor[0], anchorValue[1]*scaleFactor[1]];\n'+
        'value = [moveDistance[0] + anchorValueX, moveDistance[1] + anchorValueY];';

    }
}

// Function to create a shape layer with a line
function createLine(startPoint, endPoint, lineName) {
    var start = [startPoint[0] - width/2, startPoint[1] - height/2];
    var end = [endPoint[0] - width/2, endPoint[1] - height/2];
    var shapeLayer = graphAnimComp.layers.addShape();
    shapeLayer.name = lineName;
    var shapeGroup = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    var shapeGroupContents = shapeGroup.property("ADBE Vectors Group");
    var pathGroup = shapeGroupContents.addProperty("ADBE Vector Shape - Group");
    var path = pathGroup.property("ADBE Vector Shape");
    var myPath = new Shape();
    myPath.vertices = [start, end];
    path.setValue(myPath);
    var stroke = shapeGroupContents.addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("ADBE Vector Stroke Color").setValue(strokeColor); // Black color
    stroke.property("ADBE Vector Stroke Width").setValue(strokeWidth); // Line width
}

// Function to create a dotted line shape layer
function createDottedLine(startPoint, endPoint, lineName, dashLength, gapLength) {

    // Set default values if they are not provided
    dashLength = (dashLength !== undefined) ? dashLength : 2;
    gapLength = (gapLength !== undefined) ? gapLength : 10;

    var start = [startPoint[0] - width/2, startPoint[1] - height/2];
    var end = [endPoint[0] - width/2, endPoint[1] - height/2];
    
    var shapeLayer = linesComp.layers.addShape();
    shapeLayer.name = lineName;
    var shapeGroup = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    var shapeGroupContents = shapeGroup.property("ADBE Vectors Group");
    var pathGroup = shapeGroupContents.addProperty("ADBE Vector Shape - Group");
    var path = pathGroup.property("ADBE Vector Shape");
    var myPath = new Shape();
    myPath.vertices = [start, end];
    path.setValue(myPath);
    var stroke = shapeGroupContents.addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("ADBE Vector Stroke Color").setValue(strokeColor); // Black color
    stroke.property("ADBE Vector Stroke Width").setValue(strokeWidth); // Line width
    var dashGroup = stroke.property("ADBE Vector Stroke Dashes");
    var dash = dashGroup.addProperty("ADBE Vector Stroke Dash 1");
    dash.setValue(dashLength); // Dash length
    var gap = dashGroup.addProperty("ADBE Vector Stroke Gap 1");
    gap.setValue(gapLength); // Gap length
}


//set the stroke not to affected the thickness by zooming
function keepStrokeWidthConstant(layers, constantWidth) {


    // Add a Slider Control to the "Main" composition for stroke width
    var scaleController = graphAnimComp.layer("Scale Control");
    var sliderControl = scaleController.property("Effects").addProperty("ADBE Slider Control");
    sliderControl.name = "Stroke Width Control";
    sliderControl.property("Slider").setValue(constantWidth); // Default stroke width, adjust as needed

    var scaleExpression = 
    'targetScale = comp("'+graphName+'").layer("Scale Control").transform.scale[1] / 100;\n' + 
    'initialStrokeWidth = comp("'+graphName+'").layer("Scale Control").effect("Stroke Width Control")("Slider");\n' +
    'initialStrokeWidth / targetScale;';

    for (var i = 1; i <= layers.length; i++) {
        var layer = layers[i];

        if (layer.property("Contents")) {
            var contents = layer.property("Contents");

            for (var j = 1; j <= contents.numProperties; j++) {
                var shapeGroup = contents.property(j);

                if (shapeGroup.property("Contents")) {
                    var shapeContents = shapeGroup.property("Contents");

                    for (var k = 1; k <= shapeContents.numProperties; k++) {
                        var shapeElement = shapeContents.property(k);

                        if (shapeElement.matchName == "ADBE Vector Graphic - Stroke") {
                            var width = shapeElement.property("ADBE Vector Stroke Width");
                            width.expression = scaleExpression;
                        }
                    }
                }
            }
        }
    }
}

function centerAnchorPoint( layer ){
    var comp = layer.containingComp;
    var curTime = comp.time;

    /* find center by bounding box of the layer */
    var y = layer.sourceRectAtTime(curTime, false).height/2;
    var x = layer.sourceRectAtTime(curTime, false).width/2;

    /* we need this for text layer */
    y += layer.sourceRectAtTime(curTime, false).top;
    x += layer.sourceRectAtTime(curTime, false).left;

    //set only y anchor point
    layer.anchorPoint.setValue([ x, y ]);

};

function createXText(position, textContent, textName) {
    var textLayer = xvaluesComp.layers.addText(textContent);
    centerAnchorPoint(textLayer);
    textLayer.name = textName;
    textLayer.property("Position").setValue(position);

    // // Store the distance in the text layer's comment so it can be accessed later
    textLayer.comment = position[0].toString();
}

function createYText(position, textContent, textName) {
    var textLayer = yvaluesComp.layers.addText(textContent);
    centerAnchorPoint(textLayer);
    textLayer.name = textName;
    textLayer.property("Position").setValue(position);

    // // Store the distance in the text layer's comment so it can be accessed later
    textLayer.comment = position[0].toString() + "##" + position[1].toString();
}


function zoomLayer(layer, startScale, endScale, startTime, endTime) {
    var scale = layer.property("Scale");


    // Add start keyframe
    var startKeyframe = scale.addKey(startTime);
    scale.setValueAtKey(startKeyframe, startScale);

    // Add end keyframe
    var endKeyframe = scale.addKey(endTime);
    scale.setValueAtKey(endKeyframe, endScale);
}


function zoomCompositionWithNull(comp, startScale, endScale, startTime, endTime) {
    // Create a null layer
    var nullLayer = comp.layers.addNull();
    nullLayer.name = "Scale Control";

    // Apply the zoom effect to the null layer
    zoomLayer(nullLayer, startScale, endScale, startTime, endTime);
    
}

function zoomXvalues() {
    // Add expression to each text layer
    for (var i = 1; i <= xvaluesComp.numLayers; i++) {
        var layer = xvaluesComp.layer(i);

        var initialPosX = parseFloat(layer.comment.split("##")[0]);

        // Add expression to the Position property
        layer.property("Position").expression =
        'var scaleControlLayer = comp("'+graphName+'").layer("Scale Control");\n'+
        'var endScaleValue = scaleControlLayer.scale[0];\n'+
        'var scaleFactor = endScaleValue / 100; // Assuming the start scale is 100%\n'+
        'var anchorValue = scaleControlLayer.anchorPoint[0] + '+width/2+';\n'+
        'var moveDistance = ('+initialPosX+' - anchorValue) * scaleFactor;\n'+
        'value = [moveDistance + anchorValue, thisLayer.position[1]];';

    }
}


function zoomYvalues() {
    // Add expression to each text layer
    for (var i = 1; i <= yvaluesComp.numLayers; i++) {
        var layer = yvaluesComp.layer(i);

        var initialPosY = parseFloat(layer.comment.split("##")[1]);

        // Add expression to the Position property
        layer.property("Position").expression =
        'var scaleControlLayer = comp("'+graphName+'").layer("Scale Control");\n'+
        'var endScaleValue = scaleControlLayer.scale[1];\n'+
        'var scaleFactor = endScaleValue / 100; // Assuming the start scale is 100%\n'+
        'var anchorValue = scaleControlLayer.anchorPoint[1] + '+height/2+';\n'+
        'var moveDistance = ('+initialPosY+' - anchorValue) * scaleFactor;\n'+
        'value = [thisLayer.position[0], moveDistance + anchorValue];';

    }
}

function zoomLines() {
    var layers = linesComp.layers;
    for (var i = 1; i <= layers.length; i++) {
        var layer = layers[i];
        
        layer.property("Scale").expression =
        'var scaleControlLayer = comp("'+graphName+'").layer("Scale Control");\n'+
        'var endScaleValue = scaleControlLayer.scale;\n'+
        'value = endScaleValue;'
    }


    for (var i = 1; i <= layers.length; i++) {
        var layer = layers[i];

        var initialPos = layer.property("Position").value;

        layer.property("Position").expression =
        'var scaleControlLayer = comp("'+graphName+'").layer("Scale Control");\n'+
        'var endScaleValue = scaleControlLayer.scale;\n'+
        'var scaleFactor = endScaleValue / 100; // Assuming the start scale is 100%\n'+
        'var anchorValueX = scaleControlLayer.anchorPoint[0] + '+width/2+';\n'+
        'var anchorValueY = scaleControlLayer.anchorPoint[1] + '+height/2+';\n'+
        'var anchorValue = ['+initialPos[0]+' - anchorValueX, '+initialPos[1]+' - anchorValueY];\n'+
        'var moveDistance = [anchorValue[0]*scaleFactor[0], anchorValue[1]*scaleFactor[1]];\n'+
        'value = [moveDistance[0] + anchorValueX, moveDistance[1] + anchorValueY];';

    }
}


// Dimensions
var compWidth = linesComp.width;
var compHeight = linesComp.height;

// Create left vertical line
createLine([margin, margin], [margin, compHeight - margin], "Left Vertical Line");

// Create bottom horizontal line
createLine([margin, compHeight - margin], [compWidth - margin, compHeight - margin], "Bottom Horizontal Line");

if(numberOfMiddleLines == 0){
    numberOfMiddleLines = yValues.length - 2;
}

// Create three horizontal lines spread through
for (var i = 1; i <= numberOfMiddleLines; i++) {
    var yPos = compHeight-margin - (i * (compHeight - 2*margin) / (numberOfMiddleLines + 1));
    createDottedLine([margin, yPos], [compWidth-margin, yPos], "Horizontal Line " + i);
}

// Create text layers below the bottom horizontal line
var textYPos = compHeight - margin + textYPosFromBottomLine; // adjust textHeight as needed
for (var i = 1; i <= xValues.length; i++) {
    var xPos = margin + ((i-1) * (compWidth - 2*margin) / (xValues.length - 1));
    createXText([xPos, textYPos], xValues[i-1],  xValues[i-1]);
}

// Create text layers to the left of the vertical line
var textXPos = margin - textXPosFromLeftLine; // adjust textXPosFromLeftLine as needed
for (var i = 1; i <= yValues.length; i++) {
    var yPos = compHeight - margin - ((i-1) * (compHeight - 2*margin) / (yValues.length - 1));
    createYText([textXPos, yPos], yValues[i-1], yValues[i-1]);
}

createGraphLayers();

// Apply zoom animation to linesComp
zoomCompositionWithNull(graphAnimComp, [100, 100], [200, 200], 1, 2); // Zoom from 100% to 200% from 1s to 2s

zoomLines();
zoomGraphs();
zoomXvalues();
zoomYvalues();
// xValuesFadeOutWhenOutOfGraphArea();
keepStrokeWidthConstant(linesComp.layers, strokeWidth);
keepStrokeWidthConstant(graphsComp.layers, graphWidth);


// add the graph composition to timeline
graphAnimComp.openInViewer();
