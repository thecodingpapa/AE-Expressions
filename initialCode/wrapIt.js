function wrapIt() {
        // Check if there is a selected layer
    if (app.project.activeItem && app.project.activeItem.selectedLayers.length > 0) {
        var comp = app.project.activeItem;
        var selectedLayer = comp.selectedLayers[0];  // Get the first selected layer


        // Check if the selected layer is a text layer
        if (selectedLayer instanceof TextLayer) {
            // Get the dimensions of the text layer
            var textRect = selectedLayer.sourceRectAtTime(comp.time, false);
            var textWidth = textRect.width;
            var textHeight = textRect.height;

            // Center the anchor point
            selectedLayer.property("Anchor Point").setValue([0, 0]);
        }

        // Get the dimensions of the selected layer
        var layerRect = selectedLayer.sourceRectAtTime(comp.time, false);
        var layerWidth = layerRect.width;
        var layerHeight = layerRect.height;
        var layerPos = selectedLayer.position.value;

        // Add a shape layer for the background box
        var shapeLayer = comp.layers.addShape();
        shapeLayer.name = selectedLayer.name + "_background";

        // Create a rectangle path
        var rectGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
        var rectPath = rectGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");

        // Set rectangle size (with a margin)
        var margin = 20;
        rectPath.property("Size").setValue([layerWidth + margin * 2, layerHeight + margin * 2]);

        // Set position behind the selected layer
        shapeLayer.property("Position").setValue([layerPos[0], layerPos[1]]);

        // Add rounded corners
        var roundedCorners = rectGroup.property("Contents").addProperty("ADBE Vector Filter - RC");
        roundedCorners.property("Radius").setValue(20);  // Adjust corner radius as needed

        // Add fill color
        var fill = rectGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue([1, 1, 1]);  // Adjust fill color as needed

        // Add stroke (outline)
        var stroke = rectGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
        stroke.property("Color").setValue([0, 0, 0]);  // Adjust stroke color as needed
        stroke.property("Stroke Width").setValue(0.5);  // Adjust stroke width as needed

        // Add drop shadow effect
        var dropShadow = shapeLayer.property("Effects").addProperty("ADBE Drop Shadow");
        dropShadow.property("Opacity").setValue(70);  // Adjust shadow opacity
        dropShadow.property("Distance").setValue(18); // Adjust shadow distance
        dropShadow.property("Direction").setValue(135); // Adjust shadow direction
        dropShadow.property("Softness").setValue(20);  // Adjust shadow softness

        // Send the shape layer behind the selected layer
        shapeLayer.moveAfter(selectedLayer);

        // Select both layers
        selectedLayer.selected = true;
        shapeLayer.selected = true;


        // Precompose the selected layers
        var precomp = comp.layers.precompose([selectedLayer.index, shapeLayer.index], selectedLayer.name + "_group", true);

        alert("Background shape with rounded corners and shadow created!");
    } else {
        alert("Please select a layer first.");
    }
}

wrapIt();