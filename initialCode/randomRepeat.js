{
    // Check if there is a selected layer
    if (app.project.activeItem && app.project.activeItem.selectedLayers.length > 0) {
        app.beginUndoGroup("Duplicate and Randomize Layers with Scale Factor");

        var comp = app.project.activeItem;
        var selectedLayer = comp.selectedLayers[0]; // Get the first selected layer
        var wiggleAmount = 10; // Amount of wiggle (adjust as needed)
        var wiggleFrequency = 2; // Frequency of wiggle
        var minDistance = 50; // Minimum distance between layers
        var randomIntensity = 0.5;

        var newLayers = [];

        // Get the size of the selected layer and adjust for its scale
        var layerWidth = selectedLayer.sourceRectAtTime(0, false).width * (selectedLayer.scale.value[0] / 100);
        var layerHeight = selectedLayer.sourceRectAtTime(0, false).height * (selectedLayer.scale.value[1] / 100);

        // Calculate the total number of duplicates based on available space and layer scale
        var areaPerLayer = (layerWidth + minDistance) * (layerHeight + minDistance);
        var compArea = comp.width * comp.height;
        var numDuplicates = Math.floor(compArea / areaPerLayer); // Number of duplicates, no subtraction as we're removing the original

        // Set initial x and y positions
        var startX = layerWidth / 2 + 50; // Margin from the left edge
        var startY = layerHeight / 2 + 50; // Margin from the top edge
        var offsetX = layerWidth + minDistance; // Horizontal spacing between layers
        var offsetY = layerHeight + minDistance; // Vertical spacing between layers
        var currentX = startX;
        var currentY = startY;

        // Loop to create duplicates and position them in a zigzag pattern with randomness
        for (var i = 0; i < numDuplicates; i++) {
            // Duplicate the selected layer
            var duplicatedLayer = selectedLayer.duplicate();

            // Store the duplicated layer
            newLayers.push(duplicatedLayer);

            // Add random offset for a more natural, less rigid position
            var randomOffsetX = (Math.random() - 0.5) * minDistance * randomIntensity; // Adjust as needed for more randomness
            var randomOffsetY = (Math.random() - 0.5) * minDistance * randomIntensity;

            // Apply the position with a zigzag pattern and random offset
            duplicatedLayer.position.setValue([currentX + randomOffsetX, currentY + randomOffsetY]);

            // Move to the next position
            currentX += offsetX;

            // If the next position would exceed the comp width, move down a row
            if (currentX + layerWidth / 2 > comp.width - 50) {
                currentX = startX;
                currentY += offsetY;

                // Offset the starting position for the next row to create the zigzag effect
                if ((Math.floor(currentY / offsetY) % 2) !== 0) {
                    currentX += offsetX / 2; // Shift every other row by half the layer width + minDistance
                }
            }

            // Apply a wiggle expression to the position property for dynamic movement
            // duplicatedLayer.position.expression = 'wiggle(' + wiggleFrequency + ', ' + wiggleAmount + ');';
        }

        // Pre-compose all the duplicated layers
        for (var i = 0; i < newLayers.length; i++) {
            newLayers[i].selected = true;
        }

        var precomp = comp.layers.precompose(
            newLayers.map(function(layer) { return layer.index; }),
            selectedLayer.name + "_scaled_zigzag_randomized_group",
            true
        );

        // Remove the original selected layer from the comp
        selectedLayer.remove();

        app.endUndoGroup();
        alert("Duplicated, arranged in a more randomized zigzag pattern considering scale, and pre-composed layers successfully!");
    } else {
        alert("Please select a layer first.");
    }
}

// {
//   function showSoftNotification(message, duration) {
//     var notificationWindow = new Window("palette", "Notification", undefined, {
//       closeButton: false,
//     });
//     notificationWindow.add("statictext", undefined, message);
//     notificationWindow.show();

//     // Automatically close the notification after the specified duration
//     app.setTimeout(function () {
//       notificationWindow.close();
//     }, duration);
//   }

//   // Check if there is a selected layer
//   if (
//     app.project.activeItem &&
//     app.project.activeItem.selectedLayers.length > 0
//   ) {
//     app.beginUndoGroup("Duplicate and Randomize Layers with Extra 30");

//     var comp = app.project.activeItem;
//     var selectedLayer = comp.selectedLayers[0]; // Get the first selected layer
//     var numInitialDuplicates = 50; // Number of initial duplicates to create
//     var numExtraDuplicates = 50; // Number of extra duplicates to create based on initial positions
//     var wiggleAmount = 10; // Amount of wiggle (adjust as needed)
//     var wiggleFrequency = 2; // Frequency of wiggle
//     var minDistance = 100; // Minimum distance between layers for initial positioning
//     var extraMinDistance = 60; // Minimum distance for extra layers placement

//     var newLayers = [];
//     var positions = [];

//     // Helper function to check if a point is far enough from existing points
//     function isFarEnough(newPos, existingPositions, minDistance) {
//       for (var i = 0; i < existingPositions.length; i++) {
//         var pos = existingPositions[i];
//         var distance = Math.sqrt(
//           Math.pow(newPos[0] - pos[0], 2) + Math.pow(newPos[1] - pos[1], 2)
//         );
//         if (distance < minDistance) {
//           return false; // Too close to an existing point
//         }
//       }
//       return true;
//     }

//     // Create initial 50 duplicates with spacing
//     for (var i = 0; i < numInitialDuplicates; i++) {
//       var duplicatedLayer = selectedLayer.duplicate();
//       newLayers.push(duplicatedLayer);

//       var randomX, randomY;
//       var attempts = 0;

//       // Try to find a position that is far enough from other layers
//       do {
//         randomX = Math.random() * (comp.width - 100) + 50; // Ensures a margin of 50px from edges
//         randomY = Math.random() * (comp.height - 100) + 50;
//         attempts++;
//       } while (
//         !isFarEnough([randomX, randomY], positions, minDistance) &&
//         attempts < 100
//       );

//       // Store the position to prevent overlapping
//       positions.push([randomX, randomY]);

//       // Apply the position
//       duplicatedLayer.position.setValue([randomX, randomY]);

//       // Apply a wiggle expression to the position property
//     //   duplicatedLayer.position.expression =
//     //     "wiggle(" + wiggleFrequency + ", " + wiggleAmount + ");";
//     }

//     // Now create 30 more duplicates and position them based on the gaps
//     for (var i = 0; i < numExtraDuplicates; i++) {
//       var extraLayer = selectedLayer.duplicate();
//       newLayers.push(extraLayer);

//       var extraX, extraY;
//       var maxAttempts = 100;
//       var bestPos = null;
//       var bestDistance = 0;

//       // Try multiple random positions and select the one with the maximum distance from existing points
//       for (var attempt = 0; attempt < maxAttempts; attempt++) {
//         var testX = Math.random() * (comp.width - 100) + 50;
//         var testY = Math.random() * (comp.height - 100) + 50;

//         // Measure distance to the nearest existing position
//         var minDistToExisting = Math.min.apply(
//           null,
//           positions.map(function (pos) {
//             return Math.sqrt(
//               Math.pow(testX - pos[0], 2) + Math.pow(testY - pos[1], 2)
//             );
//           })
//         );

//         // Keep track of the position with the maximum minimum distance
//         if (minDistToExisting > bestDistance) {
//           bestDistance = minDistToExisting;
//           bestPos = [testX, testY];
//         }
//       }

//       // Use the best position found after maxAttempts
//       if (bestPos) {
//         extraX = bestPos[0];
//         extraY = bestPos[1];
//       } else {
//         // Fallback to a random position if no good position was found
//         extraX = Math.random() * (comp.width - 100) + 50;
//         extraY = Math.random() * (comp.height - 100) + 50;
//       }

//       // Store this position to prevent overlapping with other layers
//       positions.push([extraX, extraY]);

//       // Apply the position
//       extraLayer.position.setValue([extraX, extraY]);

//       // Apply a wiggle expression to the position property
//     //   extraLayer.position.expression =
//     //     "wiggle(" + wiggleFrequency + ", " + wiggleAmount + ");";
//     }

//     // Include the original selected layer in the array
//     newLayers.push(selectedLayer);

//     // Pre-compose all the duplicated layers and the original layer
//     for (var i = 0; i < newLayers.length; i++) {
//       newLayers[i].selected = true;
//     }

//     var precomp = comp.layers.precompose(
//       newLayers.map(function (layer) {
//         return layer.index;
//       }),
//       selectedLayer.name + "_randomized_group_with_extra",
//       true
//     );

//     app.endUndoGroup();

//     showSoftNotification("Duplicated successfully!!", 2000);
//   } else {
//     alert("Please select a layer first.");
//   }
// }
