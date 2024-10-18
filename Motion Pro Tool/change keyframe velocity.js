function changeKeyframeVelocity() {
  function showSoftNotification(message, duration) {
    var notificationWindow = new Window("palette", "Notification", undefined, {
      closeButton: false,
    });
    notificationWindow.add("statictext", undefined, message);
    notificationWindow.show();

    // Automatically close the notification after the specified duration
    app.setTimeout(function () {
      notificationWindow.close();
    }, duration);
  }

  // Get the active composition
  var comp = app.project.activeItem;

  // Ensure the composition is valid and something is selected
  if (
    comp != null &&
    comp instanceof CompItem &&
    comp.selectedLayers.length > 0
  ) {
    // Loop through selected layers
    for (var i = 0; i < comp.selectedLayers.length; i++) {
      var layer = comp.selectedLayers[i];

      // Check if the layer has selected properties with keyframes
      if (layer.selectedProperties.length > 0) {
        for (var j = 0; j < layer.selectedProperties.length; j++) {
          var prop = layer.selectedProperties[j];

          // Check if the property is keyframed
          if (prop.numKeys > 0) {
            // Check if the property is three-dimensional
            var isMultiDimensional =
              prop.propertyValueType === PropertyValueType.TwoD_SPATIAL ||
              prop.propertyValueType === PropertyValueType.ThreeD_SPATIAL ||
              prop.propertyValueType === PropertyValueType.TwoD ||
              prop.propertyValueType === PropertyValueType.ThreeD;

            // Check if the property is specifically the Scale property
            isMultiDimensional = prop.matchName === "ADBE Scale";

            // Loop through selected keyframes
            for (var k = 1; k <= prop.numKeys; k++) {
              if (prop.keySelected(k)) {
                // Define custom ease settings
                var easeIn = new KeyframeEase(0, 100);
                var easeOut = new KeyframeEase(0, 50);

                // Set ease for temporal keyframes
                if (isMultiDimensional) {
                  // Apply the ease for each dimension (e.g., [xEaseIn, yEaseIn, zEaseIn], [xEaseOut, yEaseOut, zEaseOut])
                  var easeInArray = [easeIn, easeIn]; // For 2D properties
                  var easeOutArray = [easeOut, easeOut];

                  // Adjust for 3D properties if needed
                  if (
                    prop.propertyValueType ===
                      PropertyValueType.ThreeD_SPATIAL ||
                    prop.propertyValueType === PropertyValueType.ThreeD
                  ) {
                    easeInArray = [easeIn, easeIn, easeIn];
                    easeOutArray = [easeOut, easeOut, easeOut];
                  }

                  prop.setTemporalEaseAtKey(k, easeInArray, easeOutArray);
                } else {
                  // Single dimension property
                  prop.setTemporalEaseAtKey(k, [easeIn], [easeOut]);
                }

                // Optional: Adjust spatial tangents for motion paths (if it's a spatial property)
                // prop.setSpatialTangentsAtKey(k, [50, 50], [-50, -50]);
              }
            }
          }
        }
      }
    }
    showSoftNotification("Keyframe ease adjusted!!", 2000);
  } else {
    alert("Please select a layer with keyframes.");
  }
}

changeKeyframeVelocity();
