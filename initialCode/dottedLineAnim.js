// After Effects scripting

function createDottedLineAnimation() {
    var comp = app.project.activeItem; // Get the active composition
    if (!(comp instanceof CompItem)) {
        alert("Please select a composition first.");
        return;
    }

    app.beginUndoGroup("Create Dotted Line Animation");

    // Create a shape layer
    var shapeLayer = comp.layers.addShape();
    shapeLayer.name = "Dotted Line";

    // Add a shape group to the shape layer
    var shapeGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");

    // Add a path to the shape group
    var path = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Group");
    var pathShape = path.property("Path");




    // Define the path as a simple line
    var myShape = new Shape();
    myShape.closed = false;
    //give position based on 1080p comp size 50% of length
    myShape.vertices = [[1920 * -0.25, 0], [1920 * 0.25, 0]]; 
    pathShape.setValue(myShape);

    // Add a stroke to the shape group
    var stroke = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Color").setValue([1, 1, 1]); // White color for the stroke
    stroke.property("Stroke Width").setValue(5);  // 5px stroke width

    // Apply dashes to make the line dotted
    var dashes = stroke.property("Dashes").addProperty("ADBE Vector Stroke Dash 1");
    dashes.setValue(10); // Length of dashes
    var gap = stroke.property("Dashes").addProperty("ADBE Vector Stroke Gap 1");
    gap.setValue(10); // Gap between dashes

    // Add a stroke offset to animate the dotted line
    var offset = stroke.property("Dashes").addProperty("ADBE Vector Stroke Offset");
    offset.setValue(0); // Initial offset value

    // Animate the stroke offset to create the moving dotted line effect
    offset.setValueAtTime(0, 0);
    offset.setValueAtTime(5, -100); // Animate offset for a moving dotted line effect


    //add trim path to the shape layer and animate it
    var trimPath = shapeLayer.property("Contents").addProperty("ADBE Vector Filter - Trim");
    trimPath.property("Start").setValue(0);
    trimPath.property("End").setValue(0);
    trimPath.property("Offset").setValue(0);

    // Animate to show from nothing to full line
    trimPath.property("End").setValueAtTime(0, 0);
    trimPath.property("End").setValueAtTime(0.3, 100);

    //ease the keyframes
    var easeIn = new KeyframeEase(0, 70); // Influence: 50%
    var easeOut = new KeyframeEase(0, 70); // Influence: 50%
    trimPath.property("End").setTemporalEaseAtKey(1, [easeIn], [easeOut]);
    trimPath.property("End").setTemporalEaseAtKey(2, [easeIn], [easeOut]);


    app.endUndoGroup();
}

// Run the function
createDottedLineAnimation();