{
  // Create an undo group to ensure all actions are grouped together
  app.beginUndoGroup("Animate Layer and Mask Path");

  var comp = app.project.activeItem; // Get the active composition

  if (comp && comp instanceof CompItem) {
    var selectedLayers = comp.selectedLayers; // Get the first selected layer

    // loop through all selected layers
    for (var i = 0; i < selectedLayers.length; i++) {
      var selectedLayer = selectedLayers[i];

      if (selectedLayer) {
        // Get the layer's width and height(apply the scale value)
        var layerWidth = selectedLayer.sourceRectAtTime(comp.time, false).width ;
        var layerHeight = selectedLayer.sourceRectAtTime(
          comp.time,
          false
        ).height;

        // Create a mask with the same size as the layer
        var mask = selectedLayer.Masks.addProperty("ADBE Mask Atom"); // Add a mask to the selected layer
        var maskShape = mask.property("ADBE Mask Shape");

        // Define the initial mask shape (same size as the layer)
        var initialShape = new Shape();
        initialShape.vertices = [
          [0, 0], // Top-left
          [layerWidth, 0], // Top-right
          [layerWidth, layerHeight], // Bottom-right
          [0, layerHeight], // Bottom-left
        ];
        initialShape.closed = true;

        // Set the initial mask shape
        maskShape.setValue(initialShape);

        // Move the layer to the position below its original position
        var layerPos = selectedLayer
          .property("ADBE Transform Group")
          .property("ADBE Position").value;
        var positionProperty = selectedLayer
          .property("ADBE Transform Group")
          .property("ADBE Position");

        // Set the first keyframe for position (below original position)
        positionProperty.setValueAtTime(comp.time, [
          layerPos[0],
          layerPos[1] + layerHeight * selectedLayer.scale.value[1] / 100,
        ]);

        // Set the second keyframe for position (original position)
        positionProperty.setValueAtTime(comp.time + 0.4, [
          layerPos[0],
          layerPos[1],
        ]);

        // Animate the mask path along with the layer movement
        var animatedShape = new Shape();
        animatedShape.vertices = [
          [0, layerHeight], // Top-left moves down by layer height
          [layerWidth, layerHeight], // Top-right moves down by layer height
          [layerWidth, layerHeight * 2], // Bottom-right moves down
          [0, layerHeight * 2], // Bottom-left moves down
        ];
        animatedShape.closed = true;

        // Set the first keyframe for the mask shape (initial mask)
        maskShape.setValueAtTime(comp.time, initialShape);

        // Set the second keyframe for the mask shape (stretched mask)
        maskShape.setValueAtTime(comp.time + 0.4, animatedShape);

        // invert the mask
        mask.inverted = true;

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

        //add expression to the layer position
        positionProperty.expression = bounceExpression;
      } else {
        alert("No layer is selected.");
      }
    }
  } else {
    alert("Please select a composition and a layer.");
  }

  app.endUndoGroup();
}


// From the Top
// {
//     // Create an undo group to ensure all actions are grouped together
//     app.beginUndoGroup("Animate Layer and Mask Path");
  
//     var comp = app.project.activeItem; // Get the active composition
  
//     if (comp && comp instanceof CompItem) {
//       var selectedLayers = comp.selectedLayers; // Get the first selected layer
  
//       // loop through all selected layers
//       for (var i = 0; i < selectedLayers.length; i++) {
//         var selectedLayer = selectedLayers[i];
  
//         if (selectedLayer) {
//           // Get the layer's width and height(apply the scale value)
//           var layerWidth = selectedLayer.sourceRectAtTime(comp.time, false).width ;
//           var layerHeight = selectedLayer.sourceRectAtTime(
//             comp.time,
//             false
//           ).height;
  
//           // Create a mask with the same size as the layer
//           var mask = selectedLayer.Masks.addProperty("ADBE Mask Atom"); // Add a mask to the selected layer
//           var maskShape = mask.property("ADBE Mask Shape");
  
//           // Define the initial mask shape (same size as the layer)
//           var initialShape = new Shape();
//           initialShape.vertices = [
//             [0, 0], // Top-left
//             [layerWidth, 0], // Top-right
//             [layerWidth, layerHeight], // Bottom-right
//             [0, layerHeight], // Bottom-left
//           ];
//           initialShape.closed = true;
  
//           // Set the initial mask shape
//           maskShape.setValue(initialShape);
  
//           // Move the layer to the position below its original position
//           var layerPos = selectedLayer
//             .property("ADBE Transform Group")
//             .property("ADBE Position").value;
//           var positionProperty = selectedLayer
//             .property("ADBE Transform Group")
//             .property("ADBE Position");
  
//           // Set the first keyframe for position (below original position)
//           positionProperty.setValueAtTime(comp.time, [
//             layerPos[0],
//             layerPos[1] - layerHeight * selectedLayer.scale.value[1] / 100,
//           ]);
  
//           // Set the second keyframe for position (original position)
//           positionProperty.setValueAtTime(comp.time + 0.4, [
//             layerPos[0],
//             layerPos[1],
//           ]);
  
//           // Animate the mask path along with the layer movement
//           var animatedShape = new Shape();
//           animatedShape.vertices = [
//             [0, -layerHeight], // Top-left moves down by layer height
//             [layerWidth, -layerHeight], // Top-right moves down by layer height
//             [layerWidth, 0], // Bottom-right moves down
//             [0, 0], // Bottom-left moves down
//           ];
//           animatedShape.closed = true;
  
//           // Set the first keyframe for the mask shape (initial mask)
//           maskShape.setValueAtTime(comp.time, initialShape);
  
//           // Set the second keyframe for the mask shape (stretched mask)
//           maskShape.setValueAtTime(comp.time + 0.4, animatedShape);
  
//           // invert the mask
//           mask.inverted = true;
  
//           // Apply the provided bounce expression
//           var bounceExpression =
//             "amp = 0.05;" + // Amplitude
//             "freq = 2.0;" + // Frequency
//             "decay = 10.0;" + // Decay
//             "n = 0;" +
//             "if (numKeys > 0){" +
//             "n = nearestKey(time).index;" +
//             "if (key(n).time > time){" +
//             "n--;" +
//             "}" +
//             "}" +
//             "if (n == 0){" +
//             "t = 0;" +
//             "}else{" +
//             "t = time - key(n).time;" +
//             "}" +
//             "if (n > 0 && t < 1){" +
//             "v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);" +
//             "value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);" +
//             "}else{" +
//             "value;" +
//             "}";
  
//           //add expression to the layer position
//           positionProperty.expression = bounceExpression;
//         } else {
//           alert("No layer is selected.");
//         }
//       }
//     } else {
//       alert("Please select a composition and a layer.");
//     }
  
//     app.endUndoGroup();

// }