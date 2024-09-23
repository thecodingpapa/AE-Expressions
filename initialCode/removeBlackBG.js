{
    //find the selected layer
    var layer = app.project.activeItem.selectedLayers[0];
    
    //apply shift channels to remove black background
    var shiftChannels = layer.Effects.addProperty("ADBE Shift Channels");
    shiftChannels.property(1).setValue(2);
    shiftChannels.property(2).setValue(2);
    shiftChannels.property(3).setValue(2);
    shiftChannels.property(4).setValue(2);

    
}