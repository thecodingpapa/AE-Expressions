// After Effects Script - Change Composition Duration and Adjust Layer Lengths

function changeCompAndLayerDuration() {
    var comp = app.project.activeItem; // Get the active composition
    if (!(comp instanceof CompItem)) {
        alert("Please select a composition first.");
        return;
    }

    // Prompt user to enter the new duration for the composition
    var newDuration = parseFloat(prompt("Enter the new duration (in seconds):", comp.duration));
    if (isNaN(newDuration) || newDuration <= 0) {
        alert("Invalid duration entered. Please enter a positive number.");
        return;
    }

    app.beginUndoGroup("Change Composition and Layer Durations");

    // Change the composition duration
    var oldDuration = comp.duration;
    comp.duration = newDuration;

    // Adjust the out-point of all layers
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);

        // Only change the out-point if it's currently within the old composition duration
        if (layer.outPoint > oldDuration) {
            layer.outPoint = newDuration;
        } else if (layer.outPoint <= oldDuration && layer.outPoint > newDuration) {
            // If the layer's out-point is beyond the new comp length, set it to the new duration
            layer.outPoint = newDuration;
        }

        // If the layer is a pre-comp, also adjust the duration of the nested composition
        if (layer.source instanceof CompItem) {
            adjustNestedCompDuration(layer.source, newDuration);
        }
    }

    app.endUndoGroup();
}

// Function to adjust the duration of a nested composition
function adjustNestedCompDuration(nestedComp, newDuration) {
    if (nestedComp.duration < newDuration) {
        nestedComp.duration = newDuration;

        // Adjust all layers inside the nested composition
        for (var i = 1; i <= nestedComp.numLayers; i++) {
            var nestedLayer = nestedComp.layer(i);

            // Adjust out-point to match the new duration
            if (nestedLayer.outPoint > nestedComp.duration) {
                nestedLayer.outPoint = newDuration;
            }
        }
    }
}

// Run the script
changeCompAndLayerDuration();