// After Effects Script - Add Composition Marker

function addCompositionMarker() {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        alert("Please select a composition first.");
        return;
    }

    // Show dialog for marker settings
    var markerSettings = showMarkerDialog();
    if (!markerSettings) return;

    app.beginUndoGroup("Add Composition Marker");

    var currentTime = comp.time;
    var markerProperty = comp.markerProperty;

    // Create marker with comment
    var marker = new MarkerValue(markerSettings.comment);
    
    // Set duration based on marker type
    if (markerSettings.isDuration) {
        marker.duration = markerSettings.duration;
    }
    // Pin markers have no duration (duration = 0 by default)

    // Add the marker at current time
    markerProperty.setValueAtTime(currentTime, marker);

    app.endUndoGroup();
    
    var markerType = markerSettings.isDuration ? "Duration" : "Pin";
    alert(markerType + " marker added at " + currentTime.toFixed(2) + " seconds!");
}

function showMarkerDialog() {
    var dialog = new Window("dialog", "Add Composition Marker");
    dialog.orientation = "column";
    dialog.alignChildren = "fill";
    dialog.preferredSize.width = 300;

    // Comment section
    var commentGroup = dialog.add("group");
    commentGroup.orientation = "column";
    commentGroup.alignChildren = "fill";
    commentGroup.add("statictext", undefined, "Marker Comment:");
    var commentInput = commentGroup.add("edittext", undefined, "");
    commentInput.characters = 30;
    commentInput.active = true; // Focus on comment field

    // Marker type section
    var typeGroup = dialog.add("group");
    typeGroup.add("statictext", undefined, "Marker Type:");

    var radioGroup = dialog.add("group");
    radioGroup.orientation = "column";
    radioGroup.alignChildren = "left";

    var durationRadio = radioGroup.add("radiobutton", undefined, "Duration Marker");
    var pinRadio = radioGroup.add("radiobutton", undefined, "Pin Marker");
    
    // Default to duration marker
    durationRadio.value = true;

    // Duration section
    var durationGroup = dialog.add("group");
    durationGroup.add("statictext", undefined, "Duration (seconds):");
    var durationInput = durationGroup.add("edittext", undefined, "1.0");
    durationInput.characters = 8;

    // Enable/disable duration input based on marker type
    function updateDurationInput() {
        durationInput.enabled = durationRadio.value;
        if (durationRadio.value) {
            durationInput.text = "1.0";
        } else {
            durationInput.text = "0.0";
        }
    }

    // Add event listeners for radio buttons
    durationRadio.onClick = function() {
        updateDurationInput();
    };

    pinRadio.onClick = function() {
        updateDurationInput();
    };

    // Initialize duration input state
    updateDurationInput();

    // Buttons
    var buttonGroup = dialog.add("group");
    buttonGroup.alignment = "center";
    var okButton = buttonGroup.add("button", undefined, "Add Marker");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");

    // Make OK button default
    okButton.active = true;

    okButton.onClick = function() {
        if (commentInput.text === "") {
            alert("Please enter a comment for the marker.");
            return;
        }
        dialog.close(1);
    };

    cancelButton.onClick = function() {
        dialog.close(0);
    };

    // Allow Enter key to submit
    commentInput.onChanging = function() {
        // Enable OK button when there's text
    };

    if (dialog.show() == 0) return null;

    return {
        comment: commentInput.text,
        duration: parseFloat(durationInput.text) || 1.0,
        isDuration: durationRadio.value
    };
}

// Run the script
addCompositionMarker();
