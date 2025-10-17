// After Effects Script - Simple Highlight Pen Line

function createSimpleHighlightPen() {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        alert("Please select a composition first.");
        return;
    }

    // Use default settings with specified color
    var settings = {
        direction: "Horizontal",
        length: 300,
        startX: 100,
        startY: 100,
        color: [0.58, 0.82, 0.74], // RGB 148, 210, 189 converted to AE color values
        thickness: 100,
        opacity: 100,
        duration: 1.5,
        roughenEdges: true
    };

    app.beginUndoGroup("Create Highlight Pen Line");

    // Create a shape layer
    var shapeLayer = comp.layers.addShape();
    shapeLayer.name = "Highlight Pen Line";
    shapeLayer.blendingMode = BlendingMode.MULTIPLY;

    // Add a shape group to the shape layer
    var shapeGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");

    // Add a path to the shape group
    var pathGroup = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Group");
    var pathShape = pathGroup.property("Path");

    // Define the path as a simple straight line
    var myShape = new Shape();
    myShape.closed = false;
    
    // Create line based on direction
    switch (settings.direction) {
        case "Horizontal":
            myShape.vertices = [[settings.startX, settings.startY], [settings.startX + settings.length, settings.startY]];
            break;
        case "Vertical":
            myShape.vertices = [[settings.startX, settings.startY], [settings.startX, settings.startY + settings.length]];
            break;
        case "Diagonal":
            myShape.vertices = [[settings.startX, settings.startY], [settings.startX + settings.length, settings.startY + settings.length]];
            break;
    }
    
    pathShape.setValue(myShape);

    // Add a stroke to the shape group
    var stroke = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    
    // Set stroke properties for highlight pen effect
    stroke.property("Color").setValue(settings.color);
    stroke.property("Stroke Width").setValue(settings.thickness);
    stroke.property("Line Cap").setValue(3); // Round cap
    stroke.property("Line Join").setValue(2); // Round join
    stroke.property("Opacity").setValue(settings.opacity);

    // Add trim path for animation
    var trimPath = shapeGroup.property("Contents").addProperty("ADBE Vector Filter - Trim");
    trimPath.property("Start").setValue(0);
    trimPath.property("End").setValue(0);
    trimPath.property("Offset").setValue(0);

    // Get current time and set layer start time
    var currentTime = comp.time;
    shapeLayer.startTime = currentTime;

    // Animate trim path to create drawing effect starting from playhead position
    trimPath.property("End").setValueAtTime(currentTime, 0);
    trimPath.property("End").setValueAtTime(currentTime + settings.duration, 100);

    // Add easing for smooth animation
    var easeIn = new KeyframeEase(0, 33.33);
    var easeOut = new KeyframeEase(0, 33.33);
    trimPath.property("End").setTemporalEaseAtKey(1, [easeIn], [easeOut]);
    trimPath.property("End").setTemporalEaseAtKey(2, [easeIn], [easeOut]);

    // Add Roughen Edges effect for natural hand-drawn look
    if (settings.roughenEdges) {
        try {
            var roughenEffect = shapeLayer.property("Effects").addProperty("Roughen Edges");
            roughenEffect.property("Edge Type").setValue(3); // Cut
            roughenEffect.property("Border").setValue(50);
            roughenEffect.property("Edge Sharpness").setValue(0.5);
            roughenEffect.property("Fractal Influence").setValue(1);
            roughenEffect.property("Scale").setValue(10);
            roughenEffect.property("Stretch Width or Height").setValue(5); // Width or Height
            roughenEffect.property("Offset (Turbulence)").setValue([5, 5]);
            roughenEffect.property("Complexity").setValue(10);
        } catch (e) {
            // Continue if Roughen Edges effect is not available
        }
    }

    app.endUndoGroup();
    
    alert("Simple highlight pen line created! You can now adjust the path points, color, and timing as needed.");
}



// Run the script
createSimpleHighlightPen();
