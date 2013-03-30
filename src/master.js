;(function (uniqueSelectorOf) {
    var secretToken = location.pathname.split('/')[1];

    console.log('Shower Remote is Online!');
    window.addEventListener('load', function () {
        var socket = io.connect('/');

        console.log('Running in Master Mode');
        alert('Running in Master Mode');
        // Master mode
        document.addEventListener('keydown', function (e) {
            // Shortcut for alt, ctrl and meta keys
            if (e.altKey || e.ctrlKey || e.metaKey) {
                return;
            }

            socket.emit('keydown:' + secretToken, {
                keyCode: e.which
            });
        });

        document.addEventListener('click', function (e) {
            socket.emit('click:' + secretToken, {
                selector: uniqueSelectorOf(e.target)
            });
        });

        window.addEventListener('hashchange', function () {
            socket.emit('hashchange:' + secretToken, {
                hash: location.hash
            });
        }, false);

        // hackz for iphone
        document.addEventListener('touchstart', function(e) {
            if (typeof shower === 'undefined') {
                return;
            }

       		if (shower._getSlideIdByEl(e.target)) {
       			if (shower.isSlideMode() && ! shower._checkInteractiveElement(e)) {
       				var x = e.touches[0].pageX;

       				if (x > window.innerWidth / 2) {
                        socket.emit('shower:' + secretToken, {
                            action: 'next'
                        });
       				} else {
                        socket.emit('shower:' + secretToken, {
                            action: 'previous'
                        });
       				}
       			}

       			if (shower.isListMode()) {
                    socket.emit('shower:' + secretToken, {
                        action: 'go',
                        data: [shower.getSlideNumber(shower._getSlideIdByEl(e.target))]
                    });
                    socket.emit('shower:' + secretToken, {
                        action: 'enterSlideMode'
                    });
       			}
       		}
       	}, false);

    });
})
(function uniqueSelectorOf(el) {
    var names = [];
    while (el.parentNode) {
        if (el === el.ownerDocument.documentElement) {
            names.unshift(el.tagName.toLowerCase());
        } else {
            for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++);
            names.unshift(el.tagName.toLowerCase() + ":nth-child(" + c + ")");
        }
        el = el.parentNode;
    }
    return names.join(" > ");
});
