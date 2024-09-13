//add loopOut() expression to selected layers
function addLoopOut(){
    {
        // Get the active composition
        var comp = app.project.activeItem;
    
        // Ensure the composition is valid and something is selected
        if (comp != null && comp instanceof CompItem && comp.selectedLayers.length > 0) {
            // Loop through selected layers
            for (var i = 0; i < comp.selectedLayers.length; i++) {
                var layer = comp.selectedLayers[i];
    
                // Check if the layer has selected properties with keyframes
                if (layer.selectedProperties.length > 0) {
                    for (var j = 0; j < layer.selectedProperties.length; j++) {
                        var prop = layer.selectedProperties[j];
    
                        // Check if the property is keyframed
                        if (prop.numKeys > 0) {
                            // Loop through selected keyframes
                            for (var k = 1; k <= prop.numKeys; k++) {
                                if (prop.keySelected(k)) {
                                    // Add loopOut() expression to selected keyframes
                                    prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
                                    prop.expression = "loopOut()";
                                }
                            }
                        }
                    }
                }
            }
            alert("loopOut() expression added to selected keyframes!");
        } else {
            alert("Please select a layer with keyframes.");
        }
    }
}

addLoopOut();