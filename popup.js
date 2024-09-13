{
    var comp = app.project.activeItem; // Get the active composition
    if (comp && comp instanceof CompItem) {
        var selectedLayer = comp.selectedLayers[0]; // Get the first selected layer

        if (selectedLayer) {
            app.beginUndoGroup("Apply Pop-up Animation with Bounce");

            // Add scale keyframes for the pop-up effect
            var scaleProperty = selectedLayer.property("Scale");
        

            // Set the initial and final scale values (starting small, then popping up)
            var startScale = [0, 0];
            var endScale = [100, 100];

            // Time settings
            var startTime = comp.time; // Starting at the current time
            var popUpDuration = 0.5; // 0.5 seconds for the pop-up
            var totalDuration = 1.5; // 1.5 seconds for the entire animation

            // Apply keyframes for the scale property
            scaleProperty.setValueAtTime(startTime, startScale);
            scaleProperty.setValueAtTime(startTime + popUpDuration, endScale);

            // Apply the provided bounce expression
            var bounceExpression = 
                'amp = 0.1;' +  // Amplitude
                'freq = 2.0;' + // Frequency
                'decay = 2.0;' + // Decay
                'n = 0;' +
                'if (numKeys > 0){' +
                    'n = nearestKey(time).index;' +
                    'if (key(n).time > time){' +
                        'n--;' +
                    '}' +
                '}' +
                'if (n == 0){' +
                    't = 0;' +
                '}else{' +
                    't = time - key(n).time;' +
                '}' +
                'if (n > 0 && t < 1){' +
                    'v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);' +
                    'value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);' +
                '}else{' +
                    'value;' +
                '}';

            scaleProperty.expression = bounceExpression;

            app.endUndoGroup();
        } else {
            alert("No layer selected. Please select a layer.");
        }
    } else {
        alert("No active composition found. Please open a composition.");
    }
}