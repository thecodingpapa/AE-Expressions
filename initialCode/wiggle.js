{
    
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

        //add wiggle expression to the selected layer
        var prop = layer.property("Position");

        // Create the looping wiggle expression
        var expression = 'wiggle('+1+', '+10+')';

        // Add the expression to the property
        prop.expression = expression;
      }
      
      showSoftNotification("Wiggle() expression added to selected keyframes!", 2000); // Display notification for 2 seconds
    } else {
      alert("Please select a layer with keyframes in it.");
    }
  }

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

// Example usage within your existing code
{
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

      // Add wiggle expression to the selected layer
      var prop = layer.property("Position");
      // Define the wiggle frequency, amplitude, and loop duration
      var wiggleFreq = 2; // wiggle frequency in times per second
      var wiggleAmp = 10; // wiggle amplitude in pixels

      // Create the looping wiggle expression
      var expression =
        "freq = " + wiggleFreq + ";\n" +
        "amp = " + wiggleAmp + ";\n" +
        "wiggle(freq, amp)";

      // Add the expression to the property
      prop.expression = expression;
    }
    showSoftNotification("Wiggle() expression added to selected keyframes!", 2000); // Display notification for 2 seconds
  } else {
    showSoftNotification("Please select a layer with keyframes in it.", 2000); // Display notification for 2 seconds
  }
}