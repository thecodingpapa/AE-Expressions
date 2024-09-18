// After Effects scripting

// Function to apply an ease to a keyframe
function applyEaseToKeyframe(property, keyIndex) {
    var easeIn = new KeyframeEase(70, 33);  // 70% influence, 33 for speed
    var easeOut = new KeyframeEase(70, 33);

    // Apply the ease to the selected keyframe
    property.setTemporalEaseAtKey(keyIndex, [easeIn], [easeOut]);
}

// Main script function
function moveLayerInCurve() {
    var comp = app.project.activeItem; // Get the active composition
    if (!(comp instanceof CompItem)) {
        alert("Please select a composition first.");
        return;
    }

    var layers = comp.selectedLayers; // Get selected layers
    if (layers.length == 0) {
        alert("Please select a layer.");
        return;
    }

    app.beginUndoGroup("Move Layer Left to Right with Ease");

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];  // Process each selected layer
        
        var pos = layer.property("Position");

        // Get the start and end times of the layer
        var inPoint = layer.inPoint;
        var outPoint = layer.outPoint;

        // Left start position
        var startPos = [comp.width * 0.1, comp.height * 0.5]; // 10% from the left
        // Right end position
        var endPos = [comp.width * 0.9, comp.height * 0.5];   // 90% from the left
        
        // Set keyframes for position with a curve path
        pos.setValueAtTime(inPoint, startPos);
        pos.setValueAtTime(inPoint + (outPoint - inPoint) * 0.5, [comp.width * 0.5, comp.height * 0.3]);  // Curve point at 50%
        pos.setValueAtTime(outPoint, endPos);

        // Apply ease to each keyframe using proper keyIndex for property object
        applyEaseToKeyframe(pos, pos.nearestKeyIndex(inPoint));
        applyEaseToKeyframe(pos, pos.nearestKeyIndex(inPoint + (outPoint - inPoint) * 0.5));
        applyEaseToKeyframe(pos, pos.nearestKeyIndex(outPoint));
    }

    app.endUndoGroup();
}

// Run the function
moveLayerInCurve();