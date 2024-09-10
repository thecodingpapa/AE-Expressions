function scaleUp(){
    app.beginUndoGroup("Add Scale Keyframes with Ease");

    // Get the active composition
    var comp = app.project.activeItem;

    // Ensure the composition is valid and a layer is selected
    if (comp != null && comp instanceof CompItem && comp.selectedLayers.length > 0) {
        var layer = comp.selectedLayers[0]; // Work with the first selected layer

        // Get the scale property of the selected layer
        var scaleProp = layer.property("ADBE Transform Group").property("ADBE Scale");

        // Get the current time
        var currentTime = comp.time;

        // Get the current scale value (array [x, y, z] depending on layer type)
        var currentScale = scaleProp.value;

        // Create the first keyframe at the current time with the current scale
        scaleProp.setValueAtTime(currentTime, currentScale);

        // Calculate the new scale (increase by 5%)
        var secondScale = [
            currentScale[0] * 1.05, // Increase the X scale by 5%
            currentScale[1] * 1.05, // Increase the Y scale by 5%
            currentScale.length > 2 ? currentScale[2] * 1.05 : currentScale[0] * 1.05 // Increase Z scale if it exists
        ];

        // Add the second keyframe 300 milliseconds (0.3 seconds) later
        scaleProp.setValueAtTime(currentTime + 0.3, secondScale);


        // Add the last keyframe 600 milliseconds (0.6 seconds) later
        scaleProp.setValueAtTime(currentTime + 0.6, currentScale);

        // Define custom ease settings with 50% influence
        var easeIn = new KeyframeEase(0, 50); // Influence 50% for incoming keyframe
        var easeOut = new KeyframeEase(0, 50); // Influence 50% for outgoing keyframe



        // Find the index of the keyframes
        var firstKeyIndex = scaleProp.nearestKeyIndex(currentTime);
        var secondKeyIndex = scaleProp.nearestKeyIndex(currentTime + 0.3);
        var lastKeyIndex = scaleProp.nearestKeyIndex(currentTime + 0.6);


        // Apply ease to the first and second keyframes
        scaleProp.setTemporalEaseAtKey(firstKeyIndex, [easeOut, easeOut, easeOut], [easeOut, easeOut, easeOut]); // Outgoing ease on first keyframe
        scaleProp.setTemporalEaseAtKey(secondKeyIndex, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);   // Incoming ease on second keyframe
        scaleProp.setTemporalEaseAtKey(lastKeyIndex, [easeOut, easeOut, easeOut], [easeOut, easeOut, easeOut]); // Outgoing ease on last keyframe

        alert("Scale keyframes with 50% ease added!");
    } else {
        alert("Please select a layer.");
    }

    app.endUndoGroup();
}

scaleUp();