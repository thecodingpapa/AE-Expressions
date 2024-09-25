{
    var comp = app.project.activeItem; // Get the active composition
if (comp && comp instanceof CompItem) { // Check if there is an active composition
    var selectedLayers = comp.selectedLayers; // Get the selected layers in the comp
    if (selectedLayers.length > 0) {
        app.beginUndoGroup("Move Special Characters to New Layer"); // Begin undo group

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            
            if (layer instanceof TextLayer) { // Check if the layer is a text layer
                var textProp = layer.property("Source Text");
                var textDocument = textProp.value; // Get the current text document
                var originalText = textDocument.text; // Get the text from the text document
                
                var hasDollar = (originalText.indexOf('$') === 0); // Check if the text starts with '$'
                var hasPercent = (originalText.lastIndexOf('%') === originalText.length - 1);  // Check if the text ends with '%'

                if (hasDollar || hasPercent) {
                    var specialChar = ''; // The character we'll move
                    var newText = originalText; // The new text without special characters

                    // Determine if we need to move a '$' or a '%'
                    if (hasDollar) {
                        specialChar = '$';
                        newText = originalText.substring(1); // Remove '$' from the text
                    } else if (hasPercent) {
                        specialChar = '%';
                        newText = originalText.slice(0, -1); // Remove '%' from the text
                    }

                    // Update the original layer text by removing the special character
                    textDocument.text = newText;
                    textProp.setValue(textDocument);

                    // Duplicate the original layer
                    var newLayer = layer.duplicate();

                    // Modify the duplicated layer's text to only contain the special character
                    var newLayerTextProp = newLayer.property("Source Text");
                    var newLayerTextDocument = newLayerTextProp.value;
                    newLayerTextDocument.text = specialChar;
                    newLayerTextProp.setValue(newLayerTextDocument);

                    // Scale the duplicated layer to 70% of the original size
                    var originalScale = layer.property("Scale").value;
                    newLayer.property("Scale").setValue([originalScale[0] * 0.7, originalScale[1] * 0.7]);

                }

                //get position of new composition from the original layer.
                var originalPosition = layer.property("Position").value;
                var originalLayerWidth = layer.sourceRectAtTime(comp.time, false).width;
                var originalLayerHeight = layer.sourceRectAtTime(comp.time, false).height;
                var newLayerWidth = newLayer.sourceRectAtTime(comp.time, false).width;
                //create a new composition.
                var newComp = app.project.items.addComp("adjusted_"+originalText, Math.round(originalLayerWidth*2), Math.round(originalLayerHeight*2), comp.pixelAspect, comp.duration, comp.frameRate);

                
                // Set the new layer position
                if (hasDollar) {
                    layer.property("Position").setValue([newComp.width/2+newLayerWidth/2, newComp.height/2]);
                    // Place the new layer on the left of the original text
                    newLayer.property("Position").setValue([
                        newComp.width/2 - originalLayerWidth / 2, 
                        newComp.height/2
                    ]);
                } else if (hasPercent) {
                    layer.property("Position").setValue([newComp.width/2-newLayerWidth/2, newComp.height/2]);
                    // Place the new layer on the right of the original text
                    newLayer.property("Position").setValue([
                        newComp.width/2 + originalLayerWidth / 2 , 
                        newComp.height/2
                    ]);
                }

                layer.copyToComp(newComp);
                newLayer.copyToComp(newComp);

                //set the position of new composition with original position.
                var newCompLayer = comp.layers.add(newComp);
                newCompLayer.property("Position").setValue(originalPosition);

                //delete the original layer and new layer.
                layer.remove();
                newLayer.remove();



                
            }
        }

        app.endUndoGroup(); // End undo group
    } else {
        alert("Please select at least one text layer.");
    }
} else {
    alert("Please select a composition.");
}
}
