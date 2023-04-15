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

}(document.getElementById("canvas")));