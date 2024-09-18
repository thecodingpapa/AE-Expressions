function changeKeyframeVelocity(){
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
                                    // Define custom ease settings
                                    var easeIn = new KeyframeEase(0, 70); // Influence: 50%
                                    var easeOut = new KeyframeEase(0, 70); // Influence: 50%
    
                                    // Set ease for temporal keyframes (spatial keyframes need separate handling)
                                    prop.setTemporalEaseAtKey(k, [easeIn], [easeOut]);
    
                                    // Optional: Adjust spatial tangents for motion paths (if it's a spatial property)
                                    // prop.setSpatialTangentsAtKey(k, [50, 50], [-50, -50]);
                                }
                            }
                        }
                    }
                }
            }
            alert("Keyframe ease adjusted!");
        } else {
            alert("Please select a layer with keyframes.");
        }
    }
}

changeKeyframeVelocity();