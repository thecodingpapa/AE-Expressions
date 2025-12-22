{
    function createNeonLightFlow() {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            comp = app.project.items.addComp("Neon Light Flow", 1920, 1080, 1, 10, 30);
            comp.openInViewer();
        }

        app.beginUndoGroup("Neon Light Flow");

        try {
            // Step 1: Create a new Solid Layer
            var solidLayer = comp.layers.addSolid([0, 0, 0], "Neon Path", comp.width, comp.height, comp.pixelAspect, comp.duration);

            // Create a Mask
            // "Draw a custom path on the solid layer to create a Mask"
            var mask = solidLayer.Masks.addProperty("ADBE Mask Atom");
            mask.maskMode = MaskMode.ADD;

            // Create a sample path (S-curve) simulating user drawing
            var myShape = new Shape();
            // Approximating a customized path
            myShape.vertices = [[400, 540], [960, 540], [1520, 540]];
            myShape.inTangents = [[0, 0], [-150, 150], [0, 0]];
            myShape.outTangents = [[150, -150], [150, -150], [0, 0]];
            myShape.closed = false;
            
            mask.property("ADBE Mask Shape").setValue(myShape);

            // Step 2: Apply and Configure Saber
            var saber = solidLayer.Effects.addProperty("Saber");
            if (!saber) {
                alert("Effect 'Saber' could not be applied. Please ensure Video Copilot Saber is installed.");
                return;
            }

            // Change Core Type to Layer Mask
            // Core Type is likely "Core Type" text. Parameter index behavior varies, but name referencing is safer if supported.
            // Dropdown indices in AE scripting are 1-based.
            // Saber -> Core Type. 1=Saber, 2=Layer Masks.
            var coreTypeProp = saber.property("Core Type");
            if (coreTypeProp) {
                coreTypeProp.setValue(2); // 2 usually corresponds to Layer Masks
            } else {
                 // Try finding it within a group if top-level access fails (though usually effect.property("Name") works)
                 // Saber often nests inside "Customize Core"
                 var customizeCore = saber.property("Customize Core");
                 if (customizeCore && customizeCore.property("Core Type")) {
                     customizeCore.property("Core Type").setValue(2);
                 }
            }

            // Set Start Size to 0%
            var startSizeProp = saber.property("Start Size");
            if (!startSizeProp && saber.property("Customize Core")) {
                 startSizeProp = saber.property("Customize Core").property("Start Size");
            }
            if (startSizeProp) {
                startSizeProp.setValue(0);
            }

            // Step 3: Animate the Line
            // End Offset
            var endOffsetProp = saber.property("End Offset");
             if (!endOffsetProp && saber.property("Customize Core")) {
                 endOffsetProp = saber.property("Customize Core").property("End Offset");
            }

            if (endOffsetProp) {
                endOffsetProp.setValueAtTime(0, 0);   // 0% at 0s
                endOffsetProp.setValueAtTime(1, 100); // 100% at 1s
            }

            // Step 4: Add Movement Expression
            // "Mask Evolution"
            var maskEvolutionProp = saber.property("Mask Evolution");
             if (!maskEvolutionProp && saber.property("Customize Core")) {
                 maskEvolutionProp = saber.property("Customize Core").property("Mask Evolution");
            }


            if (maskEvolutionProp) {
                // Determine if stopwatch click is needed (enabling expression)
                // In scripting, setting .expression enables it.
                maskEvolutionProp.expression = "time * 200";
            }

            // Helper to find properties recursively
            function findPropertyRecursive(propGroup, matchName) {
                if (!propGroup || !propGroup.numProperties) return null;
                for (var i = 1; i <= propGroup.numProperties; i++) {
                    var prop = propGroup.property(i);
                    if (prop.name === matchName) return prop;
                    if (prop.propertyType === PropertyType.NAMED_GROUP || (prop.numProperties && prop.numProperties > 0)) {
                        var found = findPropertyRecursive(prop, matchName);
                        if (found) return found;
                    }
                }
                return null;
            }

            // Step 5: Render Settings > Composite Settings to Transparent
            var compositeSettingsProp = findPropertyRecursive(saber, "Composite Settings");
            
            if (compositeSettingsProp) {
                compositeSettingsProp.setValue(1); // Set to Transparent (Index 2 in dropdown)
            } else {
                // Fallback attempt: sometimes names differ slightly or it's top level
                // alert("Could not find Composite Settings, please set manually."); 
            }

        } catch (e) {
            alert("Error in Neon Light Flow script: " + e.toString());
        }

        app.endUndoGroup();
    }

    createNeonLightFlow();
}
