{
    //find selected layer
    var comp = app.project.activeItem; // Get the active composition
    if (comp && comp instanceof CompItem) { // Check if there is an active composition
        var selectedLayers = comp.selectedLayers; // Get the selected layers in the comp

        //loop through selected layers
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            // enable time remapping
            layer.timeRemapEnabled = true;
        
            // add expression to time remap
            var timeRemap = layer.property("Time Remap");
            var duration = comp.duration;
            var newDuration = duration;
            var expression = "loopOut()";
            timeRemap.expression = expression;
        }
    }

}