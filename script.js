// Initialize FabricJS canvas
const canvas = new fabric.Canvas('canvas', {
    backgroundColor: '#ffffff'
});

// Variables to track drawing state
let isDrawing = false;
let startX, startY;
let currentLine = null;

// Get control elements
const strokeColorInput = document.getElementById('strokeColor');
const strokeWidthInput = document.getElementById('strokeWidth');
const clearCanvasBtn = document.getElementById('clearCanvas');
const deleteSelectedBtn = document.getElementById('deleteSelected');
const dashedLineInput = document.getElementById('dashedLine');

// Mouse down event - start drawing
canvas.on('mouse:down', function(options) {
    // Only start drawing if clicking on empty canvas (not on existing objects)
    if (options.target === null) {
        isDrawing = true;
        const pointer = canvas.getPointer(options.e);
        startX = pointer.x;
        startY = pointer.y;
        
        // Create a new line
        currentLine = new fabric.Line([startX, startY, startX, startY], {
            stroke: strokeColorInput.value,
            strokeWidth: parseInt(strokeWidthInput.value),
            selectable: true,
            evented: true,
            hasControls: true,
            hasBorders: true,
            originX: 'center',
            originY: 'center',
            strokeDashArray:dashedLineInput.checked ? [10, 5] : null
            
        });
        
        canvas.add(currentLine);
        canvas.setActiveObject(currentLine);
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
    if (activeObject && activeObject.type === 'line') {
        activeObject.set('strokeDashArray', dashedLineInput.checked ? [10, 5] : null);
        canvas.renderAll();
    }
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