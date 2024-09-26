{
    // check if there is selected layer
    if (!app.project.activeItem || !app.project.activeItem.selectedLayers.length) {
        alert("Please select a layer");
        return;
    }

    //add shadow to the selected layer
    var selectedLayer = app.project.activeItem.selectedLayers;

    //loop through the selected layers
    for (var i = 0; i < selectedLayer.length; i++) {
        var dropShadow = selectedLayer[i].property("Effects").addProperty("ADBE Drop Shadow");
        dropShadow.property("Opacity").setValue(80); // Adjust shadow opacity
        dropShadow.property("Distance").setValue(7); // Adjust shadow distance
        dropShadow.property("Direction").setValue(135); // Adjust shadow direction
        dropShadow.property("Softness").setValue(7); // Adjust shadow softness
    }
    

}