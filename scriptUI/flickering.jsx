{
    // Main function to build the UI panel
    function createUI(thisObj) {
        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Flicker Opacity Tool", undefined, {resizeable: true});
        
        // Define UI elements
        myPanel.orientation = "column";
        myPanel.alignChildren = ["fill", "top"];

        // Add UI elements
        myPanel.add("statictext", undefined, "Set Flicker Duration (seconds)");

        // Flicker duration input
        var durationInput = myPanel.add("edittext", undefined, "0.5"); // Default to 0.5 seconds
        durationInput.characters = 5;

        // Flicker count input
        myPanel.add("statictext", undefined, "Number of Flickers");
        var flickerCountInput = myPanel.add("edittext", undefined, "5"); // Default to 5 flickers
        flickerCountInput.characters = 5;

        // Flicker minimum opacity input
        myPanel.add("statictext", undefined, "Minimum Flicker Opacity (%)");
        var minOpacityInput = myPanel.add("edittext", undefined, "10"); // Default to 10% minimum opacity
        minOpacityInput.characters = 5;

        // Button to apply flicker effect 
        var flickerButton = myPanel.add("button", undefined, "Flicker Opacity");

        // Set up button action
        flickerButton.onClick = function() {
            var duration = parseFloat(durationInput.text);
            var flickerCount = parseInt(flickerCountInput.text);
            var minOpacity = parseFloat(minOpacityInput.text);
            flickerOpacity(duration, flickerCount, minOpacity);
        };

        // Resize panel to fit elements
        myPanel.layout.layout(true);
        
        return myPanel;
    }

    // Function to flicker opacity
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
                    var stepDuration = duration / flickerCount;

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

    // If running as a dockable panel in After Effects
    var myScriptUIPanel = createUI(this);

    if (myScriptUIPanel instanceof Window) {
        myScriptUIPanel.center();
        myScriptUIPanel.show();
    }
}