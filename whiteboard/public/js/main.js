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

