// After Effects Script - Paper Unfold Effect
// Automates the creation of a paper unfold effect with logo integration

function createPaperUnfoldEffect() {
    var comp = app.project.activeItem;

    // Try to use opened composition in the active viewer if activeItem isn't a CompItem
    if (!(comp instanceof CompItem) && app.activeViewer && app.activeViewer.typeName === "Composition") {
        var avItem = app.activeViewer.activeItem;
        if (avItem instanceof CompItem) comp = avItem;
    }

    if (!(comp instanceof CompItem)) {
        alert("Open a composition in the Composition Viewer.");
        return;
    }

    // No size restriction (non-blocking info only)
    if (comp.width !== 1920 || comp.height !== 1080) {
        // $.writeln("Info: Designed for 1920x1080; current: " + comp.width + "x" + comp.height);
    }

    app.beginUndoGroup("Create Paper Unfold Effect");
    
    try {
        // Step 1: Create or find the 'folding anim' composition
        var foldingAnimComp = createFoldingAnimComposition();
        var selectedImage = getSelectedImageLayer();
        
        if (!foldingAnimComp) {
            alert("Failed to create 'folding anim' composition. Please make sure 'Paper Crumple Effect.mp4' and 'Paper Unfold.png' are imported in your project.");
            app.endUndoGroup();
            return;
        }
        
        if (!selectedImage) {
            alert("Please select an image layer to use as the source.");
            app.endUndoGroup();
            return;
        }
        
        if (!selectedImage.source) {
            alert("Selected layer does not have a valid source. Please select a layer with footage/image.");
            app.endUndoGroup();
            return;
        }
        
        // Step 2: Setup the source image
        setupSourceImage(selectedImage, comp);
        
        // Step 3: Add paper unfold footage
        var paperUnfoldLayer;
        try {
            paperUnfoldLayer = comp.layers.add(foldingAnimComp);
            paperUnfoldLayer.name = "Paper Unfold";
        } catch (e) {
            alert("Error adding 'folding anim' composition to timeline: " + e.toString());
            app.endUndoGroup();
            return;
        }
        
        // Step 5: Create logo precomposition
        var logoPrecomp;
        try {
            logoPrecomp = createLogoPrecomposition(selectedImage, comp);
            if (!logoPrecomp) {
                alert("Failed to create logo precomposition");
                app.endUndoGroup();
                return;
            }
        } catch (e) {
            alert("Error creating logo precomposition: " + e.toString());
            app.endUndoGroup();
            return;
        }
        
        // Step 6: Setup the effect layers
        var result = setupPaperUnfoldEffect(comp, paperUnfoldLayer, logoPrecomp);

        // === Final precomp: combine top Paper + middle Paper (disabled) + bottom Logo ===
        var finalName = baseNameFromFootage(selectedImage.source);

        // Collect indices (order matters) — top, middle, bottom
        var idxTop = result.paperLayerTop.index;
        var idxMid = result.paperLayerMiddle.index;
        var idxLogo = result.logoLayerBottom.index;

        var finalComp = comp.layers.precompose([idxTop, idxMid, idxLogo], finalName, true); // returns CompItem

        // === Foldering: /Paper Unfold/[Image source name]/ ===
        var rootFolder = ensureFolder("Paper Unfold", app.project.rootFolder);
        var targetFolder = ensureFolder(finalName, rootFolder);

        // Move generated comps into target folder
        try { result.paperComp.parentFolder = targetFolder; } catch(_) {}
        try { result.logoComp.parentFolder = targetFolder; } catch(_) {}
        try { finalComp.parentFolder = targetFolder; } catch(_) {}

        // Remove the original source image layer since we've used it in the precomps
        try {
            selectedImage.remove();
        } catch (e) {
            // If removal fails, just continue - the effect is still created
        }

        alert("Paper unfold effect created successfully! Final precomp: " + finalName);
        
    } catch (error) {
        alert("Error creating paper unfold effect: " + error.toString());
    }
    
    app.endUndoGroup();
}

function findItemByName(name) {
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i).name === name) {
            return app.project.item(i);
        }
    }
    return null;
}

function createFoldingAnimComposition() {
    try {
        // Check if 'folding anim' composition already exists
        var existingComp = findItemByName("folding anim");
        if (existingComp && existingComp instanceof CompItem) {
            return existingComp;
        }
        
        // Find required footage item
        var paperCrumpleVideo = findItemByName("Paper Crumple Effect.mp4");
        
        if (!paperCrumpleVideo) {
            alert("Could not find 'Paper Crumple Effect.mp4' in the project. Please import it first.");
            return null;
        }
        
        // Get main composition for duration and settings
        var mainComp = app.project.activeItem;
        if (!(mainComp instanceof CompItem)) {
            alert("No active composition found for duration reference.");
            return null;
        }
        
        // Use main composition duration and settings
        var compDuration = mainComp.duration;
        var compWidth = mainComp.width;
        var compHeight = mainComp.height;
        var frameRate = mainComp.frameRate;
        var videoDuration = paperCrumpleVideo.duration || 10; // fallback to 10 seconds
        
        // Create the 'folding anim' composition with same duration as main comp
        var foldingComp = app.project.items.addComp("folding anim", compWidth, compHeight, 1, compDuration, frameRate);
        
        // Add the video layer first (it will play from start for its full duration)
        var videoLayer = foldingComp.layers.add(paperCrumpleVideo);
        videoLayer.name = "Paper Crumple Effect";
        
        // Create freeze frame layers to fill the remaining composition duration
        if (compDuration > videoDuration) {
            var currentTime = videoDuration;
            var copyIndex = 1;
            
            while (currentTime < compDuration) {
                // Add a freeze frame copy
                var freezeFrameCopy = foldingComp.layers.add(paperCrumpleVideo);
                freezeFrameCopy.name = "Freeze Frame " + copyIndex;
                
                // Set start time for this freeze frame
                freezeFrameCopy.startTime = currentTime;
                
                // Calculate end time (either video duration later or composition end, whichever is shorter)
                var copyEndTime = Math.min(currentTime + videoDuration, compDuration);
                freezeFrameCopy.outPoint = copyEndTime;
                
                // Enable time remapping to show only the last frame
                freezeFrameCopy.timeRemapEnabled = true;
                var lastFrameTime = videoDuration - (1 / frameRate);
                var timeRemapProp = freezeFrameCopy.property("Time Remap");
                
                // Set both keyframes to the last frame time
                timeRemapProp.setValueAtTime(currentTime, lastFrameTime);
                timeRemapProp.setValueAtTime(copyEndTime, lastFrameTime);
                
                // Set to hold interpolation
                if (timeRemapProp.numKeys >= 2) {
                    timeRemapProp.setInterpolationTypeAtKey(1, KeyframeInterpolationType.HOLD);
                }
                
                // Scale this freeze frame to fit composition
                scaleLayerToFitComp(freezeFrameCopy, foldingComp);
                
                // Move to next position
                currentTime += videoDuration;
                copyIndex++;
                
                // Safety break to prevent infinite loops
                if (copyIndex > 100) {
                    alert("Warning: Stopped creating freeze frames after 100 copies to prevent infinite loop.");
                    break;
                }
            }
        }
        
        // Scale the main video layer to fit composition
        scaleLayerToFitComp(videoLayer, foldingComp);
        
        return foldingComp;
        
    } catch (e) {
        alert("Error creating 'folding anim' composition: " + e.toString());
        return null;
    }
}

function scaleLayerToFitComp(layer, comp) {
    try {
        if (!layer.source) return;
        
        var sourceWidth = layer.source.width;
        var sourceHeight = layer.source.height;
        
        if (sourceWidth && sourceHeight) {
            // Calculate scale to fit composition while maintaining aspect ratio
            var scaleX = (comp.width / sourceWidth) * 100;
            var scaleY = (comp.height / sourceHeight) * 100;
            var finalScale = Math.min(scaleX, scaleY);
            
            // Apply scale
            layer.property("Transform").property("Scale").setValue([finalScale, finalScale]);
            
            // Center the layer
            layer.property("Transform").property("Position").setValue([comp.width/2, comp.height/2]);
            
            // Center anchor point
            layer.property("Transform").property("Anchor Point").setValue([sourceWidth/2, sourceHeight/2]);
        }
    } catch (e) {
        // If scaling fails, continue without scaling
    }
}

function getSelectedImageLayer() {
    var comp = app.project.activeItem;
    if (comp && comp.selectedLayers && comp.selectedLayers.length > 0) {
        var selectedLayer = comp.selectedLayers[0];
        // Check if it's an AVLayer with a valid source
        if (selectedLayer instanceof AVLayer && selectedLayer.source) {
            // Additional check to ensure it's an image or footage item
            if (selectedLayer.source instanceof FootageItem || selectedLayer.source instanceof CompItem) {
                return selectedLayer;
            }
        }
    }
    
    // If no valid selection, try to find any image layer in the comp
    if (comp && comp.numLayers > 0) {
        for (var i = 1; i <= comp.numLayers; i++) {
            var layer = comp.layer(i);
            if (layer instanceof AVLayer && layer.source && layer.source instanceof FootageItem) {
                alert("No layer selected. Using layer: " + layer.name);
                return layer;
            }
        }
    }
    
    return null;
}

function setupSourceImage(imageLayer, comp) {
    // Fit image to composition dimensions with 20% padding on each side
    var paddingPercent = 0.2; // 20% padding
    var targetWidth = comp.width * (1 - paddingPercent * 2);
    var targetHeight = comp.height * (1 - paddingPercent * 2);
    
    // Get source dimensions
    var source = imageLayer.source;
    var sourceWidth = source.width;
    var sourceHeight = source.height;
    
    // Calculate scale to fit within composition bounds
    var scaleX = (targetWidth / sourceWidth) * 100;
    var scaleY = (targetHeight / sourceHeight) * 100;
    var scale = Math.min(scaleX, scaleY); // Use smaller scale to maintain aspect ratio
    
    // Apply scale
    imageLayer.property("Scale").setValue([scale, scale]);
    
    // Center position
    var centerX = comp.width / 2;
    var centerY = comp.height / 2;
    imageLayer.property("Position").setValue([centerX, centerY]);
    
    // Center anchor point using source dimensions (works for footage/comp)
    var anchorX = sourceWidth / 2;
    var anchorY = sourceHeight / 2;
    imageLayer.property("Anchor Point").setValue([anchorX, anchorY]);
}

function removeGreenScreen(layer, keyColor) {
    return addKeylightOrFallback(layer, keyColor);
}

function addKeylightOrFallback(layer, hex) {
    function hexToRGB01(h){
        h=h.replace("#",""); return [
            parseInt(h.substr(0,2),16)/255,
            parseInt(h.substr(2,2),16)/255,
            parseInt(h.substr(4,2),16)/255
        ];
    }

    var fx;
    try {
        fx = layer.property("Effects").addProperty("Keylight 906"); // Keylight (1.2)
    } catch(e) {
        try { 
            fx = layer.property("Effects").addProperty("ADBE Linear Color Key2"); 
        } catch(e2) { 
            try {
                fx = layer.property("Effects").addProperty("ADBE Color Key"); 
            } catch(e3) {
                alert("Could not add keying effect. Please manually add Keylight effect and set key color to " + hex);
                return null;
            }
        }
    }
    if (!fx) return null;

    var keyProp = fx.property("Screen Colour") || fx.property("Screen Color") ||
                  fx.property("Key Color")     || fx.property("Color to Key");
    if (keyProp) keyProp.setValue(hexToRGB01(hex));
    
    try {
        if (fx.property("Screen Gain")) {
            fx.property("Screen Gain").setValue(100);
        }
        if (fx.property("Screen Balance")) {
            fx.property("Screen Balance").setValue(95);
        }
    } catch (e) {}
    
    return fx;
}

// Keep the old function for backward compatibility if needed elsewhere
function hexToRGB(hex) {
    // Convert hex color to RGB array (0-1 range)
    hex = hex.replace("#", "");
    var r = parseInt(hex.substring(0, 2), 16) / 255;
    var g = parseInt(hex.substring(2, 4), 16) / 255;
    var b = parseInt(hex.substring(4, 6), 16) / 255;
    return [r, g, b];
}

function createLogoPrecomposition(logoLayer, mainComp) {
    // Validate inputs
    if (!logoLayer || !logoLayer.source) {
        alert("Invalid logo layer provided to createLogoPrecomposition");
        return null;
    }
    
    if (!mainComp) {
        alert("Invalid main composition provided to createLogoPrecomposition");
        return null;
    }
    
    try {
        // Create new composition for logo
        var logoComp = app.project.items.addComp("Logo", mainComp.width, mainComp.height, mainComp.pixelAspect, mainComp.duration, mainComp.frameRate);
        
        // Add the logo source to the new composition
        var newLogoLayer = logoComp.layers.add(logoLayer.source);
        
        if (newLogoLayer) {
            // Copy basic transform properties from original layer
            try {
                newLogoLayer.property("Position").setValue(logoLayer.property("Position").value);
                newLogoLayer.property("Scale").setValue(logoLayer.property("Scale").value);
                newLogoLayer.property("Anchor Point").setValue(logoLayer.property("Anchor Point").value);
                newLogoLayer.property("Rotation").setValue(logoLayer.property("Rotation").value);
                newLogoLayer.property("Opacity").setValue(logoLayer.property("Opacity").value);
            } catch (e) {
                // If copying properties fails, continue with default values
                alert("Warning: Could not copy all properties from original layer");
            }
        }
        
        return logoComp;
        
    } catch (e) {
        alert("Error in createLogoPrecomposition: " + e.toString());
        return null;
    }
}

function ensureFolder(name, parent) {
    var folder = null;
    for (var i = 1; i <= app.project.numItems; i++) {
        var it = app.project.item(i);
        if (it instanceof FolderItem && it.name === name && (!parent || it.parentFolder === parent)) {
            folder = it; break;
        }
    }
    if (!folder) {
        folder = app.project.items.addFolder(name);
        if (parent) folder.parentFolder = parent;
    }
    return folder;
}

function baseNameFromFootage(item) {
    var n = (item && item.name) ? item.name : "Image";
    var dot = n.lastIndexOf(".");
    if (dot > 0) n = n.substring(0, dot);
    return n;
}

function setupPaperUnfoldEffect(comp, paperLayer, logoComp) {
    try {
        // === Step A: Add Logo above Paper and set matte ===
        var logoLayer = comp.layers.add(logoComp);
        logoLayer.name = "Logo";
        logoLayer.moveBefore(paperLayer); // matte must be directly above the matted layer
        // Paper (folding anim) uses Logo as alpha matte
        paperLayer.trackMatteType = TrackMatteType.ALPHA;

        // === Step B: Precompose into "Paper" (contains Logo + folding anim) ===
        var paperComp = comp.layers.precompose([logoLayer.index, paperLayer.index], "Paper", true); // returns CompItem

        // Find the new Paper layer in the main comp
        var paperLayerInMain = null;
        for (var i = 1; i <= comp.numLayers; i++) {
            var ly = comp.layer(i);
            if (ly instanceof AVLayer && ly.source === paperComp) { paperLayerInMain = ly; break; }
        }
        if (!paperLayerInMain) throw new Error("Failed to find 'Paper' layer in main comp after precompose.");
        paperLayerInMain.name = "Paper"; // middle (will be view-unchecked)

        // === Inside 'Paper' comp: Logo (view off) + folding anim (matte Logo + Keylight 096FFF) ===
        var logoInside = null;
        var foldInside = null;
        for (var j = 1; j <= paperComp.numLayers; j++) {
            var l = paperComp.layer(j);
            if (l instanceof AVLayer) {
                if (l.source === logoComp || l.name === "Logo") logoInside = l;
                if (l.name === "folding anim" || (l.source && l.source.name === "folding anim")) foldInside = l;
            }
        }
        if (!logoInside || !foldInside) throw new Error("Could not find Logo and/or 'folding anim' layers inside 'Paper'.");

        // Order: 1) Logo (top), 2) folding anim (below)
        logoInside.moveToBeginning();
        foldInside.moveAfter(logoInside);

        // Logo inside 'Paper' must be view unchecked
        logoInside.enabled = false;

        // folding anim uses Logo as alpha matte
        foldInside.trackMatteType = TrackMatteType.ALPHA;

        // Keylight 096FFF on folding anim inside 'Paper'
        removeGreenScreen(foldInside, "#096FFF");

        // === Back in main comp: create top 'Paper' and bottom 'Logo' ===
        paperLayerInMain.enabled = false; // middle: view unchecked

        var paperCopyTop = comp.layers.add(paperComp);
        paperCopyTop.name = "Paper";
        paperCopyTop.moveToBeginning();
        removeGreenScreen(paperCopyTop, "#4FDA65"); // top Paper keyed 4FDA65

        var logoBottom = comp.layers.add(logoComp);
        logoBottom.name = "Logo";
        logoBottom.moveToEnd();

        // Matte relationship: Logo (bottom) uses the Paper directly above (middle)
        paperLayerInMain.moveBefore(logoBottom);
        logoBottom.trackMatteType = TrackMatteType.ALPHA;

        // Return handles so caller can precompose & folder
        return {
            paperComp: paperComp,                // CompItem
            logoComp: logoComp,                  // CompItem
            paperLayerMiddle: paperLayerInMain,  // Layer (disabled)
            paperLayerTop: paperCopyTop,         // Layer (keyed 4FDA65)
            logoLayerBottom: logoBottom          // Layer (matted to middle)
        };

    } catch (e) {
        alert("Error in setupPaperUnfoldEffect: " + e.toString());
        throw e;
    }
}

// UI Dialog for additional options
function showPaperUnfoldDialog() {
    var dialog = new Window("dialog", "Paper Unfold Effect Setup");
    dialog.orientation = "column";
    dialog.alignChildren = "fill";
    dialog.preferredSize.width = 350;
    
    // Key colors group
    var keyGroup = dialog.add("group");
    keyGroup.orientation = "column";
    keyGroup.alignChildren = "fill";
    keyGroup.add("statictext", undefined, "Key Colors (Hex):");
    
    var color1Group = keyGroup.add("group");
    color1Group.add("statictext", undefined, "Color 1:");
    var color1Input = color1Group.add("edittext", undefined, "#4FDA65");
    color1Input.characters = 8;
    
    var color2Group = keyGroup.add("group");
    color2Group.add("statictext", undefined, "Color 2:");
    var color2Input = color2Group.add("edittext", undefined, "#096FFF");
    color2Input.characters = 8;
    
    // Buttons
    var buttonGroup = dialog.add("group");
    buttonGroup.alignment = "center";
    var okButton = buttonGroup.add("button", undefined, "Create Effect");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    
    okButton.onClick = function() {
        dialog.close(1);
    };
    
    cancelButton.onClick = function() {
        dialog.close(0);
    };
    
    if (dialog.show() === 1) {
        return {
            color1: color1Input.text,
            color2: color2Input.text
        };
    }
    
    return null;
}

// Enhanced version with dialog
function createPaperUnfoldEffectWithOptions() {
    var options = showPaperUnfoldDialog();
    if (!options) return;
    
    // Store colors for use in the main function
    window.keyColor1 = options.color1;
    window.keyColor2 = options.color2;
    
    createPaperUnfoldEffect();
}

// Main execution with debug info
function debugPaperUnfoldEffect() {
    var comp = app.project.activeItem;
    
    // Validate composition
    if (!(comp instanceof CompItem)) {
        alert("Please select a composition first.");
        return;
    }
    
    alert("Debug: Found active composition - " + comp.name);
    
    // Find folding anim
    var foldingAnimComp = findItemByName("folding anim");
    if (!foldingAnimComp) {
        alert("Debug: Could not find 'folding anim' composition");
        return;
    }
    alert("Debug: Found 'folding anim' composition");
    
    // Find selected image
    var selectedImage = getSelectedImageLayer();
    if (!selectedImage) {
        alert("Debug: Could not find valid selected image layer");
        return;
    }
    alert("Debug: Found selected image layer - " + selectedImage.name);
    
    // Try the main function
    createPaperUnfoldEffect();
}

// Main execution
createPaperUnfoldEffect();
