{// Check if there is a selected layer
    if (app.project.activeItem && app.project.activeItem.selectedLayers.length > 0) {
        var comp = app.project.activeItem;
        var selectedLayer = comp.selectedLayers[0]; // Get the first selected layer
        
        // Get the layer's content bounding box
        var layerRect = selectedLayer.sourceRectAtTime(comp.time, false);
        
        // Get the current layer's position
        var layerPos = selectedLayer.position.value;
        
        // Calculate the center of the content
        var anchorX = layerRect.left + (layerRect.width / 2);
        var anchorY = layerRect.top + (layerRect.height / 2);
        
        // Set the anchor point to the center of the content
        selectedLayer.anchorPoint.setValue([anchorX, anchorY]);

        // Adjust the layer's position to compensate for the anchor point change
        var deltaX = anchorX - selectedLayer.anchorPoint.value[0];
        var deltaY = anchorY - selectedLayer.anchorPoint.value[1];
        
        selectedLayer.position.setValue([layerPos[0] + deltaX, layerPos[1] + deltaY]);

        alert("Anchor point centered in the layer's content!");
    } else {
        alert("Please select a layer first.");
    }
}