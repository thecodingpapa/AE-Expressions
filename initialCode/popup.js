{
  var comp = app.project.activeItem; // Get the active composition
  if (comp && comp instanceof CompItem) {
    var selectedLayers = comp.selectedLayers; // Get the first selected layer

    //loop through all selected layers
    for (var i = 0; i < selectedLayers.length; i++) {
      var selectedLayer = selectedLayers[i];
      if (selectedLayer) {
        app.beginUndoGroup("Apply Pop-up Animation with Bounce");

        // Add scale keyframes for the pop-up effect
        var scaleProperty = selectedLayer.property("Scale");

        // get the current scale value
        var endScale = scaleProperty.value;

        // Set the initial and final scale values (starting small, then popping up)
        var startScale = [0, 0];

        // Time settings
        var startTime = comp.time; // Starting at the current time
        var popUpDuration = 0.3; // 0.5 seconds for the pop-up

        // Apply keyframes for the scale property
        scaleProperty.setValueAtTime(startTime, startScale);
        scaleProperty.setValueAtTime(startTime + popUpDuration, endScale);

        // Apply the provided bounce expression
        var bounceExpression =
          "amp = 0.05;" + // Amplitude
          "freq = 2.0;" + // Frequency
          "decay = 10.0;" + // Decay
          "n = 0;" +
          "if (numKeys > 0){" +
          "n = nearestKey(time).index;" +
          "if (key(n).time > time){" +
          "n--;" +
          "}" +
          "}" +
          "if (n == 0){" +
          "t = 0;" +
          "}else{" +
          "t = time - key(n).time;" +
          "}" +
          "if (n > 0 && t < 1){" +
          "v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);" +
          "value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);" +
          "}else{" +
          "value;" +
          "}";

        scaleProperty.expression = bounceExpression;

        //add ease to the first keyframe
        var easeIn = new KeyframeEase(0, 100); // Influence: 100%
        var easeOut = new KeyframeEase(0, 100); // Influence: 100%

        //find the nearest keyframe index
        var keyIndex = scaleProperty.nearestKeyIndex(startTime);

        scaleProperty.setTemporalEaseAtKey(
          keyIndex,
          [easeIn, easeIn, easeIn],
          [easeOut, easeOut, easeOut]
        );

        app.endUndoGroup();
        showSoftNotification("Pop-up animation applied successfully!", 2000);
      } else {
        alert("No layer selected. Please select a layer.");
      }
    }
  } else {
    alert("No active composition found. Please open a composition.");
  }
}
