
(function createDecagonPopOut() {

    // 0. Destination Strategy: First available Composition in Project
    // We will look for this later if no specific destination is found.

    // 1. Setup & Validation
    var subjectSource = null;
    var bgSource = null;
    var destinationComp = null;
    var labelText = "TITLE"; 

    // Validate Source Selection (2 Items from Project Panel)
    var selectedItems = app.project.selection;
    var validFootage = [];

    for (var i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i] instanceof FootageItem || selectedItems[i] instanceof CompItem) {
            validFootage.push(selectedItems[i]);
        }
    }

    if (validFootage.length === 1) {
        // Dialog to ask: Foreground or Background?
        var dlg = new Window("dialog", "Select Source Type");
        dlg.orientation = "column";
        dlg.add("statictext", undefined, "Is this image the Foreground (Subject) or Background?");
        
        var btnGroup = dlg.add("group");
        var btnFg = btnGroup.add("button", undefined, "Foreground");
        var btnBg = btnGroup.add("button", undefined, "Background");
        
        var choice = "fg"; // default
        
        btnFg.onClick = function() {
            choice = "fg";
            dlg.close();
        }
        btnBg.onClick = function() {
            choice = "bg";
            dlg.close();
        }
        
        dlg.center();
        dlg.show();
        
        if (choice === "fg") {
            subjectSource = validFootage[0];
            bgSource = null;
        } else {
            bgSource = validFootage[0];
            subjectSource = null;
        }
        
    } else if (validFootage.length === 2) {
        subjectSource = validFootage[0];
        bgSource = validFootage[1];
    } else if (validFootage.length === 3) {
        // Try to identify destination from selection (optional override)
        var comps = [];
        var footages = [];
        for (var i = 0; i < validFootage.length; i++) {
             if (validFootage[i] instanceof CompItem) comps.push(validFootage[i]);
             else footages.push(validFootage[i]);
        }
        if (comps.length === 1 && footages.length === 2) {
             destinationComp = comps[0]; // Specific override
             subjectSource = footages[0];
             bgSource = footages[1];
        } else {
             alert("Please select exactly 2 Source Images (Subject & BG).");
             return;
        }
    } else {
        alert("Please select 1 or 2 Source Images (Subject & optional BG) in the Project Panel.");
        return;
    }
    
    // Auto-Select Logic: First Composition in Project
    if (!destinationComp) {
        for (var i = 1; i <= app.project.items.length; i++) {
            if (app.project.items[i] instanceof CompItem) {
                destinationComp = app.project.items[i];
                break; // Found the first one
            }
        }
    }

    app.beginUndoGroup("Create Decagon Pop-Out");

    try {
        var baseName;
        if (subjectSource) {
             baseName = subjectSource.name.replace(/\.[^\.]+$/, "");
        } else {
             baseName = bgSource.name.replace(/\.[^\.]+$/, "");
        }
        
        // --- Create Folders ---
        // 1. Root: "Decagon"
        var rootFolder = getOrCreateFolder("Decagon", null);
        // 2. Sub: [Title] (Use baseName for uniqueness and relevance)
        var subFolder = getOrCreateFolder(baseName, rootFolder);

        // --- 1. Create Pre-Compositions ---
        var pcSize = 2000;
        var pcDur = destinationComp ? destinationComp.duration : 10;
        var pcFPS = destinationComp ? destinationComp.frameRate : 30;

        // PC - Subject
        var pcSubject = null;
        if (subjectSource) {
            var pcSubjectName = "PC - Subject - " + baseName;
            pcSubject = app.project.items.addComp(pcSubjectName, pcSize, pcSize, 1, pcDur, pcFPS);
            pcSubject.layers.add(subjectSource); 
            pcSubject.parentFolder = subFolder; // Move to folder
        }

        // PC - Background
        var pcBGName = "PC - BG - " + baseName;
        var pcBG = app.project.items.addComp(pcBGName, pcSize, pcSize, 1, pcDur, pcFPS);
        if (bgSource) {
            pcBG.layers.add(bgSource); 
        } else {
            pcBG.layers.addSolid([1, 1, 1], "White Background", pcSize, pcSize, 1);
        }
        pcBG.parentFolder = subFolder; // Move to folder

        // --- 2. Create Main Wrapper Composition ---
        var newCompName = "USE THIS - " + baseName;
        var newComp = app.project.items.addComp(newCompName, 1200, 1200, 1, pcDur, pcFPS);
        newComp.parentFolder = subFolder; // Move to folder
        newComp.openInViewer(); 

        var centerPos = [newComp.width / 2, newComp.height / 2];
        var frameSize = 724; 
        var frameRadius = frameSize / 2;
        var strokeWidth = 12;

        // --- 3. Add Layers (The Pre-Comps) ---
        var bgLayer = newComp.layers.add(pcBG);          
        var subjectLayer = null;
        if (pcSubject) {
            subjectLayer = newComp.layers.add(pcSubject); 
        } 
        
        // --- Create Shapes ---
        var frameShape = newComp.layers.addShape();
        frameShape.name = "Decagon Frame";
        addDecagonShape(frameShape, frameRadius, strokeWidth, false);
        frameShape.position.setValue(centerPos);

        var bgMatte = newComp.layers.addShape();
        bgMatte.name = "Background Matte";
        addDecagonShape(bgMatte, frameRadius, 0, true);
        bgMatte.position.setValue(centerPos);

        var subjectMatte = null;
        if (subjectSource) {
            subjectMatte = newComp.layers.addShape();
            subjectMatte.name = "Subject Pop-Out Matte";
            addPopOutShape(subjectMatte, frameRadius, strokeWidth, frameSize);
            subjectMatte.position.setValue(centerPos);
        }

        // --- Transforms ---
        // BG Fit (800 target) with Source Scale logic
        var targetBgSize = 800;

        if (bgSource && bgLayer.width > 0) {
            var sW = bgSource.width;
            var sH = bgSource.height;
            var scaleX = (targetBgSize / sW) * 100;
            var scaleY = (targetBgSize / sH) * 100;
            var reqScale = Math.max(scaleX, scaleY);
            bgLayer.property("Scale").setValue([reqScale, reqScale]);
        }
        bgLayer.position.setValue(centerPos);

        // Subject Align (Height 850)
        var subScaleVal = 100;
        if (subjectLayer && subjectSource) {
            var targetSubjectHeight = 850;
            if (subjectLayer.height > 0) {
                var originalH = subjectSource.height; 
                subScaleVal = (targetSubjectHeight / originalH) * 100;
                subjectLayer.property("Scale").setValue([subScaleVal, subScaleVal]);
            }
            
            var frameBottomY = centerPos[1] + frameRadius;
            var originalH = subjectSource.height;
            var sScale = subScaleVal / 100;
            var distToBottom = (originalH / 2) * sScale;
            
            subjectLayer.position.setValue([centerPos[0], frameBottomY - distToBottom]);
        }

        // --- Stacking ---
        bgLayer.moveToBeginning();
        bgMatte.moveToBeginning();
        frameShape.moveToBeginning();
        if (subjectLayer) subjectLayer.moveToBeginning();
        if (subjectMatte) subjectMatte.moveToBeginning();

        // --- Mattes ---
        if (subjectLayer && subjectMatte) safeSetTrackMatte(subjectLayer, subjectMatte);
        safeSetTrackMatte(bgLayer, bgMatte);

        // --- Shadows ---
        addDropShadow(frameShape, { opacity: 125, distance: 0, softness: 20 });
        if (subjectLayer) addDropShadow(subjectLayer, { opacity: 125, distance: 10, softness: 30 });

        // --- 4. Add Text Label ---
        if (labelText && labelText.length > 0) {
            var textLayer = newComp.layers.addText(labelText);
            var textProp = textLayer.property("Source Text");
            var textDoc = textProp.value;
            
            textDoc.font = "MElleHK-Medium"; 
            textDoc.fontSize = 60; 
            textDoc.fillColor = [1, 1, 1]; // White
            textDoc.tracking = 0;
            textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
            textProp.setValue(textDoc);
            
            textLayer.position.setValue([centerPos[0], centerPos[1] + frameRadius]);

            // === Effect Stack ===
            // 1. Shift Channels: Take Alpha From = 9 
            var shift = textLayer.Effects.addProperty("ADBE Shift Channels");
            shift.property("Take Alpha From").setValue(9); 

            // 2. Fill: Black
            var fill = textLayer.Effects.addProperty("ADBE Fill");
            fill.property("Color").setValue([0, 0, 0]);

            // 3. Minimax: Op=2, Chan=2, Rad=24
            var minimax = textLayer.Effects.addProperty("ADBE Minimax");
            minimax.property("Operation").setValue(2); // Maximum 
            minimax.property("Radius").setValue(24); 
            minimax.property("Channel").setValue(2); // Alpha/Color

            // 4. CC Composite
            var composite = textLayer.Effects.addProperty("CC Composite");
            try { composite.property("Composite Original").setValue(1); } catch(e) {}
        }

        // --- Placement (Final Step) ---
        if (destinationComp) {
            var resLayer = destinationComp.layers.add(newComp);
            resLayer.moveToBeginning();
            resLayer.selected = true;
            // Restore context: open the destination (First Comp)
            destinationComp.openInViewer();
        } else {
            // Standalone
        }

    } catch (err) {
        alert("Error: " + err.toString());
    } finally {
        app.endUndoGroup();
    }

    // --- Helpers ---
    function getOrCreateFolder(name, parentFolder) {
        for (var i = 1; i <= app.project.items.length; i++) {
            var item = app.project.items[i];
            if (item instanceof FolderItem && item.name === name) {
                if (parentFolder && item.parentFolder !== parentFolder) continue;
                if (!parentFolder && item.parentFolder !== app.project.rootFolder) continue;
                return item;
            }
        }
        var newFolder = app.project.items.addFolder(name);
        if (parentFolder) newFolder.parentFolder = parentFolder;
        return newFolder;
    }

    function addDecagonShape(shapeLayer, radius, strokeW, isFill) {
        var vectors = shapeLayer.content.addProperty("ADBE Vector Group").content;
        var star = vectors.addProperty("ADBE Vector Shape - Star");
        star.property("Type").setValue(2);
        star.property("Points").setValue(10);
        star.property("Outer Radius").setValue(radius);
        if (isFill) {
            vectors.addProperty("ADBE Vector Graphic - Fill").property("Color").setValue([1, 1, 1]);
        } else {
            var s = vectors.addProperty("ADBE Vector Graphic - Stroke");
            s.property("Color").setValue([0, 0, 0]);
            s.property("Stroke Width").setValue(strokeW);
        }
    }
    function addPopOutShape(shapeLayer, frameRadius, strokeW, frameSize) {
        var vectors = shapeLayer.content.addProperty("ADBE Vector Group").content;
        var poly = vectors.addProperty("ADBE Vector Shape - Star");
        poly.property("Type").setValue(2);
        poly.property("Points").setValue(10);
        poly.property("Outer Radius").setValue(frameRadius - (strokeW/2));
        var rect = vectors.addProperty("ADBE Vector Shape - Rect");
        rect.property("Size").setValue([frameSize * 1.5, frameSize]);
        rect.property("Position").setValue([0, -frameSize * 0.4]);
        vectors.addProperty("ADBE Vector Graphic - Fill").property("Color").setValue([1, 1, 1]);
    }
    function safeSetTrackMatte(layer, matteLayer) {
        if (!layer || !matteLayer) return;
        try {
            if (typeof layer.setTrackMatte === "function") layer.setTrackMatte(matteLayer, TrackMatteType.ALPHA);
            else throw "Legacy";
        } catch (e) {
            if (matteLayer.index !== layer.index - 1) matteLayer.moveBefore(layer);
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
        } catch(e) {}
    }
})();
