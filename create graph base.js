//screen size 1920 x 1080
var height = 1080;
var width = 1920;
var numberOfMiddleLines = 3;
var margin = 100;
var strokeWidth = 4;
var strokeColor = [0, 0, 0]; // Black color
var textYPosFromBottomLine = 30;
var xValues = ["1990", "1995", "2000", "2005", "2010", "2015", "2020"];

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

function createText(position, textContent, textName) {
    var textLayer = comp.layers.addText(textContent);
    textLayer.name = textName;
    textLayer.property("Position").setValue(position);
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

// Create five text layers below the bottom horizontal line
var textYPos = compHeight - margin + textYPosFromBottomLine; // adjust textHeight as needed
for (var i = 1; i <= xValues.length; i++) {
    var textXPos = margin + (i * (compWidth - 2*margin) / 6);
    createText([textXPos, textYPos], xValues[i], xValues[i]);
}