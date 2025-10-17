// After Effects Script - Extend Composition and All Layers to 3 Minutes

function extendCompTo3Minutes() {
    var comp = app.project.activeItem; // Get the active composition
    if (!(comp instanceof CompItem)) {
        alert("Please select a composition first.");
        return;
    }

    var newDuration = 180; // 3 minutes = 180 seconds

    app.beginUndoGroup("Extend Composition to 3 Minutes");

    // Store the original composition duration
    var originalDuration = comp.duration;

    // Set the composition duration to 3 minutes
    comp.duration = newDuration;
    
    // Extend the work area to 3 minutes
    comp.workAreaStart = 0;
    comp.workAreaDuration = newDuration;

    // Extend all layers to 3 minutes
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        
        // Store the original locked state
        var wasLocked = layer.locked;
        
        // Temporarily unlock the layer if it's locked
        if (layer.locked) {
            layer.locked = false;
        }
        
        // Extend the layer's out-point to the new duration
        // Only extend if the current out-point is less than 3 minutes
        if (layer.outPoint < newDuration) {
            layer.outPoint = newDuration;
        }

        // If the layer is a footage/video layer and it's shorter than 3 minutes,
        // enable time remapping and add loopOut expression to make it repeat
        if (layer.source && (layer.source instanceof FootageItem)) {
            var sourceDuration = layer.source.duration;
            
            // If the source is shorter than 3 minutes, enable time remapping with loop
            if (sourceDuration < newDuration && !layer.timeRemapEnabled) {
                try {
                    layer.timeRemapEnabled = true;
                    var timeRemap = layer.property("Time Remap");
                    
                    // Add loopOut expression to make the footage repeat
                    timeRemap.expression = "loopOut()";
                } catch (e) {
                    // Some layer types don't support time remapping
                    // Continue with other layers
                }
            }
        }

        // If the layer is a nested composition, recursively extend it
        if (layer.source instanceof CompItem) {
            extendNestedComp(layer.source, newDuration);
        }
        
        // Restore the original locked state
        if (wasLocked) {
            layer.locked = true;
        }
    }

    app.endUndoGroup();
    
    alert("Composition and all layers have been extended to 3 minutes (180 seconds).");
}

// Function to extend nested compositions
function extendNestedComp(nestedComp, newDuration) {
    // Only extend if the nested comp is shorter than the target duration
    if (nestedComp.duration < newDuration) {
        nestedComp.duration = newDuration;
        
        // Extend the work area of the nested composition
        nestedComp.workAreaStart = 0;
        nestedComp.workAreaDuration = newDuration;

        // Extend all layers inside the nested composition
        for (var i = 1; i <= nestedComp.numLayers; i++) {
            var nestedLayer = nestedComp.layer(i);
            
            // Store the original locked state
            var wasNestedLocked = nestedLayer.locked;
            
            // Temporarily unlock the layer if it's locked
            if (nestedLayer.locked) {
                nestedLayer.locked = false;
            }

            // Extend the layer's out-point
            if (nestedLayer.outPoint < newDuration) {
                nestedLayer.outPoint = newDuration;
            }

            // If it's footage that's shorter, add time remapping with loop
            if (nestedLayer.source && (nestedLayer.source instanceof FootageItem)) {
                var sourceDuration = nestedLayer.source.duration;
                
                if (sourceDuration < newDuration && !nestedLayer.timeRemapEnabled) {
                    try {
                        nestedLayer.timeRemapEnabled = true;
                        var timeRemap = nestedLayer.property("Time Remap");
                        timeRemap.expression = "loopOut()";
                    } catch (e) {
                        // Continue if time remapping is not supported
                    }
                }
            }

            // Recursively handle nested compositions
            if (nestedLayer.source instanceof CompItem) {
                extendNestedComp(nestedLayer.source, newDuration);
            }
            
            // Restore the original locked state
            if (wasNestedLocked) {
                nestedLayer.locked = true;
            }
        }
    }
}

// Run the script
extendCompTo3Minutes();
