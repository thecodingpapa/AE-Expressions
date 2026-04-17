app.beginUndoGroup("Remove Glow Effects");

try {
    var comp = app.project.activeItem;
    
    // Check if active item is actually a composition
    if (!(comp instanceof CompItem)) {
        alert("Please select a composition first.");
    } else {
        var selectedLayers = comp.selectedLayers;
        
        if (selectedLayers.length === 0) {
            alert("Please select at least one layer.");
        } else {
            var removedCount = 0;
            var processedLayers = 0;
            
            // Process each selected layer
            for (var i = 0; i < selectedLayers.length; i++) {
                var layer = selectedLayers[i];
                processedLayers++;
                
                // Get the Effects property group
                var effects = layer.property("ADBE Effect Parade");
                
                if (effects && effects.numProperties > 0) {
                    // Loop through effects backwards to safely remove during iteration
                    for (var j = effects.numProperties; j >= 1; j--) {
                        var effect = effects.property(j);
                        
                        // Check if this is a Glow effect
                        // Common glow effect match names:
                        // - "ADBE Glow" (standard Glow effect)
                        // - "ADBE Glow2" (newer Glow effect variant)
                        // - "ADBE Glo2" (variant without 'w')
                        if (effect.matchName === "ADBE Glow" || effect.matchName === "ADBE Glow2" || effect.matchName === "ADBE Glo2") {
                            effect.remove();
                            removedCount++;
                        }
                    }
                }
            }
            
            // Provide feedback
            if (removedCount > 0) {
                alert("Successfully removed " + removedCount + " Glow effect(s) from " + processedLayers + " layer(s).");
            } else {
                alert("No Glow effects found on the selected " + processedLayers + " layer(s).");
            }
        }
    }
} catch (e) {
    alert("Script Error: " + e.toString());
} finally {
    app.endUndoGroup();
}
