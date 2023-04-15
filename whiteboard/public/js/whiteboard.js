(function (canvas) {

    var msgQueue = [];
    var arrayLineCoord = [];
    var arrayCoord = [];
    var gc = null;
    var mouseDown = false;
    var oldX = null;
    var oldY = null;
    var text = null;
    var canvasPic = null;
    var wb = {};
    wb.lineCap = "round";
    wb.lineJoin = "square";
    wb.color = "#000000";
    wb.lineWidth = 6;
    wb.selectedTool = null;
    wb.history = null;

    var History = function () {
        this._stack = [];
        this._queue = [];
    };

    History.prototype = {
        get: function () {
            return this._stack;
        },
        add: function (data) {
            this._stack.push(data);
            if (this._queue.length > 0) {
                this._queue = [];
            }
            return this._stack;
        },
        undo: function () {
            if (this._stack.length == 0) {
                return;
            }
            this._queue.push(this._stack.pop());
            updateWhiteboard();
        },
        redo: function () {
            if (this._queue.length == 0) {
                return;
            }
            this._stack.push(this._queue.pop());
            updateWhiteboard();
        }
    };

    var updateWhiteboard = function () {
        gc.clearRect(0, 0, canvas.width, canvas.height);
        var h = wb.history.get();
        for (var i = 0; i < h.length; i++) {
            var obj = h[i];
            processAction(obj);
        }
    };
    var onMouseMove = function (ev) {
        if (!mouseDown) {
            return false;
        }
        var e = ev || window.event;
        var pos = getMousePos(e);
        wb.selectedTool.paint(pos, 1);
        oldX = pos.x;
        oldY = pos.y;
    };

    var onMouseUp = function (ev) {
        if (!mouseDown) {
            return false;
        }
        var e = ev || window.event;
        var pos = getMousePos(e);
        wb.selectedTool.paint(pos, 2);
        mouseDown = false;
        oldX = null;
        oldY = null;
    };

    var stopEventPropagation = function (e) {
        e.cancelBubble = true;
        e.returnValue = false;
        if (typeof (e.preventDefault) === "function") {
            e.preventDefault();
        }
        if (typeof (e.stopPropagation) === "function") {
            e.stopPropagation();
        }
        return false;
    };

    var enqueue = function (message) {
        msgQueue.push(message);
        submitQueue();
    };

    var drawLine = function (x1, y1, x2, y2) {
        paintLine(wb.lineWidth, wb.color, x1, y1, x2, y2);
    };

    var paintLine = function (width, color, x1, y1, x2, y2) {
        gc.lineCap = wb.lineCap;
        gc.lineJoin = wb.lineJoin;
        gc.lineWidth = width || wb.lineWidth;
        gc.strokeStyle = color || wb.color;
        gc.beginPath();
        gc.moveTo(x1, y1);
        gc.lineTo(x2, y2);
        gc.stroke();
    };

    var drawEraser = function (x, y) {
        paintEraser(x, y);
    };

    var paintEraser = function (x, y) {
        gc.globalCompositeOperation = "destination-out";
        gc.beginPath();
        gc.arc(x, y, 25, 0, Math.PI * 2);
        gc.fill();
        gc.globalCompositeOperation = "source-over";
    };

    var drawText = function (text, x, y) {
        paintText(text, wb.color, x, y);
    };

    var paintText = function (text, color, x, y) {
        gc.fillStyle = color || wb.color;
        gc.font = "bold 14px sans-serif";
        gc.textBaseline = "middle";
        gc.fillText(text, x, y);
    };

    var paintRect = function (width, color, left, top, right, bottom) {
        gc.lineWidth = width || wb.lineWidth;
        gc.strokeStyle = color || wb.color;
        gc.beginPath();
        gc.rect(left, top, right - left, bottom - top);
        gc.stroke();
    };

    var clear = function () {
        paintClear();
        addCoord(5);
    };

    var paintClear = function () {
        gc.clearRect(0, 0, canvas.width, canvas.height);
    };
    

}(document.getElementById("canvas")));