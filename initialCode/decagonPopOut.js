
(function createDecagonPopOut() {

    // 1. Validation and Setup
    
    var destinationComp = null;
    var subjectSource = null;
    var bgSource = null;

    // Check Input Sources from Project Panel
    var selectedItems = app.project.selection;
    var validFootage = [];

    // Collect valid footage/comp items that could be sources
    for (var i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i] instanceof FootageItem || selectedItems[i] instanceof CompItem) {
            validFootage.push(selectedItems[i]);
        }
    }
    
    // Attempt Detection of Roles
    if (validFootage.length === 3) {
        // Try to find the single Comp among 3 items which would be the destination
        var comps = [];
        var footages = [];
        for (var i = 0; i < validFootage.length; i++) {
             if (validFootage[i] instanceof CompItem) comps.push(validFootage[i]);
             else footages.push(validFootage[i]);
        }
        
        // If exactly 1 comp and 2 non-destinations, assume that comp is destination
        if (comps.length === 1 && footages.length === 2) {
             destinationComp = comps[0];
             subjectSource = footages[0]; // Assume first is subject
             bgSource = footages[1];
        }
    } else if (validFootage.length === 2) {
         // If 2 items, they must be the sources
         subjectSource = validFootage[0];
         bgSource = validFootage[1];
         
         // Try Active Item as potential destination
         if (app.project.activeItem instanceof CompItem) {
             destinationComp = app.project.activeItem;
         }
    }

    // --- UI Fallback Logic ---
    // If we have sources but NO destination (because timeline wasn't active), ASK the user.
    if (subjectSource && bgSource && !destinationComp) {
        
        // Gather all comps
        var allComps = [];
        for (var i = 1; i <= app.project.items.length; i++) {
            if (app.project.items[i] instanceof CompItem) {
                allComps.push(app.project.items[i]);
            }
        }

        if (allComps.length > 0) {
            var dlg = new Window("dialog", "Select Target Composition");
            dlg.orientation = "column";
            dlg.add("statictext", undefined, "Could not detect active composition.");
            dlg.add("statictext", undefined, "Where should the result be placed?");
            
            var list = dlg.add("listbox", [0, 0, 300, 200], []);
            for (var j = 0; j < allComps.length; j++) {
                list.add("item", allComps[j].name);
            }
            list.selection = 0;
            
            var btnGroup = dlg.add("group");
            var btnSelect = btnGroup.add("button", undefined, "Select Comp", {name: "ok"});
            var btnStandalone = btnGroup.add("button", undefined, "Create New (Standalone)");
            var btnCancel = btnGroup.add("button", undefined, "Cancel", {name: "cancel"});
            
            btnStandalone.onClick = function() {
                destinationComp = null; 
                dlg.close(2); // Return 2
            }
            
            var result = dlg.show();
            
            if (result === 1) { // OK (Select)
                if (list.selection) {
                    destinationComp = allComps[list.selection.index];
                }
            } else if (result === 2) { // Standalone
                destinationComp = null;
            } else { // Cancel
                return; // Exit script
            }
        }
    }

    // Final Validation of Sources
    if (!subjectSource || !bgSource) {
         alert("Please select 2 Source Images (Subject & Background) in the Project Panel.");
         return;
    }

    app.beginUndoGroup("Create Decagon Pop-Out");

    try {
        var baseName = subjectSource.name.replace(/\.[^\.]+$/, "");

        // 2. Create Destination Composition (The Wrapper)
        // Use destinationComp specs if available, else standard.
        var compWidth = destinationComp ? destinationComp.width : 1920;
        var compHeight = destinationComp ? destinationComp.height : 1080;
        var compDur = destinationComp ? destinationComp.duration : 10;
        var compFPS = destinationComp ? destinationComp.frameRate : 30;

        var newCompName = "Decagon - " + baseName;
        // avoid potential name collision or assume unique
        var newComp = app.project.items.addComp(newCompName, 1200, 1200, 1, compDur, compFPS);
        
        newComp.openInViewer();

        // 3. Add Layers
        var bgLayer = newComp.layers.add(bgSource);
        var subjectLayer = newComp.layers.add(subjectSource);
        
        // Parameters
        var frameSize = 724;
        var frameRadius = frameSize / 2;
        var strokeWidth = 12;
        var bgSize = 700;
        var subjectHeight = 850;
        var centerPos = [newComp.width / 2, newComp.height / 2];

        // --- Create Shapes (in New Comp) ---
        
        // 1. Decagon Frame
        var frameShape = newComp.layers.addShape();
        frameShape.name = "Decagon Frame";
        addDecagonShape(frameShape, frameRadius, strokeWidth, false); // Stroke only
        frameShape.position.setValue(centerPos);

        // 2. Background Matte
        var bgMatte = newComp.layers.addShape();
        bgMatte.name = "Background Matte";
        addDecagonShape(bgMatte, frameRadius, 0, true); // Fill only
        bgMatte.position.setValue(centerPos);

        // 3. Subject Matte (Pop-Out)
        var subjectMatte = newComp.layers.addShape();
        subjectMatte.name = "Subject Pop-Out Matte";
        addPopOutShape(subjectMatte, frameRadius, strokeWidth, frameSize);
        subjectMatte.position.setValue(centerPos);

        // --- Process Transforms ---

        // Background
        if (bgLayer.width > 0) {
            var bgScaleVal = 100;
            var scaleX = (bgSize / bgLayer.width) * 100;
            var scaleY = (bgSize / bgLayer.height) * 100;
            bgScaleVal = Math.max(scaleX, scaleY);
            bgLayer.property("Scale").setValue([bgScaleVal, bgScaleVal]);
        }
        bgLayer.position.setValue(centerPos);

        // Subject
        var subScaleVal = 100;
        if (subjectLayer.height > 0) {
            subScaleVal = (subjectHeight / subjectLayer.height) * 100;
            subjectLayer.property("Scale").setValue([subScaleVal, subScaleVal]);
        }

        // Subject Align Bottom
        var frameBottomY = centerPos[1] + frameRadius;
        var subjRect = subjectLayer.sourceRectAtTime(0, false);
        var sScale = subScaleVal / 100;
        var anchorY = subjectLayer.anchorPoint.value[1];
        var distToBottom = (subjRect.top + subjRect.height - anchorY) * sScale;
        subjectLayer.position.setValue([centerPos[0], frameBottomY - distToBottom]);

        // --- Stacking Order ---
        bgLayer.moveToBeginning();
        bgMatte.moveToBeginning();
        frameShape.moveToBeginning();
        subjectLayer.moveToBeginning();
        subjectMatte.moveToBeginning();

        // --- Apply Mattes ---
        safeSetTrackMatte(subjectLayer, subjectMatte);
        safeSetTrackMatte(bgLayer, bgMatte);

        // --- Apply Shadows ---
        addDropShadow(frameShape, {
            opacity: 125, // ~50%
            distance: 0,
            softness: 20
        });

        addDropShadow(subjectLayer, {
            opacity: 125, // ~50%
            distance: 10,
            softness: 30
        });

        // --- Place New Comp Logic ---
        if (destinationComp) {
            // Add new comp to destination
            var resultLayer = destinationComp.layers.add(newComp);
            resultLayer.moveToBeginning();
            resultLayer.selected = true;
            
            // Switch view to destination comp
            destinationComp.openInViewer();
            
            alert("Decagon Pop-Out Created in '" + destinationComp.name + "'!");
        } else {
            alert("Decagon Pop-Out Created!\n(Opened as new composition)");
        }

    } catch (err) {
        alert("Error: " + err.toString());
    } finally {
        app.endUndoGroup();
    }

    // --- Helpers ---

    function addDecagonShape(shapeLayer, radius, strokeW, isFill) {
        var vectors = shapeLayer.content.addProperty("ADBE Vector Group").content;
        var star = vectors.addProperty("ADBE Vector Shape - Star");
        star.property("Type").setValue(2);
        star.property("Points").setValue(10);
        star.property("Outer Radius").setValue(radius);

        if (isFill) {
            var fill = vectors.addProperty("ADBE Vector Graphic - Fill");
            fill.property("Color").setValue([1, 1, 1]);
        } else {
            var stroke = vectors.addProperty("ADBE Vector Graphic - Stroke");
            stroke.property("Color").setValue([0, 0, 0]);
            stroke.property("Stroke Width").setValue(strokeW);
        }
    }

    function addPopOutShape(shapeLayer, frameRadius, strokeW, frameSize) {
        var vectors = shapeLayer.content.addProperty("ADBE Vector Group").content;
        var poly = vectors.addProperty("ADBE Vector Shape - Star");
        poly.property("Type").setValue(2);
        poly.property("Points").setValue(10);
        poly.property("Outer Radius").setValue(frameRadius - (strokeW/2));

        var rect = vectors.addProperty("ADBE Vector Shape - Rect");
        var w = frameSize * 1.5;
        var h = frameSize;
        rect.property("Size").setValue([w, h]);
        rect.property("Position").setValue([0, -h * 0.4]);

        var fill = vectors.addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue([1, 1, 1]);
    }

    function safeSetTrackMatte(layer, matteLayer) {
        if (!layer || !matteLayer) return;
        try {
            if (typeof layer.setTrackMatte === "function") {
               layer.setTrackMatte(matteLayer, TrackMatteType.ALPHA);
            } else {
                throw "Legacy";
            }
        } catch (e) {
            if (matteLayer.index !== layer.index - 1) {
                matteLayer.moveBefore(layer);
            }
            layer.trackMatteType = TrackMatteType.ALPHA;
        }
        matteLayer.enabled = false;
    }

    function addDropShadow(layer, options) {
        try {
            var effect = layer.Effects.addProperty("ADBE Drop Shadow");
            if (options.opacity) effect.property("Opacity").setValue(options.opacity); 
            if (options.distance !== undefined) effect.property("Distance").setValue(options.distance);
            if (options.softness) effect.property("Softness").setValue(options.softness);
        } catch(e) {
            // Ignore
        }
    }

})();
