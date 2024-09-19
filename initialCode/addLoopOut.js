//add loopOut() expression to selected layers
function addLoopOut() {
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

        // Function to recursively traverse properties
        function traverseProperties(propertyGroup) {
          for (var j = 1; j <= propertyGroup.numProperties; j++) {
            var prop = propertyGroup.property(j);
            if (prop instanceof PropertyGroup) {
              // Recursively traverse nested property groups
              traverseProperties(prop);
            } else if (prop.numKeys > 0) {
              // Add expression "loopOut()" to the keyframed property
              prop.expression = "loopOut()";
            }
          }
        }

        // Start traversing from the layer's root property group
        traverseProperties(layer);
      }
      alert("loopOut() expression added to selected keyframes!");
    } else {
      alert("Please select a layer with keyframes in it.");
    }
  }
}

addLoopOut();
