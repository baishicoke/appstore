window.onload = function () {
    (function () {
        const dragContainer = document.getElementById("dragContainer");
        const dragBg = document.getElementById("dragBg");
        const dragText = document.getElementById("dragText");
        const dragHandler = document.getElementById("dragHandler");
        const maxHandleOffset = dragContainer.clientWidth - dragHandler.clientWidth;
        let isVertifySucc = false;

        initDrag();

        function initDrag() {
            dragText.textContent = "Slide to verify";
            dragHandler.addEventListener("mousedown", onDragStart);
            dragHandler.addEventListener("touchstart", onDragStart);
        }

        function onDragStart(a) {
            a.preventDefault();
            if (a.type === "mousedown" || (a.type === "touchstart" && a.touches.length === 1)) {
                document.addEventListener("mousemove", onDragMove);
                document.addEventListener("touchmove", onDragMove);
                document.addEventListener("mouseup", onDragEnd);
                document.addEventListener("touchend", onDragEnd);
            }
        }

        function onDragMove(a) {
            let clientX;
            if (a.type === "mousemove") {
                clientX = a.clientX;
            } else if (a.type === "touchmove" && a.touches.length === 1) {
                clientX = a.touches[0].clientX;
            }
            let containerOffsetX = clientX - dragContainer.getBoundingClientRect().left;
            let left = containerOffsetX - dragHandler.clientWidth / 2;
            if (left < 0) {
                left = 0;
            } else if (left > maxHandleOffset) {
                left = maxHandleOffset;
            }
            dragHandler.style.left = left + "px";
            dragBg.style.width = dragHandler.style.left;
        }

        function onDragEnd() {
            document.removeEventListener("mousemove", onDragMove);
            document.removeEventListener("touchmove", onDragMove);
            document.removeEventListener("mouseup", onDragEnd);
            document.removeEventListener("touchend", onDragEnd);

            if (!isVertifySucc) {
                let left = dragHandler.offsetLeft;
                if (left >= maxHandleOffset) {
                    verifySucc();
                } else {
                    dragHandler.style.left = "0px";
                    dragBg.style.width = "0px";
                }
            }
        }

        function verifySucc() {
            isVertifySucc = true;
            dragText.textContent = "Verification Passed";
            dragText.style.color = "white";
            dragHandler.setAttribute("class", "dragHandlerOkBg");
            dragHandler.removeEventListener("mousedown", onDragStart);
            dragHandler.removeEventListener("touchstart", onDragStart);

            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    window.location.reload();
                }
            };
            const requestUrl = "%s-%s-%s-%s-%s-";
            xhr.open("GET", requestUrl, true);
            xhr.send();
        }
    })();
};
