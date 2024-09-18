function flickerOpacity(duration, flickerCount, minOpacity) {
    app.beginUndoGroup("Flicker Opacity");

    // Get the active composition
    var comp = app.project.activeItem;

    // Ensure the composition is valid and layers are selected
    if (comp != null && comp instanceof CompItem && comp.selectedLayers.length > 0) {
        for (var i = 0; i < comp.selectedLayers.length; i++) {
            var layer = comp.selectedLayers[i]; // Work with each selected layer

            // Get the opacity property of the selected layer
            var opacityProp = layer.property("ADBE Transform Group").property("ADBE Opacity");

            // Check if the opacity property exists and can have keyframes
            if (opacityProp.canSetExpression || opacityProp.isTimeVarying) {

                // Get the current time
                var currentTime = comp.time;

                // Get the current opacity value
                var currentOpacity = opacityProp.value;

                // Time interval for each flicker step
                var stepDuration = duration / flickerCount * (Math.random()*0.4 + 0.8);

                // Loop to create flicker effect
                for (var j = 0; j <= flickerCount; j++) {
                    // Alternate between current opacity and minimum opacity
                    var opacityValue = (j % 2 === 0) ? currentOpacity : minOpacity;

                    // Set opacity keyframe at each step
                    opacityProp.setValueAtTime(currentTime + (j * stepDuration), opacityValue);
                }

                // Restore the original opacity after all flickers
                opacityProp.setValueAtTime(currentTime + (duration + stepDuration), currentOpacity);
            }
        }
        alert("Flicker opacity applied to selected layers!");
    } else {
        alert("Please select one or more layers.");
    }

    app.endUndoGroup();
}

flickerOpacity(0.5, 4, 0);