//screen size 1920 x 1080
var height = 1080;
var width = 1920;
var numberOfMiddleLines = 3;
var margin = 100;
var strokeWidth = 4;
var strokeColor = [0, 0, 0]; // Black color

var textYPosFromBottomLine = 30;
var xValues = ["1990", "1995", "2000", "2005", "2010", "2015", "2020"];

var textXPosFromLeftLine = 20;
var yValues = ["0", "20", "40", "60", "80", "100"];





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

// Create a new composition
var comp = app.project.items.addComp("Graph Base Lines", 1920, 1080, 1, 10, 30);

// Function to create a shape layer with a line
function createLine(startPoint, endPoint, lineName) {
    var start = [startPoint[0] - width/2, startPoint[1] - height/2];
    var end = [endPoint[0] - width/2, endPoint[1] - height/2];
    var shapeLayer = comp.layers.addShape();
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
    
    var shapeLayer = comp.layers.addShape();
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

function createText(position, textContent, textName, justification) {
    var textLayer = comp.layers.addText(textContent);
    textLayer.name = textName;
    textLayer.property("Position").setValue(position);

    if (justification == undefined) {
        justification = ParagraphJustification.CENTER_JUSTIFY;
    }

    var textDocument = textLayer.property("Source Text").value;
    textDocument.justification = justification;
    textLayer.property("Source Text").setValue(textDocument);
}


// Dimensions
var compWidth = comp.width;
var compHeight = comp.height;

// Create left vertical line
createLine([margin, margin], [margin, compHeight - margin], "Left Vertical Line");

// Create bottom horizontal line
createLine([margin, compHeight - margin], [compWidth - margin, compHeight - margin], "Bottom Horizontal Line");

// Create three horizontal lines spread through
for (var i = 1; i <= numberOfMiddleLines; i++) {
    var yPos = compHeight-margin - (i * (compHeight - 2*margin) / (numberOfMiddleLines + 1));
    createDottedLine([margin, yPos], [compWidth-margin, yPos], "Horizontal Line " + i);
}

// Create text layers below the bottom horizontal line
var textYPos = compHeight - margin + textYPosFromBottomLine; // adjust textHeight as needed
for (var i = 1; i <= xValues.length; i++) {
    var xPos = margin + ((i-1) * (compWidth - 2*margin) / xValues.length) + compWidth * 0.01;
    createText([xPos, textYPos], xValues[i-1],  xValues[i-1]);
}

// Create text layers to the left of the vertical line
var textXPos = margin - textXPosFromLeftLine; // adjust textXPosFromLeftLine as needed
for (var i = 1; i <= yValues.length; i++) {
    var yPos = compHeight - margin - ((i-1) * (compHeight - 2*margin) / yValues.length) - compHeight * 0.01;
    createText([textXPos, yPos], yValues[i-1], yValues[i-1], ParagraphJustification.RIGHT_JUSTIFY);
}