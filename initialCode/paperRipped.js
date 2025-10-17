/*
Verion 1.0

    INITIAL PROCEDURES
Of course. Here is a detailed, step-by-step procedure to create the procedural paper rip effect in After Effects, based on the video.

### **Prerequisites:**

  * Your image or video clip.
  * Two paper texture images:
    1.  A general paper texture for the main surface.
    2.  A fibrous or more detailed texture for the torn edges.

-----

### **Step 1: Set Up Your Footage**

1.  Create a new composition. Let's name it **"01 Insert Footage Here"**.
2.  Drag your image or video clip into this composition. This comp will be the source for all the effects that follow.

-----

### **Step 2: Create the Main Paper Layer**

This step creates the main ripped image with the paper texture.

1.  Create another new composition and name it **"02 Paper Top Layer"**.

2.  Drag your **"01 Insert Footage Here"** composition into this new comp.

3.  Place your general paper texture image on the layer *below* the footage comp.

4.  Duplicate the **"01 Insert Footage Here"** layer. You should now have three layers:

      * [Top] `01 Insert Footage Here`
      * [Middle] `01 Insert Footage Here`
      * [Bottom] `Paper Texture`

5.  Select the middle layer (`01 Insert Footage Here`) and Set its blending mode to **"Stencil Alpha"**. This uses the top layer to "cut out" the paper texture below it.

6.  to the same middle **"01 Insert Footage Here"** layer and apply the following effects from the **"Effects & Presets"** panel.

      * **Effect 1: `Simple Choker`**

          * Set `Choke Matte` to **-25**.

      * **Effect 2: `Turbulent Displace`**

          * Rename this effect to "Turbulence - Large" in the effects panel.
          * Set `Amount` to **30**.
          * Set `Size` to **20**.

      * **Effect 3: `Turbulent Displace` (Again)**

          * Duplicate the first `Turbulent Displace` effect.
          * Rename the copy to "Turbulence - Small".
          * Set `Amount` to **60**.
          * Set `Size` to **4**.

      * **Effect 4: `Roughen Edges`**

          * Set `Border` to **3**.
          * Set `Scale` to **13**.

-----

7. select the top **"01 Insert Footage Here"** layer and apply preserve underlying transparency.

### **Step 3: Create the Fibrous Ripped Edge**

This step creates the detailed white edge of the torn paper.

1.  Create a new composition and name it **"03 Paper Ripped Edges"**.
2.  Drag your **"02 Paper Top Layer"** composition into this new comp.
3.  Place your *fibrous edge texture* image on the layer below the **"02 Paper Top Layer"** comp.
4.  Set the Blending Mode of **"02 Paper Top Layer"** to **"Stencil Alpha"**.
5.  select the **"02 Paper Top Layer"** comp, and apply all the effect below.
      * **Effect 1: `Simple Choker`**

          * Set `Choke Matte` to **-30**.

      * **Effect 2: `Turbulent Displace`**

          * Rename this effect to "Turbulence - Large" in the effects panel.
          * Set `Amount` to **30**.
          * Set `Size` to **20**.

      * **Effect 3: `Turbulent Displace` (Again)**

          * Duplicate the first `Turbulent Displace` effect.
          * Rename the copy to "Turbulence - Small".
          * Set `Amount` to **60**.
          * Set `Size` to **4**.

      * **Effect 4: `Roughen Edges`**

          * Set `Border` to **3**.
          * Set `Scale` to **13**.

-----

### **Step 4: Assemble the Final Effect**

Now we will combine the main image and its ripped edge, and add shadows for depth.

1.  Create a new composition and name it **"04 Ripped Paper Effect"**.
2.  Drag in your **"03 Paper Ripped Edges"** comp and place it at the bottom.
3.  Drag in your **"02 Paper Top Layer"** comp and place it on top. 
4.  duplicate the **"03 Paper Ripped Edges"** comp in the timeline and rename the copy to **"Map for Edges"** and make sure it placed below  **"02 Paper Top Layer"** and above the original  **"03 Paper Ripped Edges"** .
5.  Apply the effect below on the **"Map for Edges"** Comp layer
       * **Effect 1: `Simple Choker`**

          * Set `Choke Matte` to **-2**.

      * **Effect 2: `Turbulent Displace`**

          * Rename this effect to "Turbulence - Large" in the effects panel.
          * Set `Amount` to **30**.
          * Set `Size` to **20**.

      * **Effect 3: `Turbulent Displace` (Again)**

          * Duplicate the first `Turbulent Displace` effect.
          * Rename the copy to "Turbulence - Small".
          * Set `Amount` to **60**.
          * Set `Size` to **4**.

      * **Effect 4: `Roughen Edges`**

          * Set `Border` to **3**.
          * Set `Scale` to **13**.

      * **Effect 5: `Gaussian Blur`**

          * Set `Blurriness` to **25**.
6.  Turn off **"02 Paper Top Layer"** visibility (click the eye icon).
7.  Select the **"03 Paper Ripped Edges"** layer. In the Track Matte column, set its Track matte to **"Map for Edges"** Comp layer.
8.  duplicate the **"02 Paper Top Layer"**.
9.  Select the top **"02 Paper Top Layer"** and rename it **"Paper Shadow Edge"**.
10. On the **"Paper Shadow Edge"** layer, add a **`Drop Shadow`** effect with these settings:
      * `Shadow Color`: Black
      * `Opacity`: Adjust to taste (e.g., 50%)
      * `Direction`: Center it
      * `Distance`: **0**
      * `Softness`: **3**
      * Check the box for **"Shadow Only"**.
11.  Duplicate the **"02 Paper Top Layer"** Comp layer rename it **"Matte for shadow"**.
12.  Move **"Matte for shadow"** Comp layer to the top and add effect below.
     1.   * **Effect 1: `Turbulent Displace`**
          * Set `Amount` to **20**.
          * Set `Size` to **7**.
13.   Select the **"Paper Shadow Edge"** Comp layer. In the Track Matte column, set its Track matte to **"Matte for shadow"**  Comp layer.
14.  Turn on **"02 Paper Top Layer"** visibility (click the eye icon) and move it to top.
-----

### **Step 5: Final Render and Background**

1.  Create one last composition called **"05 Drop shadow"**.
2.  Drag your **"04 Ripped Paper Effect"** composition into the **"05 Drop shadow"** comp.
3.  To create a final drop shadow, duplicate the **"04 Ripped Paper Effect"** layer, place the copy underneath, and name it "Drop Shadow - hard".
4.  On the "Drop Shadow - hard" layer, add effects below.
    1.  Effect 1: 'drop shadow'
        1.  opacity: 40%
        2.  distance: 0
        3.  Set 'shadow only' clicked.
    2.  * **Effect 2: `Turbulent Displace`**
          * Set `Amount` to **20**.
          * Set `Size` to **20**.
5. duplicate the **"Drop Shadow - hard"** Comp layer and rename it to **"Drop Shadow - soft"**
6. in the Drop shadow effect in the **"Drop Shadow - soft"** Comp layer, set the softness to 10 And Turbulent Displace effect size to 30.



    Paper Rip Effect Script for After Effects
    
    This script automates the creation of a paper rip effect with the following steps:
    1. Creates necessary compositions
    2. Sets up paper texture layers
    3. Applies effects for the ripped paper look
    4. Adds shadows and finishing touches
    
    Instructions:
    - Have your main footage/image imported in the project
    - Have two paper texture images imported
    - Run this script and follow the prompts
*/

(function createPaperRipEffect() {
    
    // Undo group for the entire script
    app.beginUndoGroup("Create Paper Rip Effect");
    
    try {
        var project = app.project;
        
        // Check if project exists
        if (!project) {
            alert("Please open a project first.");
            return;
        }
        
        // Get selected items or prompt user
        var selectedItems = project.selection;
        var mainFootage = null;
        var paperTexture1 = null; // texture for top.jpg
        var paperTexture2 = null; // texture for back.jpg
        
        // Check if at least one item is selected for main footage
        if (selectedItems.length >= 1) {
            mainFootage = selectedItems[0];
        } else {
            alert("Please select your main footage/image first.");
            return;
        }
        
        // Look for texture images in the project
        for (var i = 1; i <= project.items.length; i++) {
            var item = project.items[i];
            if (item instanceof FootageItem) {
                if (item.name === "texture for top.jpg") {
                    paperTexture1 = item;
                }
                if (item.name === "texture for back.jpg") {
                    paperTexture2 = item;
                }
            }
        }
        
        // Validate that we found the required textures
        if (!mainFootage) {
            alert("Please select your main footage/image.");
            return;
        }
        if (!paperTexture1) {
            alert("Could not find 'texture for top.jpg' in the project. Please make sure it's imported.");
            return;
        }
        if (!paperTexture2) {
            alert("Could not find 'texture for back.jpg' in the project. Please make sure it's imported.");
            return;
        }
        
        // Check for active composition before starting the procedure
        var activeComp = app.project.activeItem;
        if (!activeComp || !(activeComp instanceof CompItem)) {
            alert("⚠️ NO ACTIVE COMPOSITION DETECTED\n\nPlease follow these steps:\n\n1. Select your image/footage in the project panel\n2. Open a composition and click on its timeline\n3. Run this script again\n\nThe Paper Rip Effect requires an active composition.");
            return;
        }
        
        // Set all compositions to 1080p
        var compWidth = 1920;
        var compHeight = 1080;
        var compDuration = 120; // 2 minutes
        var frameRate = 30;
        
        if (mainFootage.duration) {
            compDuration = mainFootage.duration;
        }
        
        // Create or find "Paper Ripped" parent folder
        var paperRippedFolder = null;
        for (var i = 1; i <= project.items.length; i++) {
            var item = project.items[i];
            if (item instanceof FolderItem && item.name === "Paper Ripped") {
                paperRippedFolder = item;
                break;
            }
        }
        if (!paperRippedFolder) {
            paperRippedFolder = project.items.addFolder("Paper Ripped");
        }
        
        // Create folder with main image name (without extension) with increment numbering if exists
        var mainImageName = mainFootage.name;
        var nameParts = mainImageName.split(".");
        var baseFolderName = nameParts.length > 1 ? nameParts.slice(0, -1).join(".") : mainImageName;
        var folderName = baseFolderName;
        var counter = 1;
        
        // Check if folder with this name already exists in Paper Ripped folder
        var folderExists = true;
        while (folderExists) {
            folderExists = false;
            for (var j = 1; j <= paperRippedFolder.items.length; j++) {
                var existingItem = paperRippedFolder.items[j];
                if (existingItem instanceof FolderItem && existingItem.name === folderName) {
                    folderExists = true;
                    counter++;
                    folderName = baseFolderName + " " + counter;
                    break;
                }
            }
        }
        
        var projectFolder = paperRippedFolder.items.addFolder(folderName);
        
        // Step 1: Create "01 Insert Footage Here" composition
        var comp01 = project.items.addComp("01 Insert Footage Here", compWidth, compHeight, 1, compDuration, frameRate);
        comp01.parentFolder = projectFolder;
        var footageLayer01 = comp01.layers.add(mainFootage);
        
        // Auto-scale the footage to fit within 60% of composition dimensions while maintaining aspect ratio
        var sourceWidth = mainFootage.width;
        var sourceHeight = mainFootage.height;
        
        if (sourceWidth && sourceHeight) {
            // Calculate 60% of composition dimensions (doubled from 30%)
            var maxWidth = compWidth * 0.6;
            var maxHeight = compHeight * 0.6;
            
            // Calculate scale factor to fit within 60% of comp size while maintaining aspect ratio
            var scaleX = maxWidth / sourceWidth;
            var scaleY = maxHeight / sourceHeight;
            var finalScale = Math.min(scaleX, scaleY) * 100; // Convert to percentage
            
            // Apply scale to the footage layer
            footageLayer01.property("Transform").property("Scale").setValue([finalScale, finalScale]);
            
            // Center the scaled footage
            footageLayer01.property("Transform").property("Position").setValue([compWidth/2, compHeight/2]);
        }
        
        // Step 2: Create "02 Paper Top Layer" composition
        var comp02 = project.items.addComp("02 Paper Top Layer", compWidth, compHeight, 1, compDuration, frameRate);
        comp02.parentFolder = projectFolder;
        
        // Add layers in correct order: [Top] 01 Insert Footage Here, [Middle] 01 Insert Footage Here, [Bottom] Paper Texture
        // Note: In AE scripting, layers are added from top to bottom, so we add in reverse order
        var paperLayer1 = comp02.layers.add(paperTexture1);
        var middleFootageLayer = comp02.layers.add(comp01);
        var topFootageLayer = comp02.layers.add(comp01);
        
        // Scale and position the paper texture to match the image size and position
        if (sourceWidth && sourceHeight) {
            // Calculate the same scale and position as the source image
            var maxWidth = compWidth * 0.6;
            var maxHeight = compHeight * 0.6;
            var scaleX = maxWidth / sourceWidth;
            var scaleY = maxHeight / sourceHeight;
            var finalScale = Math.min(scaleX, scaleY) * 100;
            
            // Calculate how much to scale the texture to cover the scaled image
            var textureScaleX = (sourceWidth * finalScale / 100) / paperTexture1.width * 100;
            var textureScaleY = (sourceHeight * finalScale / 100) / paperTexture1.height * 100;
            var textureScale = Math.max(textureScaleX, textureScaleY); // Use max to ensure full coverage
            
            // Apply scale and position to match the image
            paperLayer1.property("Transform").property("Scale").setValue([textureScale, textureScale]);
            paperLayer1.property("Transform").property("Position").setValue([compWidth/2, compHeight/2]);
        }
        
        // Set middle layer blending mode to Stencil Alpha
        middleFootageLayer.blendingMode = BlendingMode.STENCIL_ALPHA;
        
        // Apply effects to the middle layer (the stencil layer)
        applyTopLayerEffects(middleFootageLayer);
        
        // Set preserve underlying transparency on top layer
        topFootageLayer.preserveTransparency = true;
        
        // Step 3: Create "03 Paper Ripped Edges" composition
        var comp03 = project.items.addComp("03 Paper Ripped Edges", compWidth, compHeight, 1, compDuration, frameRate);
        comp03.parentFolder = projectFolder;
        
        // Add comp02 and fibrous edge texture in correct order: [Top] 02 Paper Top Layer, [Bottom] Fibrous edge texture
        // Note: In AE scripting, layers are added from top to bottom, so we add in reverse order
        var fibrousEdgeTexture = comp03.layers.add(paperTexture2);
        var comp02LayerInComp03 = comp03.layers.add(comp02);
        
        // Scale and position the fibrous edge texture to match the image size and position
        if (sourceWidth && sourceHeight) {
            // Calculate the same scale and position as the source image
            var maxWidth = compWidth * 0.6;
            var maxHeight = compHeight * 0.6;
            var scaleX = maxWidth / sourceWidth;
            var scaleY = maxHeight / sourceHeight;
            var finalScale = Math.min(scaleX, scaleY) * 100;
            
            // Calculate how much to scale the texture to cover the scaled image
            var textureScaleX = (sourceWidth * finalScale / 100) / paperTexture2.width * 100;
            var textureScaleY = (sourceHeight * finalScale / 100) / paperTexture2.height * 100;
            var textureScale = Math.max(textureScaleX, textureScaleY); // Use max to ensure full coverage
            
            // Apply scale and position to match the image
            fibrousEdgeTexture.property("Transform").property("Scale").setValue([textureScale, textureScale]);
            fibrousEdgeTexture.property("Transform").property("Position").setValue([compWidth/2, compHeight/2]);
        }
        
        // Set comp02 blending mode to Stencil Alpha
        comp02LayerInComp03.blendingMode = BlendingMode.STENCIL_ALPHA;
        
        // Apply effects to comp02 layer in comp03
        applyEdgeEffects(comp02LayerInComp03);
        
        // Step 4: Create "04 Ripped Paper Effect" composition
        var comp04 = project.items.addComp("04 Ripped Paper Effect", compWidth, compHeight, 1, compDuration, frameRate);
        comp04.parentFolder = projectFolder;
        
        // Add layers in order: [Bottom] 03 Paper Ripped Edges, [Middle] Map for Edges, [Above] 02 Paper Top Layer
        var rippedEdgesLayer = comp04.layers.add(comp03);
        var mapForEdgesLayer = comp04.layers.add(comp03);
        mapForEdgesLayer.name = "Map for Edges";
        var paperTopLayer1 = comp04.layers.add(comp02);
        
        // Apply effects to Map for Edges layer
        applyMapForEdgesEffects(mapForEdgesLayer);
        
        // Turn off 02 Paper Top Layer visibility temporarily
        paperTopLayer1.enabled = false;
        
        // Set track matte for ripped edges using Map for Edges as track matte
        rippedEdgesLayer.setTrackMatte(mapForEdgesLayer, TrackMatteType.ALPHA);
        
        // Duplicate 02 Paper Top Layer for Paper Shadow Edge
        var shadowEdgeLayer = comp04.layers.add(comp02);
        shadowEdgeLayer.name = "Paper Shadow Edge";
        
        // Apply inner shadow effect to shadow edge layer
        applyInnerShadowEffect(shadowEdgeLayer);
        
        // Duplicate 02 Paper Top Layer for Matte for shadow
        var matteForShadowLayer = comp04.layers.add(comp02);
        matteForShadowLayer.name = "Matte for shadow";
        
        // Apply effects to Matte for shadow
        applyMatteForShadowEffects(matteForShadowLayer);
        
        // Set track matte for Paper Shadow Edge using Matte for shadow
        shadowEdgeLayer.setTrackMatte(matteForShadowLayer, TrackMatteType.ALPHA);
        
        // Turn 02 Paper Top Layer visibility back on and move to top
        paperTopLayer1.enabled = true;
        paperTopLayer1.moveToBeginning();
        
        // Step 5: Create final composition with custom name (with increment numbering)
        var finalCompName = "RP - " + baseFolderName;
        if (counter > 1) {
            finalCompName += " " + counter;
        }
        var finalComp = project.items.addComp(finalCompName, compWidth, compHeight, 1, compDuration, frameRate);
        finalComp.parentFolder = projectFolder;
        
        // Add the ripped paper effect
        var rippedPaperLayer = finalComp.layers.add(comp04);
        
        // Create hard drop shadow layer
        var dropShadowHardLayer = finalComp.layers.add(comp04);
        dropShadowHardLayer.name = "Drop Shadow - hard";
        dropShadowHardLayer.moveAfter(rippedPaperLayer);
        applyHardDropShadow(dropShadowHardLayer);
        
        // Create soft drop shadow layer
        var dropShadowSoftLayer = finalComp.layers.add(comp04);
        dropShadowSoftLayer.name = "Drop Shadow - soft";
        dropShadowSoftLayer.moveAfter(dropShadowHardLayer);
        applySoftDropShadow(dropShadowSoftLayer);
        
        // Add the final composition to the currently active composition if one exists
        var currentActiveComp = app.project.activeItem;
        if (currentActiveComp && currentActiveComp instanceof CompItem) {
            var finalLayer = currentActiveComp.layers.add(finalComp);
            finalLayer.moveToBeginning(); // Place on top
            
            // Remove the original source image from the active composition
            // Find and remove any layers that match the main footage
            for (var i = currentActiveComp.layers.length; i >= 1; i--) {
                var layer = currentActiveComp.layers[i];
                if (layer.source === mainFootage) {
                    layer.remove();
                }
            }
            
            alert("✅ Paper Rip Effect created and added to: " + currentActiveComp.name + "\n🗑️ Original source image removed from composition");
        } else {
            alert("✅ Paper Rip Effect created!");
        }
        
    } catch (error) {
        alert("Error creating paper rip effect: " + error.toString());
    }
    
    app.endUndoGroup();
    
    // Helper function to apply effects to Step 2 middle layer
    function applyTopLayerEffects(layer) {
        try {
            // Simple Choker (doubled thickness)
            var simpleChoker = layer.Effects.addProperty("ADBE Simple Choker");
            simpleChoker.property("Choke Matte").setValue(-50);
            
            // Turbulence Displace (Large) - doubled amounts
            var turbulence1 = layer.Effects.addProperty("ADBE Turbulent Displace");
            turbulence1.name = "Turbulence - Large";
            turbulence1.property("Amount").setValue(60);
            turbulence1.property("Size").setValue(40);
            
            // Turbulence Displace (Small) - doubled amounts
            var turbulence2 = layer.Effects.addProperty("ADBE Turbulent Displace");
            turbulence2.name = "Turbulence - Small";
            turbulence2.property("Amount").setValue(120);
            turbulence2.property("Size").setValue(8);
            
            // Roughen Edges - doubled values
            var roughenEdges = layer.Effects.addProperty("ADBE Roughen Edges");
            roughenEdges.property("Border").setValue(6);
            roughenEdges.property("Scale").setValue(26);
            
        } catch (e) {
            alert("Error applying top layer effects: " + e.toString());
        }
    }
    
    // Helper function to apply effects to Step 3 edge layer
    function applyEdgeEffects(layer) {
        try {
            // Simple Choker (doubled thickness)
            var simpleChoker = layer.Effects.addProperty("ADBE Simple Choker");
            simpleChoker.property("Choke Matte").setValue(-60);
            
            // Turbulence Displace (Large) - doubled amounts
            var turbulence1 = layer.Effects.addProperty("ADBE Turbulent Displace");
            turbulence1.name = "Turbulence - Large";
            turbulence1.property("Amount").setValue(60);
            turbulence1.property("Size").setValue(40);
            
            // Turbulence Displace (Small) - doubled amounts
            var turbulence2 = layer.Effects.addProperty("ADBE Turbulent Displace");
            turbulence2.name = "Turbulence - Small";
            turbulence2.property("Amount").setValue(120);
            turbulence2.property("Size").setValue(8);
            
            // Roughen Edges - doubled values
            var roughenEdges = layer.Effects.addProperty("ADBE Roughen Edges");
            roughenEdges.property("Border").setValue(6);
            roughenEdges.property("Scale").setValue(26);
            
        } catch (e) {
            alert("Error applying edge effects: " + e.toString());
        }
    }
    
    // Helper function to apply effects to "Map for Edges" layer
    function applyMapForEdgesEffects(layer) {
        try {
            // Simple Choker (doubled thickness)
            var simpleChoker = layer.Effects.addProperty("ADBE Simple Choker");
            simpleChoker.property("Choke Matte").setValue(-4);
            
            // Turbulence Displace (Large) - doubled amounts
            var turbulence1 = layer.Effects.addProperty("ADBE Turbulent Displace");
            turbulence1.name = "Turbulence - Large";
            turbulence1.property("Amount").setValue(30);
            turbulence1.property("Size").setValue(20);
            
            // Turbulence Displace (Small) - doubled amounts
            var turbulence2 = layer.Effects.addProperty("ADBE Turbulent Displace");
            turbulence2.name = "Turbulence - Small";
            turbulence2.property("Amount").setValue(60);
            turbulence2.property("Size").setValue(4);
            
            // Roughen Edges - doubled values
            var roughenEdges = layer.Effects.addProperty("ADBE Roughen Edges");
            roughenEdges.property("Border").setValue(3);
            roughenEdges.property("Scale").setValue(13);
            
            // Gaussian Blur - doubled for thicker edge effect
            var gaussianBlur = layer.Effects.addProperty("ADBE Gaussian Blur 2");
            gaussianBlur.property("Blurriness").setValue(25);
            
        } catch (e) {
            alert("Error applying map for edges effects: " + e.toString());
        }
    }
    
    // Helper function to apply effects to "Matte for shadow" layer
    function applyMatteForShadowEffects(layer) {
        try {
            // Turbulence Displace - doubled amounts
            var turbulence = layer.Effects.addProperty("ADBE Turbulent Displace");
            turbulence.property("Amount").setValue(40);
            turbulence.property("Size").setValue(14);
            
        } catch (e) {
            alert("Error applying matte for shadow effects: " + e.toString());
        }
    }
    
    // Helper function to apply inner shadow effect (Paper Shadow Edge)
    function applyInnerShadowEffect(layer) {
        try {
            var dropShadow = layer.Effects.addProperty("ADBE Drop Shadow");
            dropShadow.property("Shadow Only").setValue(true);
            dropShadow.property("Shadow Color").setValue([0, 0, 0]);
            dropShadow.property("Opacity").setValue(0.5); // Adjust to taste
            dropShadow.property("Direction").setValue(0); // Center it
            dropShadow.property("Distance").setValue(0);
            dropShadow.property("Softness").setValue(6); // Doubled for thicker shadow
            
        } catch (e) {
            alert("Error applying inner shadow effect: " + e.toString());
        }
    }
    
    // Helper function to apply hard drop shadow effect
    function applyHardDropShadow(layer) {
        try {
            // Drop Shadow
            var dropShadow = layer.Effects.addProperty("ADBE Drop Shadow");
            dropShadow.property("Shadow Only").setValue(true);
            dropShadow.property("Opacity").setValue(0.4); // 40%
            dropShadow.property("Distance").setValue(0);
            
            // Turbulence Displace - doubled amounts
            var turbulence = layer.Effects.addProperty("ADBE Turbulent Displace");
            turbulence.property("Amount").setValue(40);
            turbulence.property("Size").setValue(40);
            
        } catch (e) {
            alert("Error applying hard drop shadow: " + e.toString());
        }
    }
    
    // Helper function to apply soft drop shadow effect
    function applySoftDropShadow(layer) {
        try {
            // Drop Shadow
            var dropShadow = layer.Effects.addProperty("ADBE Drop Shadow");
            dropShadow.property("Shadow Only").setValue(true);
            dropShadow.property("Opacity").setValue(0.4); // 40%
            dropShadow.property("Distance").setValue(0);
            dropShadow.property("Softness").setValue(20); // Doubled for softer shadow
            
            // Turbulence Displace - doubled amounts
            var turbulence = layer.Effects.addProperty("ADBE Turbulent Displace");
            turbulence.property("Amount").setValue(40);
            turbulence.property("Size").setValue(60);
            
        } catch (e) {
            alert("Error applying soft drop shadow: " + e.toString());
        }
    }
    
})();