// Define the path of the sound file
var soundFilePath = '/Users/Shared/Google Drive/RainIsHere/Utilt/SFX/Pop/Bubble 01.m4a';

// Ensure a composition is active
var comp = app.project.activeItem;
if (comp && comp instanceof CompItem) {
    app.beginUndoGroup('Place Imported Sound on Marker Timings');

    // Import the sound file
    var soundFile = new File(soundFilePath);
    if (soundFile.exists) {
        var importOptions = new ImportOptions(soundFile);
        var importedSound = app.project.importFile(importOptions);

        if (importedSound) {
            // Add the sound file to the composition as a layer
            var soundLayer = comp.layers.add(importedSound);

            // Find the Null object named "SFX"
            var sfxLayer = comp.layer('SFX');
            if (sfxLayer && sfxLayer.nullLayer) {
                
                // Check if the SFX layer has markers
                var markerProperty = sfxLayer.property("Marker");
                if (markerProperty && markerProperty.numKeys > 0) {

                    // Add the sound layer at each marker time
                    for (var j = 1; j <= markerProperty.numKeys; j++) {
                        var markerTime = markerProperty.keyTime(j);

                        // Duplicate sound layer and set start time to each marker time
                        var newSoundLayer = soundLayer.duplicate();
                        newSoundLayer.startTime = markerTime;
                    }

                    // Remove the original sound layer to keep only the duplicates at markers
                    soundLayer.remove();
                    alert('Sound added at each marker on SFX.');
                } else {
                    alert('No markers found on the SFX layer.');
                }
            } else {
                alert('Null object named "SFX" not found.');
            }
        } else {
            alert('Failed to import sound file.');
        }
    } else {
        alert('Sound file not found at the specified path.');
    }

    app.endUndoGroup();
} else {
    alert('Please select a composition.');
}