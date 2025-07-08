// Initialize FabricJS canvas
const canvas = new fabric.Canvas('canvas', {
    backgroundColor: '#ffffff'
});

// Variables to track drawing state
let isDrawing = false;
let startX, startY;
let currentLine = null;
let lShapePoints = [];

// Get control elements
const strokeColorInput = document.getElementById('strokeColor');
const strokeWidthInput = document.getElementById('strokeWidth');
const clearCanvasBtn = document.getElementById('clearCanvas');
const deleteSelectedBtn = document.getElementById('deleteSelected');
const dashedLineInput = document.getElementById('dashedLine');
const drawModeInput = document.getElementById('drawMode');

// Mouse down event - start drawing
canvas.on('mouse:down', function(options) {
    // Only start drawing if clicking on empty canvas (not on existing objects)
    if (options.target === null) {
        const pointer = canvas.getPointer(options.e);

        if (drawModeInput.value === 'lshape') {
            // L-Shape mode
            lShapePoints.push({ x: pointer.x, y: pointer.y });

            if (lShapePoints.length === 3) {
                // Create two lines for the L-shape
                const line1 = new fabric.Line(
                    [lShapePoints[0].x, lShapePoints[0].y, lShapePoints[1].x, lShapePoints[1].y],
                    {
                        stroke: strokeColorInput.value,
                        strokeWidth: parseInt(strokeWidthInput.value),
                        selectable: false,
                        evented: false,
                        strokeDashArray: dashedLineInput && dashedLineInput.checked ? [10, 5] : null
                    }
                );
                const line2 = new fabric.Line(
                    [lShapePoints[1].x, lShapePoints[1].y, lShapePoints[2].x, lShapePoints[2].y],
                    {
                        stroke: strokeColorInput.value,
                        strokeWidth: parseInt(strokeWidthInput.value),
                        selectable: false,
                        evented: false,
                        strokeDashArray: dashedLineInput && dashedLineInput.checked ? [10, 5] : null
                    }
                );
                // Group the two lines
                const lShapeGroup = new fabric.Group([line1, line2], {
                    selectable: true,
                    evented: true
                });
                canvas.add(lShapeGroup);
                canvas.setActiveObject(lShapeGroup);
                canvas.renderAll();
                lShapePoints = []; // Reset for next L-shape
            }
        } else {
            // Normal line mode (your existing code)
            isDrawing = true;
            startX = pointer.x;
            startY = pointer.y;

            currentLine = new fabric.Line([startX, startY, startX, startY], {
                stroke: strokeColorInput.value,
                strokeWidth: parseInt(strokeWidthInput.value),
                selectable: true,
                evented: true,
                hasControls: true,
                hasBorders: true,
                originX: 'center',
                originY: 'center',
                strokeDashArray: dashedLineInput && dashedLineInput.checked ? [10, 5] : null
            });

            canvas.add(currentLine);
            canvas.setActiveObject(currentLine);
        }
    }
});

// Mouse move event - update line while drawing
canvas.on('mouse:move', function(options) {
    if (isDrawing && currentLine) {
        const pointer = canvas.getPointer(options.e);
        
        // Update line coordinates
        currentLine.set({
            x2: pointer.x,
            y2: pointer.y
        });
        
        canvas.renderAll();
    }
});

// Mouse up event - finish drawing
canvas.on('mouse:up', function(options) {
    if (isDrawing && currentLine) {
        isDrawing = false;
        currentLine = null;
        
        // Deselect the line after drawing
        canvas.discardActiveObject();
        canvas.renderAll();
    }
});

// Update line properties when controls change
strokeColorInput.addEventListener('change', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'line') {
        activeObject.set('stroke', this.value);
        canvas.renderAll();
    }
});

strokeWidthInput.addEventListener('change', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'line') {
        activeObject.set('strokeWidth', parseInt(this.value));
        canvas.renderAll();
    }
});

// Clear canvas button
clearCanvasBtn.addEventListener('click', function() {
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    lShapePoints = [];
    canvas.renderAll();
});

// Delete selected object button
deleteSelectedBtn.addEventListener('click', function() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.renderAll();
    }
});

dashedLineInput.addEventListener('change', function() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    if (activeObject.type === 'line') {
        activeObject.set('strokeDashArray', dashedLineInput.checked ? [10, 5] : null);
    } else if (activeObject.type === 'group') {
        activeObject.getObjects().forEach(obj => {
            if (obj.type === 'line') {
                obj.set('strokeDashArray', dashedLineInput.checked ? [10, 5] : null);
            }
        });
    }
    canvas.renderAll();
});
// Console log for debugging - shows line coordinates
canvas.on('selection:created', function(e) {
    const selectedObject = e.selected[0];
    if (selectedObject && selectedObject.type === 'line') {
        // console.log('Selected line coordinates:');
        // console.log('Start: (' + selectedObject.x1 + ', ' + selectedObject.y1 + ')');
        // console.log('End: (' + selectedObject.x2 + ', ' + selectedObject.y2 + ')');
    }
});

// Log when objects are modified
canvas.on('object:modified', function(e) {
    const modifiedObject = e.target;
    if (modifiedObject && modifiedObject.type === 'line') {
        // console.log('Line modified - New coordinates:');
        // console.log('Start: (' + modifiedObject.x1 + ', ' + modifiedObject.y1 + ')');
        // console.log('End: (' + modifiedObject.x2 + ', ' + modifiedObject.y2 + ')');
    }
}); 