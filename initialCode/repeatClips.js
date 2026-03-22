// After Effects Script - Repeat Selected Clips Until Target Duration
// Creates a new composition and repeats the selected layers until the total duration
// reaches or exceeds the user-specified time.

function repeatClipsToTargetDuration() {
    var comp = app.project.activeItem;

    // Validate active composition
    if (!(comp instanceof CompItem)) {
        alert("No active composition found. Please open a composition first.");
        return;
    }

    // Validate selection
    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) {
        alert("No layers selected. Please select one or more layers to repeat.");
        return;
    }

    // Show popup dialog for target duration
    var dialog = new Window("dialog", "Repeat Clips");
    dialog.orientation = "column";
    dialog.alignChildren = ["fill", "top"];

    // Add input group
    var inputGroup = dialog.add("group");
    inputGroup.add("statictext", undefined, "Target Duration (seconds):");
    var durationInput = inputGroup.add("edittext", undefined, "60");
    durationInput.characters = 10;

    // Add info text
    var infoText = dialog.add("statictext", undefined,
        "Selected layers will be repeated inside a new composition\nuntil the total duration reaches the specified time.",
        { multiline: true }
    );

    // Add buttons
    var buttonGroup = dialog.add("group");
    buttonGroup.alignment = ["center", "top"];
    buttonGroup.add("button", undefined, "OK", { name: "ok" });
    buttonGroup.add("button", undefined, "Cancel", { name: "cancel" });

    // Show dialog and check result
    if (dialog.show() !== 1) {
        return; // User pressed Cancel
    }

    // Parse and validate the input duration
    var targetDuration = parseFloat(durationInput.text);
    if (isNaN(targetDuration) || targetDuration <= 0) {
        alert("Invalid duration. Please enter a positive number.");
        return;
    }

    app.beginUndoGroup("Repeat Clips to " + targetDuration + "s");

    // ---- Gather info about selected layers ----
    // Calculate the total span of the selected layers (from earliest in-point to latest out-point)
    var earliestIn = Infinity;
    var latestOut = -Infinity;
    var layerIndices = [];
    var lowestIndex = -Infinity; // Track the bottommost selected layer (highest index = lowest in timeline)

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        if (layer.inPoint < earliestIn) earliestIn = layer.inPoint;
        if (layer.outPoint > latestOut) latestOut = layer.outPoint;
        layerIndices.push(layer.index);
        if (layer.index > lowestIndex) lowestIndex = layer.index;
    }

    var clipDuration = latestOut - earliestIn; // Duration of one "cycle" of the selected layers

    if (clipDuration <= 0) {
        alert("Selected layers have zero or negative duration. Cannot repeat.");
        app.endUndoGroup();
        return;
    }

    // Calculate how many repetitions are needed
    var numRepeats = Math.ceil(targetDuration / clipDuration);

    // ---- Create a new composition (named after the first selected layer) ----
    var firstLayerName = selectedLayers[0].name;
    var newCompName = firstLayerName + "_Repeated_" + targetDuration + "s";
    var newComp = app.project.items.addComp(
        newCompName,
        comp.width,
        comp.height,
        comp.pixelAspect,
        targetDuration,
        comp.frameRate
    );

    // ---- Copy selected layers into the new comp, repeated ----
    for (var rep = 0; rep < numRepeats; rep++) {
        var timeOffset = rep * clipDuration;

        // If this repetition would start past the target duration, skip it
        if (timeOffset >= targetDuration) break;

        // Copy each selected layer
        for (var j = 0; j < selectedLayers.length; j++) {
            var srcLayer = selectedLayers[j];

            // Duplicate the layer temporarily, then move it to the new comp
            var copiedLayer = srcLayer.copyToComp(newComp);
        }

        // Adjust the timing of the just-copied layers
        // The layers that were just copied are at the top of the layer stack (indices 1..selectedLayers.length)
        for (var k = 1; k <= selectedLayers.length; k++) {
            var placedLayer = newComp.layer(k);

            // Calculate the new start time relative to the original offset
            var originalLayerOffset = placedLayer.startTime - earliestIn;
            placedLayer.startTime = timeOffset + originalLayerOffset;

            // Trim the out-point if it exceeds the target duration
            if (placedLayer.outPoint > targetDuration) {
                placedLayer.outPoint = targetDuration;
            }
        }
    }

    // ---- Place the new comp in the original comp, right below the selected clip(s) ----
    var newCompLayer = comp.layers.add(newComp);

    // Move it right below the bottommost selected layer.
    // After adding, the new layer is at index 1 (top of stack), and all existing indices shift +1.
    // So the original lowestIndex is now at lowestIndex + 1.
    var targetIndex = lowestIndex + 1; // adjusted for the newly added layer
    if (targetIndex < comp.numLayers) {
        // Move after the layer that's currently right below the selected clip(s)
        newCompLayer.moveAfter(comp.layer(targetIndex + 1));
    } else {
        // Selected layer was the last layer; just move the new layer to the bottom
        newCompLayer.moveAfter(comp.layer(comp.numLayers));
    }

    // Align the new comp layer's start time with the earliest in-point of the selected layers
    newCompLayer.startTime = earliestIn;

    app.endUndoGroup();

    alert("Done! Created \"" + newCompName + "\" with " + numRepeats + " repetition(s) (" + targetDuration + " seconds).\nPlaced below the selected layer(s).");
}

// Run the script
repeatClipsToTargetDuration();
