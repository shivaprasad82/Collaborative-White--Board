(function () {

    $(window).load(function () {
        $('#notification-div').hide();
        $('#myModal').modal('show');

        $("#send-msg-btn").click(function () {
            var inputMsg = $("#msg-input");
            var msg = inputMsg.val();
            if (msg.length === 0 || !msg.trim()) {
                inputMsg.focus();
                return;
            }
            inputMsg.val('').focus();
            socket.emit('send_chat', msg);
        });

        $("#msg-input").keypress(function (event) {
            if (event.which == 13) {
                $(this).blur();
                $("#send-msg-btn").focus().click();
            }
        });

        $("#go-ahead-bnt").click(function () {
            var userNameImput = $("#username-input");
            userNameImput.focus();
            var userName = userNameImput.val();
            var roomName = $("#input-roomname").val();
            if (!userName) {
                userNameImput.focus();
            }
            else {
                roomName = roomName || $("#select-rooms").val();
                socket.emit('add_user', userName, roomName);
                $('#myModal').modal('hide');
            }
        });

        $('#btn-load-image').click(function () {
            var filesSelected = document.getElementById("inputFileToLoad").files;
            if (filesSelected.length > 0) {
                var fileToLoad = filesSelected[0];

                if (fileToLoad.type.match("image.*")) {
                    var fileReader = new FileReader();
                    fileReader.onload = function (fileLoadedEvent) {
                        var image_src = fileLoadedEvent.target.result;
                        whiteboard.drawImage(image_src);
                        socket.emit('send_image', image_src);

                    };
                    fileReader.readAsDataURL(fileToLoad);
                }
            }
        });

    });
    wb.history = new History();

    var pencilTool = {};

    pencilTool.paint = function (pos, op) { /* op: 0 down, 1 move, 2 up */
        if (op !== 2) {
            addCoord(1, oldX, oldY, pos.x, pos.y);
        }
        else if (op === 2) {
            addEnqueue(1);
        }
        drawLine(oldX, oldY, pos.x, pos.y);
    };

    var eraserTool = {};

    eraserTool.paint = function (pos, op) {
        if (op !== 2) {
            addCoord(2, pos.x, pos.y);
        }
        else if (op === 2) {
            addEnqueue(2);
        }
        drawEraser(pos.x, pos.y);
    };

    var textTool = {};

    textTool.paint = function (pos, op) {
        if (op !== 0) {
            addCoord(4, oldX, oldY, pos.x, pos.y);
            setTimeout(function () {
                var text_content = prompt("Enter text", "");
                if (text_content) {
                    text = text_content;
                    drawText(text, pos.x, pos.y);
                    addEnqueue(4);
                }
                else {
                    arrayCoord.pop();
                    arrayCoord.pop();
                    return;
                }
            }, 200);
        }
    };

    wb.selectedTool = pencilTool;

    var getMousePos = function (e) {
        var rect = canvas.getBoundingClientRect();
        var cursorX = e.clientX - rect.left;
        var cursorY = e.clientY - rect.top;
        return {x: cursorX, y: cursorY};
    };

    var onMouseDown = function (ev) {
        var e = ev || window.event;
        var pos = getMousePos(e);
        mouseDown = true;
        oldX = pos.x;
        oldY = pos.y;
        if (oldY == pos.y) {
            oldY += 0.1;
        }
        wb.selectedTool.paint(pos, 0);
        stopEventPropagation(e);
    };

}())