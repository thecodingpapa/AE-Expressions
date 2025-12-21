
(function createDecagonPopOut() {

    // 1. Validation and Setup
    var currentComp = app.project.activeItem;
    if (!(currentComp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    var selectedLayers = currentComp.selectedLayers;
    if (selectedLayers.length !== 2) {
        alert("Please select exactly 2 layers.\n1. Subject (Top)\n2. Background (Bottom)");
        return;
    }

    app.beginUndoGroup("Create Decagon Pop-Out");

    try {
        var subjectSource = selectedLayers[0].source;
        var bgSource = selectedLayers[1].source;
        var baseName = subjectSource.name.replace(/\.[^\.]+$/, "");

        // 2. Create Destination Composition
        // Use 1080x1080 or match active comp if smaller? 
        // User constraints are around 850px. 1080 is a good safe container.
        var newCompName = "Decagon - " + baseName;
        var newComp = app.project.items.addComp(newCompName, 1200, 1200, 1, currentComp.duration, currentComp.frameRate);
        
        // Open the new comp (optional, but helpful to see)
        newComp.openInViewer();

        // 3. Add Layers to New Comp
        // Note: Add Background first (index 2 implies below), Subject second (index 1 implies top).
        // Actually, AE adds to top.
        // Add BG first -> It becomes Layer 1.
        // Add Subject second -> It becomes Layer 1 (pushes BG to 2).
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

        // Background Transform
        if (bgLayer.width > 0) {
            var bgScaleVal = 100;
            var scaleX = (bgSize / bgLayer.width) * 100;
            var scaleY = (bgSize / bgLayer.height) * 100;
            bgScaleVal = Math.max(scaleX, scaleY);
            bgLayer.property("Scale").setValue([bgScaleVal, bgScaleVal]);
        }
        bgLayer.position.setValue(centerPos);

        // Subject Transform
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

        // --- Stacking Order (in New Comp) ---
        // Stack from Top to Bottom:
        // 1. Subject Matte
        // 2. Subject
        // 3. Frame
        // 4. BG Matte
        // 5. BG
        
        bgLayer.moveToBeginning();
        bgMatte.moveToBeginning();
        frameShape.moveToBeginning();
        subjectLayer.moveToBeginning();
        subjectMatte.moveToBeginning();

        // --- Apply Mattes ---
        safeSetTrackMatte(subjectLayer, subjectMatte);
        safeSetTrackMatte(bgLayer, bgMatte);

        // --- Place New Comp Logic ---
        // Add the new comp into the original active comp
        var resultLayer = currentComp.layers.add(newComp);
        resultLayer.moveToBeginning();
        
        // Optional: Hide original layers?
        selectedLayers[0].enabled = false;
        selectedLayers[1].enabled = false;
        selectedLayers[0].selected = false;
        selectedLayers[1].selected = false;
        resultLayer.selected = true;

        alert("Decagon Pop-Out Composition Created!");

    } catch (err) {
        alert("Error: " + err.toString());
    } finally {
        app.endUndoGroup();
    }

    // --- Helpers ---

    function addDecagonShape(shapeLayer, radius, strokeW, isFill) {
        var vectors = shapeLayer.content.addProperty("ADBE Vector Group").content;
        var star = vectors.addProperty("ADBE Vector Shape - Star");
        star.property("Type").setValue(2); // Polygon
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
        
        // 1. Inset Decagon (Bottom part)
        var poly = vectors.addProperty("ADBE Vector Shape - Star");
        poly.property("Type").setValue(2); // Polygon
        poly.property("Points").setValue(10);
        poly.property("Outer Radius").setValue(frameRadius - (strokeW/2));

        // 2. Top Rectangle (Pop out part)
        var rect = vectors.addProperty("ADBE Vector Shape - Rect");
        var w = frameSize * 1.5;
        var h = frameSize;
        rect.property("Size").setValue([w, h]);
        rect.property("Position").setValue([0, -h * 0.4]);

        // 3. Fill (Union by default)
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

})();
