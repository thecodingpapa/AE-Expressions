{
    // Diagnostic script to identify effect match names
    var comp = app.project.activeItem;
    
    if (!(comp instanceof CompItem)) {
        alert("Please select a composition first.");
    } else {
        var selectedLayers = comp.selectedLayers;
        
        if (selectedLayers.length === 0) {
            alert("Please select at least one layer.");
        } else {
            var layer = selectedLayers[0];
            var effects = layer.property("ADBE Effect Parade");
            
            if (effects && effects.numProperties > 0) {
                var report = "Effects on layer '" + layer.name + "':\n\n";
                
                for (var i = 1; i <= effects.numProperties; i++) {
                    var effect = effects.property(i);
                    report += i + ". " + effect.name + "\n";
                    report += "   Match Name: " + effect.matchName + "\n\n";
                }
                
                alert(report);
            } else {
                alert("No effects found on layer '" + layer.name + "'");
            }
        }
    }
}
