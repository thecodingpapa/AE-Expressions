// After Effects Script - Highlight Pen Animation

function createHighlightPenAnimation() {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        alert("Please select a composition first.");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) {
        alert("Please select at least one layer to highlight with pen animation.");
        return;
    }

    // Show dialog for pen options
    var penOptions = showPenDialog();
    if (!penOptions) return;

    app.beginUndoGroup("Add Highlight Pen Animation");

    for (var i = 0; i < selectedLayers.length; i++) {
        var targetLayer = selectedLayers[i];
        createHighlightPen(targetLayer, penOptions);
    }

    app.endUndoGroup();
    alert("Highlight pen animation added to " + selectedLayers.length + " layer(s)!");
}

function showPenDialog() {
    var dialog = new Window("dialog", "Highlight Pen Animation");
    dialog.orientation = "column";
    dialog.alignChildren = "fill";

    // Title
    var titleGroup = dialog.add("group");
    titleGroup.add("statictext", undefined, "Highlight Pen Settings:");

    // Animation direction
    var directionGroup = dialog.add("group");
    directionGroup.add("statictext", undefined, "Direction:");
    var directionDropdown = directionGroup.add("dropdownlist", undefined, ["Left to Right", "Right to Left", "Top to Bottom", "Bottom to Top"]);
    directionDropdown.selection = 0;

    // Pen color
    var colorGroup = dialog.add("group");
    colorGroup.add("statictext", undefined, "Highlight Color:");
    var colorDropdown = colorGroup.add("dropdownlist", undefined, ["Yellow", "Green", "Pink", "Blue", "Orange", "Custom"]);
    colorDropdown.selection = 0;

    // Animation duration
    var durationGroup = dialog.add("group");
    durationGroup.add("statictext", undefined, "Animation Duration (sec):");
    var durationInput = durationGroup.add("edittext", undefined, "2.0");
    durationInput.characters = 5;

    // Pen thickness
    var thicknessGroup = dialog.add("group");
    thicknessGroup.add("statictext", undefined, "Pen Thickness:");
    var thicknessSlider = thicknessGroup.add("slider", undefined, 20, 5, 50);
    var thicknessValue = thicknessGroup.add("statictext", undefined, "20");
    thicknessSlider.onChanging = function() {
        thicknessValue.text = Math.round(thicknessSlider.value);
    };

    // Opacity
    var opacityGroup = dialog.add("group");
    opacityGroup.add("statictext", undefined, "Highlight Opacity (%):");
    var opacitySlider = opacityGroup.add("slider", undefined, 60, 20, 100);
    var opacityValue = opacityGroup.add("statictext", undefined, "60");
    opacitySlider.onChanging = function() {
        opacityValue.text = Math.round(opacitySlider.value);
    };

    // Buttons
    var buttonGroup = dialog.add("group");
    var okButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");

    okButton.onClick = function() { dialog.close(1); };
    cancelButton.onClick = function() { dialog.close(0); };

    if (dialog.show() == 0) return null;

    // Get color values
    var colors = {
        "Yellow": [1, 1, 0],
        "Green": [0, 1, 0.3],
        "Pink": [1, 0.4, 0.7],
        "Blue": [0.2, 0.6, 1],
        "Orange": [1, 0.6, 0]
    };

    return {
        direction: directionDropdown.selection.text,
        color: colors[colorDropdown.selection.text] || [1, 1, 0],
        duration: parseFloat(durationInput.text) || 2.0,
        thickness: Math.round(thicknessSlider.value),
        opacity: Math.round(opacitySlider.value)
    };
}

function createHighlightPen(targetLayer, options) {
    var comp = app.project.activeItem;
    var currentTime = comp.time;
    
    // Get layer bounds
    var layerBounds = getLayerBounds(targetLayer);
    
    // Create highlight shape layer
    var highlightLayer = comp.layers.addShape();
    highlightLayer.name = targetLayer.name + "_Highlight_Pen";
    
    // Add rectangle to shape layer
    var shapeGroup = highlightLayer.property("Contents").addProperty("ADBE Vector Group");
    var rectangle = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
    var stroke = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    
    // Set stroke properties
    stroke.property("Color").setValue(options.color);
    stroke.property("Opacity").setValue(options.opacity);
    stroke.property("Stroke Width").setValue(options.thickness);
    
    // Set stroke line cap and join for smoother pen effect
    stroke.property("Line Cap").setValue(2); // Round cap
    stroke.property("Line Join").setValue(2); // Round join
    
    // Set rectangle size based on direction
    var rectSize, rectPosition;
    var maskDirection;
    
    switch (options.direction) {
        case "Left to Right":
            rectSize = [layerBounds.width, 1]; // Thin line for stroke
            rectPosition = [layerBounds.left + layerBounds.width/2, layerBounds.top + layerBounds.height/2];
            maskDirection = "horizontal";
            break;
        case "Right to Left":
            rectSize = [layerBounds.width, 1]; // Thin line for stroke
            rectPosition = [layerBounds.left + layerBounds.width/2, layerBounds.top + layerBounds.height/2];
            maskDirection = "horizontal_reverse";
            break;
        case "Top to Bottom":
            rectSize = [1, layerBounds.height]; // Thin line for stroke
            rectPosition = [layerBounds.left + layerBounds.width/2, layerBounds.top + layerBounds.height/2];
            maskDirection = "vertical";
            break;
        case "Bottom to Top":
            rectSize = [1, layerBounds.height]; // Thin line for stroke
            rectPosition = [layerBounds.left + layerBounds.width/2, layerBounds.top + layerBounds.height/2];
            maskDirection = "vertical_reverse";
            break;
    }
    
    rectangle.property("Size").setValue(rectSize);
    rectangle.property("Position").setValue([0, 0]);
    
    // Position the highlight layer
    highlightLayer.property("Transform").property("Position").setValue(rectPosition);
    
    // Add mask for animation
    var mask = highlightLayer.property("Masks").addProperty("Mask");
    var maskPath = mask.property("Mask Path");
    var maskExpansion = mask.property("Mask Expansion");
    
    // Create mask shape based on direction
    createAnimatedMask(mask, maskDirection, rectSize, currentTime, options.duration);
    
    // Position highlight layer below target layer
    highlightLayer.moveAfter(targetLayer);
    
    // Set blend mode for pen effect
    highlightLayer.blendingMode = BlendingMode.NORMAL;
    
    return highlightLayer;
}

function createAnimatedMask(mask, direction, size, startTime, duration) {
    var maskPath = mask.property("Mask Path");
    var width = size[0];
    var height = size[1];
    
    var startShape, endShape;
    
    switch (direction) {
        case "horizontal":
            // Start with no width, end with full width
            startShape = new Shape();
            startShape.vertices = [[-width/2, -height/2], [-width/2, height/2], [-width/2, height/2], [-width/2, -height/2]];
            startShape.closed = true;
            
            endShape = new Shape();
            endShape.vertices = [[-width/2, -height/2], [width/2, -height/2], [width/2, height/2], [-width/2, height/2]];
            endShape.closed = true;
            break;
            
        case "horizontal_reverse":
            // Start with no width from right, end with full width
            startShape = new Shape();
            startShape.vertices = [[width/2, -height/2], [width/2, height/2], [width/2, height/2], [width/2, -height/2]];
            startShape.closed = true;
            
            endShape = new Shape();
            endShape.vertices = [[-width/2, -height/2], [width/2, -height/2], [width/2, height/2], [-width/2, height/2]];
            endShape.closed = true;
            break;
            
        case "vertical":
            // Start with no height, end with full height
            startShape = new Shape();
            startShape.vertices = [[-width/2, -height/2], [width/2, -height/2], [width/2, -height/2], [-width/2, -height/2]];
            startShape.closed = true;
            
            endShape = new Shape();
            endShape.vertices = [[-width/2, -height/2], [width/2, -height/2], [width/2, height/2], [-width/2, height/2]];
            endShape.closed = true;
            break;
            
        case "vertical_reverse":
            // Start with no height from bottom, end with full height
            startShape = new Shape();
            startShape.vertices = [[-width/2, height/2], [width/2, height/2], [width/2, height/2], [-width/2, height/2]];
            startShape.closed = true;
            
            endShape = new Shape();
            endShape.vertices = [[-width/2, -height/2], [width/2, -height/2], [width/2, height/2], [-width/2, height/2]];
            endShape.closed = true;
            break;
    }
    
    // Set keyframes
    maskPath.setValueAtTime(startTime, startShape);
    maskPath.setValueAtTime(startTime + duration, endShape);
    
    // Add ease
    addEaseToKeyframes(maskPath);
}

function getLayerBounds(layer) {
    // Get layer source rectangle or use layer dimensions
    var bounds = {
        left: 0,
        top: 0,
        width: 100,
        height: 50
    };
    
    try {
        if (layer.source) {
            bounds.width = layer.source.width;
            bounds.height = layer.source.height;
        } else {
            bounds.width = layer.width || 100;
            bounds.height = layer.height || 50;
        }
        
        var position = layer.property("Transform").property("Position").valueAtTime(app.project.activeItem.time, false);
        var anchorPoint = layer.property("Transform").property("Anchor Point").valueAtTime(app.project.activeItem.time, false);
        
        bounds.left = position[0] - anchorPoint[0];
        bounds.top = position[1] - anchorPoint[1];
        
    } catch (e) {
        // Use default bounds if we can't get layer info
    }
    
    return bounds;
}

function addEaseToKeyframes(property) {
    for (var i = 1; i <= property.numKeys; i++) {
        try {
            property.setTemporalEaseAtKey(i, [new KeyframeEase(0, 33.33), new KeyframeEase(0, 33.33)]);
        } catch (e) {
            // Some properties don't support easing
        }
    }
}

// Run the script
createHighlightPenAnimation();
