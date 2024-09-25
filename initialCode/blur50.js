{
    //blur 50% on the selected layer
    //first check if there is selected layer
    if (!app.project.activeItem || !app.project.activeItem.selectedLayers.length) {
        alert("Please select a layer");
        return;
    }
    var selectedLayer = app.project.activeItem.selectedLayers;
    //loop through the selected layers
    for (var i = 0; i < selectedLayer.length; i++) {
        var blur = selectedLayer[i].property("Effects").addProperty("ADBE Gaussian Blur 2");
        blur.property("Blurriness").setValue(50); // Adjust blur amount
    }

}