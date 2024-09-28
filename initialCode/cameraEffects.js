{
    var comp = app.project.activeItem; // Get the active composition
    if (comp && comp instanceof CompItem) { // Check if there is an active composition
        var selectedLayers = comp.selectedLayers; // Get the selected layers in the comp
        if (selectedLayers.length > 1) { // Check if more than one layer is selected
            app.beginUndoGroup("Fit Layers, Set 3D Z Position, and Add Camera"); // Begin undo group

            var compWidth = comp.width; // Get composition width
            var compHeight = comp.height; // Get composition height

            // First, scale each layer to fit the composition frame without changing aspect ratio
            for (var i = 0; i < selectedLayers.length; i++) {
                var layer = selectedLayers[i];
                
                // Enable 3D layer if not already
                if (!layer.threeDLayer) {
                    layer.threeDLayer = true; // Enable 3D for the layer
                }

                var layerWidth = layer.width;
                var layerHeight = layer.height;
                var scaleFactor = Math.min(compWidth / layerWidth, compHeight / layerHeight)*1.5; // 1.5 times to comp

                layer.property("Scale").setValue([scaleFactor * 100, scaleFactor * 100, 100]); // Apply uniform scale
            }

            // Now, apply Z positioning for 3D layers
            var numLayers = selectedLayers.length;
            var totalDistance = (numLayers - 1) * 500; // Calculate total Z distance based on layers count
            var startZ = -totalDistance / 2; // Starting Z position

            for (var i = 0; i < numLayers; i++) {
                var layer = selectedLayers[i];
                var currentPosition = layer.property("Position").value;
                var newPosition = [currentPosition[0], currentPosition[1], startZ + (i * 500)]; // Set Z position with equal distance

                //check if keyframe enabled
                if (layer.position.isTimeVarying) {
                    layer.position.setValueAtTime(comp.time, newPosition);
                } else {
                    layer.position.setValue(newPosition);
                }
                
                layer.property("Position").setValue(newPosition); // Apply new Z position
            }

            // Add Camera at the top of the layer stack
            var cameraName = "3D Camera";
            var camera = comp.layers.addCamera(cameraName, [compWidth / 2, compHeight / 2]); // Add a camera at the center of the comp
            camera.moveToBeginning(); // Move the camera to the top of the layer stack

            // Set camera depth of field properties
            camera.property("Camera Options").property("depthOfField").setValue(true); // Enable depth of field
            camera.property("Camera Options").property("aperture").setValue(2000); // Set aperture

            // get default camera zoom value
            var zoom  = camera.property("Zoom").value;

            // Camera position set to the center of the comp and same distance as the zoomed out layers
            var cameraPosition = camera.property("Position").setValue([compWidth / 2, compHeight * 0.95, -zoom]);

            // add keyframes to camera position
            camera.property("Position").setValueAtTime(comp.time, [compWidth / 2, compHeight * 0.95, -zoom]);
            camera.property("Position").setValueAtTime(comp.time + 5, [compWidth / 2, compHeight * 0.05, -zoom]);

            // Animate focus distance to match Z positions of the layers
            var focusDistance = camera.property("Camera Options").property("focusDistance");
            
            var easeIn = new KeyframeEase(0, 70); // Influence: 50%
            var easeOut = new KeyframeEase(0, 70); // Influence: 50%

            for (var i = 0; i < numLayers; i++) {
                var layer = selectedLayers[i];
                var zPosition = layer.property("Position").value[2]; // Get Z position of the layer

                var keyTime = comp.time + i; // Set keyframes spaced by 1 second apart
                focusDistance.setValueAtTime(keyTime, zoom - zPosition); // Set focus distance keyframe
                // add ease to keyframes
                focusDistance.setTemporalEaseAtKey(i+1, [easeIn], [easeOut]);
            }

            // add zoom keyframes
            camera.property("Zoom").setValueAtTime(comp.time, zoom + totalDistance /2);
            camera.property("Zoom").setValueAtTime(comp.time + numLayers-1, zoom - totalDistance /2);

            // add ease to keyframes
            camera.property("Zoom").setTemporalEaseAtKey(1, [easeIn], [easeOut]);
            camera.property("Zoom").setTemporalEaseAtKey(2, [easeIn], [easeOut]);


            

            app.endUndoGroup(); // End undo group
        } else {
            alert("Please select more than one layer.");
        }
    } else {
        alert("Please select a composition.");
    }
}