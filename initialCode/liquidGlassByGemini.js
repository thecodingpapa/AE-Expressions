(function() {
    var SCRIPT_NAME = "Liquid Glass Setup";
    app.beginUndoGroup(SCRIPT_NAME);

    // Helper to log steps for debugging
    var currentStep = "Start";
    
    // Helper: Safe Property Set
    function safeSet(prop, value) {
        if (prop && prop.canSetExpression) prop.setValue(value);
        else if (prop) prop.setValue(value);
    }

    // Helper: Remove all effects from a layer
    function removeAllEffects(layer) {
        var effects = layer.property("Effects");
        if (effects) {
            for (var i = effects.numProperties; i >= 1; i--) {
                effects.property(i).remove();
            }
        }
    }

    // Helper: Toggle Shape Fill/Stroke
    function setShapeStyle(layer, fillOn, strokeWidth) {
        if (!(layer instanceof ShapeLayer)) return;
        var contents = layer.property("Contents");
        if (contents.numProperties > 0) {
            // Assuming standard "Rectangle" group structure created by this script
            // If duplicated, structure persists.
            // Try to find the Vector Group (usually index 1)
            var group = contents.property(1); 
            if (group && group.matchName === "ADBE Vector Group") contents = group.property("Contents");
            
            var fill = contents.property("ADBE Vector Graphic - Fill");
            if (fill) fill.enabled = fillOn;
            
            var stroke = contents.property("ADBE Vector Graphic - Stroke");
            if (!stroke && strokeWidth > 0) {
                stroke = contents.addProperty("ADBE Vector Graphic - Stroke");
                stroke.property("Color").setValue([1,1,1]);
            }
            if (stroke) {
                stroke.enabled = (strokeWidth > 0);
                if (strokeWidth > 0) stroke.property("Stroke Width").setValue(strokeWidth);
            }
        }
    }

    // Helper: Safe Add Layer Style
    function addLayerStyle(layer, styleMatchName) {
        var styles = layer.property("ADBE Layer Styles");
        if (!styles) return null;
        
        // Try to find it first
        var styleProp = styles.property(styleMatchName);
        
        // If not found, try to add it
        if (!styleProp && styles.canAddProperty(styleMatchName)) {
            try {
                styleProp = styles.addProperty(styleMatchName);
            } catch(e) {
                // Ignore
            }
        }
        
        if (styleProp) styleProp.enabled = true;
        return styleProp;
    }

    try {
        // --- 1. Shape and Distortion Setup ---
        currentStep = "Composition Setup";
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            comp = app.project.items.addComp("Liquid Glass Comp", 1920, 1080, 1, 10, 30);
            comp.openInViewer();
        }

        currentStep = "Creating Main Graphic";
        // Create a rounded rectangle shape layer
        var mainLayer = comp.layers.addShape();
        mainLayer.name = "Main Graphic";
        
        // Add Shape Group
        var shapeGroup = mainLayer.property("Contents").addProperty("ADBE Vector Group");
        shapeGroup.name = "Rectangle";
        var vectorShape = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
        vectorShape.property("Size").setValue([500, 500]);
        vectorShape.property("Roundness").setValue(40);
        
        // Add Fill (White)
        var rectFill = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        rectFill.name = "Fill";
        rectFill.property("Color").setValue([1, 1, 1]);

        // Main Graphic: Fast Box Blur 5
        var blurMain = mainLayer.property("Effects").addProperty("ADBE Box Blur2");
        blurMain.name = "Fast Box Blur";
        blurMain.property("Blur Radius").setValue(5);
        blurMain.property("Iterations").setValue(3);

        // --- Displacement Map Layer ("Map") ---
        currentStep = "Creating Map Layer";
        var mapLayer = mainLayer.duplicate();
        mapLayer.name = "Map";
        mapLayer.moveAfter(mainLayer); // Below Main
        mapLayer.adjustmentLayer = false; // Just in case
        
        // Map Settings: Fill Off. Stroke 50.
        setShapeStyle(mapLayer, false, 50); // Fill Off, Stroke 50
        
        // Map Blur: 20
        var mapBlur = mapLayer.property("Effects").property("Fast Box Blur");
        mapBlur.property("Blur Radius").setValue(20);
        
        // Hide Map
        mapLayer.enabled = false;

        // --- Applying Distortion to Main Graphic ---
        currentStep = "Applying Distortion";
        mainLayer.adjustmentLayer = true;
        
        var dispEffect = mainLayer.property("Effects").addProperty("ADBE Displacement Map");
        // Layer: Map
        dispEffect.property("Displacement Map Layer").setValue(mapLayer.index);
        // Source: Effects & Masks (Heuristic check)
        dispEffect.property("Max Horizontal Displacement").setValue(300);
        dispEffect.property("Max Vertical Displacement").setValue(300);

        // --- 2. Edge Definition ---
        
        // -- Outer Edge ("Stroke") --
        currentStep = "Creating Stroke Layer";
        var strokeLayer = mainLayer.duplicate();
        strokeLayer.name = "Stroke";
        strokeLayer.moveBefore(mainLayer); 
        strokeLayer.adjustmentLayer = false;
        
        // Stroke Settings: Fill Off, Stroke 2
        setShapeStyle(strokeLayer, false, 2);
        
        // Update Blur to 30
        var strokeBlur = strokeLayer.property("Effects").property("Fast Box Blur");
        if (strokeBlur) strokeBlur.property("Blur Radius").setValue(30);
        else {
             strokeBlur = strokeLayer.property("Effects").addProperty("ADBE Box Blur2");
             strokeBlur.property("Blur Radius").setValue(30);
        }

        // -- Defined Highlight ("Edge") --
        currentStep = "Creating Edge Layer";
        var edgeLayer = strokeLayer.duplicate();
        edgeLayer.name = "Edge";
        edgeLayer.moveBefore(strokeLayer); // Above
        
        // "Delete all effects and turn off the Adjustment Layer switch."
        edgeLayer.adjustmentLayer = false;
        removeAllEffects(edgeLayer);
        
        // Stroke: 10
        setShapeStyle(edgeLayer, false, 10);
        
        // Fast Box Blur: 4
        var edgeBlur = edgeLayer.property("Effects").addProperty("ADBE Box Blur2");
        edgeBlur.name = "Fast Box Blur";
        edgeBlur.property("Blur Radius").setValue(4);
        
        // Set Matte: Take from "Main Graphic"
        var setMatte = edgeLayer.property("Effects").addProperty("ADBE Set Matte3");
        if (!setMatte) setMatte = edgeLayer.property("Effects").addProperty("ADBE Set Matte");
        
        if (setMatte) {
            setMatte.property("Take Matte From Layer").setValue(mainLayer.index);
        }
        
        // Opacity: 40%
        edgeLayer.property("Transform").property("Opacity").setValue(40);

        // -- Subtle Edge ("Light Edge") --
        currentStep = "Creating Light Edge Layer";
        var lightEdgeLayer = edgeLayer.duplicate();
        lightEdgeLayer.name = "Light Edge";
        lightEdgeLayer.moveBefore(edgeLayer);
        
        // Fast Box Blur: Increase to 40
        var lightEdgeBlur = lightEdgeLayer.property("Effects").property("Fast Box Blur");
        if (lightEdgeBlur) lightEdgeBlur.property("Blur Radius").setValue(40);
        
        // Opacity: 100%
        lightEdgeLayer.property("Transform").property("Opacity").setValue(100);

        // --- 3. Outside Layer ---
        currentStep = "Creating Outside Layer";
        var outsideLayer = lightEdgeLayer.duplicate();
        outsideLayer.name = "Outside";
        outsideLayer.moveBefore(lightEdgeLayer);
        
        // Remove all effects and strokes; use a solid Fill.
        removeAllEffects(outsideLayer);
        setShapeStyle(outsideLayer, true, 0); // Fill On, Stroke 0 (Off)
        
        // Layer Styles: Bevel and Emboss
        // Safe Add
        var bevel = addLayerStyle(outsideLayer, "ADBE Bevel and Emboss");
        if (bevel) {
             bevel.property("ADBE Bevel Style").setValue(1); // Outer Bevel
             bevel.property("ADBE Bevel Highlight Opacity").setValue(100);
             bevel.property("ADBE Bevel Shadow Opacity").setValue(100);
             bevel.property("ADBE Bevel Shadow Color").setValue([1,1,1]); // White
        }

        // Advanced Blending > Fill Opacity 0%
        var outsideStyles = outsideLayer.property("ADBE Layer Styles");
        if (outsideStyles) {
            var blendOpts = outsideStyles.property("ADBE Blend Options");
            if (blendOpts) {
                var advBlend = blendOpts.property("ADBE Advance Blend Group");
                if (advBlend) {
                    var fillOpProp = advBlend.property("ADBE Fill Opacity");
                    if (fillOpProp) fillOpProp.setValue(0);
                }
            }
        }

        // --- 4. Bevel and Light Sweep (Bevel Highlights) ---
        currentStep = "Creating Bevel Highlights";
        // Duplicate Main Graphic
        var bevelHighLayer = mainLayer.duplicate();
        bevelHighLayer.name = "Bevel Highlights";
        bevelHighLayer.moveBefore(outsideLayer); // Stack
        bevelHighLayer.adjustmentLayer = false;
        
        // Remove all effects and strokes; use a solid Fill.
        removeAllEffects(bevelHighLayer);
        setShapeStyle(bevelHighLayer, true, 0);
        
        // Layer Styles (Same as Outside)
        var bhBevel = addLayerStyle(bevelHighLayer, "ADBE Bevel and Emboss");
        if (bhBevel) {
            bhBevel.property("ADBE Bevel Style").setValue(1); // Outer Bevel
            bhBevel.property("ADBE Bevel Highlight Opacity").setValue(100);
            bhBevel.property("ADBE Bevel Shadow Opacity").setValue(100);
            bhBevel.property("ADBE Bevel Shadow Color").setValue([1,1,1]); // White
        }

        var bhStyles = bevelHighLayer.property("ADBE Layer Styles");
        if (bhStyles) {
            var bhBlendOpts = bhStyles.property("ADBE Blend Options");
            if (bhBlendOpts) {
                var bhAdvBlend = bhBlendOpts.property("ADBE Advance Blend Group");
                if (bhAdvBlend) {
                    var bhFillOp = bhAdvBlend.property("ADBE Fill Opacity");
                    if (bhFillOp) bhFillOp.setValue(0);
                }
            }
        }

        // --- 5. Final Parenting ---
        currentStep = "Parenting";
        // Parent Stroke, Edge, Light Edge, Outside, Bevel Highlights, Map -> Main Graphic
        var children = [strokeLayer, edgeLayer, lightEdgeLayer, outsideLayer, bevelHighLayer, mapLayer];
        for (var i = 0; i < children.length; i++) {
            children[i].parent = mainLayer;
        }

    } catch (e) {
        alert("Error at step '" + currentStep + "': " + e.toString() + "\nLine: " + e.line);
    } finally {
        app.endUndoGroup();
    }
})();
