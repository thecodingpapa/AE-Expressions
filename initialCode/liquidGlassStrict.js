(function createLiquidGlassStrict() {
    var UNDO_NAME = "Liquid Glass Strict";

    // Matching Names for Effects
    var FX_FAST_BOX_BLUR_Candidates = ["ADBE Box Blur2", "ADBE Mg Fast Box Blur", "ADBE Fast Blur"];
    var FX_DISPLACEMENT_MAP = "ADBE Displacement Map";
    var FX_SET_MATTE_Candidates = ["ADBE Set Matte 3", "ADBE Set Matte 2", "ADBE Set Matte", "Set Matte"];
    var FX_CC_LIGHT_SWEEP = "CC Light Sweep"; // Match name is usually just "CC Light Sweep"

    function safeSetProperty(property, value) {
        if (property && property.canSetExpression) {
            property.setValue(value);
        } else if (property && !property.isTimeVarying) {
            try { property.setValue(value); } catch(e) {}
        }
    }

    function addEffect(layer, matchName) {
        var candidates = [];
        if (matchName === "FAST_BOX_BLUR") {
            candidates = FX_FAST_BOX_BLUR_Candidates;
        } else if (matchName === "SET_MATTE") {
            candidates = FX_SET_MATTE_Candidates;
        } else {
            candidates = [matchName];
        }

        var fx = null;
        for (var i = 0; i < candidates.length; i++) {
            if (layer.Effects.canAddProperty(candidates[i])) {
                fx = layer.Effects.addProperty(candidates[i]);
                break;
            }
        }
        
        // Try fallback if specific candidates failed but generic might work
        if (!fx && candidates.length > 0) {
             try { fx = layer.Effects.addProperty(candidates[0]); } catch(e) {}
        }
        
        return fx;
    }
    
    function setBlurRadius(blurEffect, radius) {
        if (!blurEffect) return;
        var r = blurEffect.property("Blur Radius") || blurEffect.property("Radius") || blurEffect.property("Blurriness");
        safeSetProperty(r, radius);
        
        var it = blurEffect.property("Iterations");
        if (it && it.value < 1) safeSetProperty(it, 3);
    }

    function removeAllEffects(layer) {
        while (layer.Effects.numProperties > 0) {
            layer.Effects.property(1).remove();
        }
    }

    function applyBevelAndEmboss(layer, bevelStyle) {
        if (!layer) return;
        var comp = layer.containingComp;
        
        // Default to Outer Bevel (2) if not specified
        if (bevelStyle === undefined) bevelStyle = 2;
        
        // Toggle selection to force menu command target
        for (var i = 1; i <= comp.numLayers; i++) comp.layer(i).selected = false;
        layer.selected = true;
        
        var cmdId = app.findMenuCommandId("Bevel and Emboss");
        if (cmdId) app.executeCommand(cmdId);

        var styles = layer.property("ADBE Layer Styles");
        if (styles) {

            var bevel = styles.property("bevelEmboss/enabled");
            if (bevel) {
                // Set bevel style
                safeSetProperty(bevel.property("bevelEmboss/bevelStyle"), bevelStyle);
                // Highlight/Shadow 100%
                safeSetProperty(bevel.property("bevelEmboss/highlightOpacity"), 100);
                safeSetProperty(bevel.property("bevelEmboss/shadowOpacity"), 100);
                // Shadow Color: White
                safeSetProperty(bevel.property("bevelEmboss/shadowColor"), [1, 1, 1]);
            }

            // Fill Opacity 0% (must access through Blend Options Group)
            var blendOpts = styles.property("ADBE Blend Options Group").property("ADBE Adv Blend Group");
            if (blendOpts) {
                safeSetProperty(blendOpts.property("ADBE Layer Fill Opacity2"), 0);
            }
        }
        layer.selected = false;
    }

    function removeLayerStyles(layer) {
        if (!layer) return;
        var styles = layer.property("ADBE Layer Styles");
        if (styles) {
            try { styles.enabled = false; } catch(e) {}
            try { styles.remove(); } catch(e) {} // Try removing the group entirely if possible
        }
    }

    app.beginUndoGroup(UNDO_NAME);

    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            comp = app.project.items.addComp("Liquid Glass Comp", 1920, 1080, 1, 10, 30);
            comp.openInViewer();
        }

        // ==========================================
        // 0. Control Null Setup
        // ==========================================
        
        var controlNull = comp.layers.addNull();
        
        // Add slider controls
        var widthSlider = controlNull.Effects.addProperty("ADBE Slider Control");
        widthSlider.name = "Width";
        widthSlider.property("Slider").setValue(comp.width * 0.4);
        
        var heightSlider = controlNull.Effects.addProperty("ADBE Slider Control");
        heightSlider.name = "Height";
        heightSlider.property("Slider").setValue(comp.height * 0.4);
        
        var roundSlider = controlNull.Effects.addProperty("ADBE Slider Control");
        roundSlider.name = "Roundness";
        roundSlider.property("Slider").setValue(60);
        
        // Set name AFTER adding effects to ensure it sticks
        controlNull.name = "Size Control";

        // ==========================================
        // 1. Shape and Distortion Setup
        // ==========================================

        // --- Base Shape ---
        var mainGraphic = comp.layers.addShape();
        mainGraphic.name = "Main Graphic";
        
        var shapeGroup = mainGraphic.content.addProperty("ADBE Vector Group");
        var rect = shapeGroup.content.addProperty("ADBE Vector Shape - Rect");
        
        // Add expressions to link to control null
        var sizeExpr = 'var ctrl = thisComp.layer("Size Control");\n';
        sizeExpr += '[ctrl.effect("Width")("Slider"), ctrl.effect("Height")("Slider")]';
        rect.property("Size").expression = sizeExpr;
        
        var roundExpr = 'thisComp.layer("Size Control").effect("Roundness")("Slider")';
        rect.property("Roundness").expression = roundExpr;
                
        var fill = shapeGroup.content.addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue([1, 1, 1]); 
        
        var stroke = shapeGroup.content.addProperty("ADBE Vector Graphic - Stroke");
        stroke.property("Color").setValue([1, 1, 1]); 
        stroke.enabled = false; 
        
        removeLayerStyles(mainGraphic);
        
        var blur1 = addEffect(mainGraphic, "FAST_BOX_BLUR");
        setBlurRadius(blur1, 5);


        // --- Displacement Map Layer ("Map") ---
        var mapLayer = mainGraphic.duplicate();
        mapLayer.moveAfter(mainGraphic); 
        mapLayer.name = "Map";
        
        var mapFill = mapLayer.content.property("ADBE Vector Group").content.property("ADBE Vector Graphic - Fill");
        mapFill.enabled = false;
        
        var mapStroke = mapLayer.content.property("ADBE Vector Group").content.property("ADBE Vector Graphic - Stroke");
        mapStroke.enabled = true; 
        safeSetProperty(mapStroke.property("Stroke Width"), 50);
        
        // Update existing blur (radius 5 -> 20)
        var mapBlur = mapLayer.Effects.property(1); 
        if (mapBlur) setBlurRadius(mapBlur, 20);
        
        mapLayer.enabled = false;


        // --- Applying the Distortion ---
        mainGraphic.adjustmentLayer = true;
        
        var dispMap = addEffect(mainGraphic, FX_DISPLACEMENT_MAP);
        safeSetProperty(dispMap.property("Displacement Map Layer"), mapLayer.index);
        
        // Try to set Source to "Effects & Masks" (Value 3 in many versions, or Property Index 31 in newer API)
        // Standard "Displacement Map Behavior" dropdown: 1=Center Map, 2=Stretch Map, etc... 
        // This is tricky via script. We attempt to set the "Displacement Map Behavior" property if it exists.
        var behaviorProp = dispMap.property("Displacement Map Behavior");
        if (behaviorProp) safeSetProperty(behaviorProp, 2); // Stretch Map to Fit is usually good practice
        
        // NOTE: Setting "Source" (Source/Masks/Effects) is not standard accessible via simple setValue(index) on the Layer property in all AE versions.
        // It defaults to "Source". User might need to toggle this manually to "Effects & Masks" if the script fails here.
        
        safeSetProperty(dispMap.property("Max Horizontal Displacement"), 300);
        safeSetProperty(dispMap.property("Max Vertical Displacement"), 300);


        // ==========================================
        // 2. Edge Definition
        // ==========================================

        // --- Outer Edge (Soft) ("Stroke") ---
        var strokeLayer = mainGraphic.duplicate();
        strokeLayer.name = "Stroke";
        
        var strokeFill = strokeLayer.content.property("ADBE Vector Group").content.property("ADBE Vector Graphic - Fill");
        strokeFill.enabled = false;
        
        var strokeStroke = strokeLayer.content.property("ADBE Vector Group").content.property("ADBE Vector Graphic - Stroke");
        strokeStroke.enabled = true;
        safeSetProperty(strokeStroke.property("Stroke Width"), 2);
        
        // Update Blur 5 -> 30
        var strokeBlur = strokeLayer.Effects.property(1);
        if (strokeBlur) setBlurRadius(strokeBlur, 30);


        // --- Defined Highlight Edge (Hard) ("Edge") ---
        var edgeLayer = strokeLayer.duplicate();
        edgeLayer.name = "Edge";
        
        removeAllEffects(edgeLayer);
        edgeLayer.adjustmentLayer = false;
        
        var edgeStroke = edgeLayer.content.property("ADBE Vector Group").content.property("ADBE Vector Graphic - Stroke");
        safeSetProperty(edgeStroke.property("Stroke Width"), 10);
        
        var edgeBlur = addEffect(edgeLayer, "FAST_BOX_BLUR");
        setBlurRadius(edgeBlur, 4);
        
        var setMatte = addEffect(edgeLayer, "SET_MATTE");
        if (setMatte) safeSetProperty(setMatte.property("Take Matte From Layer"), mainGraphic.index);
        
        safeSetProperty(edgeLayer.transform.opacity, 40);


        // --- Subtle Edge (Glow) ("Light Edge") ---
        var lightEdgeLayer = edgeLayer.duplicate();
        lightEdgeLayer.name = "Light Edge";
        
        var lightEdgeBlur = lightEdgeLayer.Effects.property(1); // The Blur we just added
        if(lightEdgeBlur) setBlurRadius(lightEdgeBlur, 40);
        
        safeSetProperty(lightEdgeLayer.transform.opacity, 40);

        // ==========================================
        // 3. Outside
        // ==========================================
        
        var outsideLayer = lightEdgeLayer.duplicate();
        outsideLayer.name = "Outside"; 
        
        removeAllEffects(outsideLayer);
        
        var outsideStroke = outsideLayer.content.property("ADBE Vector Group").content.property("ADBE Vector Graphic - Stroke");
        if(outsideStroke) outsideStroke.enabled = false;
        
        var outsideFill = outsideLayer.content.property("ADBE Vector Group").content.property("ADBE Vector Graphic - Fill");
        if(outsideFill) outsideFill.enabled = true;
        
        applyBevelAndEmboss(outsideLayer, 1); // Outer Bevel


        // ==========================================
        // 4. Bevel and Light Sweep
        // ==========================================

        // --- Bevel Highlights ---
        var bevelMain = mainGraphic.duplicate();
        bevelMain.name = "Bevel Highlights";
        
        removeAllEffects(bevelMain);
        bevelMain.adjustmentLayer = false; 
        
        var bmStroke = bevelMain.content.property("ADBE Vector Group").content.property("ADBE Vector Graphic - Stroke");
        if(bmStroke) bmStroke.enabled = false;
        
        var bmFill = bevelMain.content.property("ADBE Vector Group").content.property("ADBE Vector Graphic - Fill");
        if(bmFill) bmFill.enabled = true;
        
        applyBevelAndEmboss(bevelMain, 2); // Outer Bevel
        
        


        // ==========================================
        // 5. Final Parenting
        // ==========================================
        
        var children = [mapLayer, strokeLayer, edgeLayer, lightEdgeLayer, outsideLayer, bevelMain];
        
        for (var i = 0; i < children.length; i++) {
            if (children[i]) children[i].parent = mainGraphic;
        }
        
        // Parent Main Graphic to control null for position control
        mainGraphic.parent = controlNull;

    } catch (e) {
        alert("Error: " + e.toString() + " on line " + e.line);
    } finally {
        app.endUndoGroup();
    }
})();