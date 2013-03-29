;(function (keydown, click, uniqueSelectorOf) {
    var secretToken = location.search.replace('?', '');

    console.log('Shower Remote is Online!');
    window.addEventListener('load', function () {
        var socket = io.connect('/');

        // Slave mode
        if (!secretToken || secretToken === 'full') {
            console.log('Running in Slave Mode');
            socket.on('keydown', function (message) {
                keydown(message.keyCode);
            });

            socket.on('click', function (message) {
                click(message.selector);
            });

            socket.on('hashchange', function (message) {
                location.hash = message.hash;
            });

            // hackz for iphone
            socket.on('shower', function (message) {
                shower[message.action].apply(shower, message.data || []);
            });
            return;
        }

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
(function keydown(keyCode) {
    var keyboardEvent = document.createEvent('KeyboardEvent');
    var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent';

    keyboardEvent[initMethod](
        'keydown', // event type : keydown, keyup, keypress
        true, // bubbles
        true, // cancelable
        window, // viewArg: should be window
        false, // ctrlKeyArg
        false, // altKeyArg
        false, // shiftKeyArg
        false, // metaKeyArg
        keyCode, // keyCodeArg : unsigned long the virtual key code, else 0
        0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
    );

    document.dispatchEvent(keyboardEvent);
},

function click(selector, options) {
    options = options || {};

    var target = document.querySelector(selector),
        event = target.ownerDocument.createEvent('MouseEvents');

    //Set your default options to the right of ||
    var opts = {
        type: options.type || 'click',
        canBubble: options.canBubble || true,
        cancelable: options.cancelable || true,
        view: options.view || target.ownerDocument.defaultView,
        detail: options.detail || 1,
        screenX: options.screenX || 0, //The coordinates within the entire page
        screenY: options.screenY || 0,
        clientX: options.clientX || 0, //The coordinates within the viewport
        clientY: options.clientY || 0,
        ctrlKey: options.ctrlKey || false,
        altKey: options.altKey || false,
        shiftKey: options.shiftKey || false,
        metaKey: options.metaKey  || false,
        button: options.button || 0, //0 = left, 1 = middle, 2 = right
        relatedTarget: options.relatedTarget || null
    };

    //Pass in the options
    event.initMouseEvent(
        opts.type,
        opts.canBubble,
        opts.cancelable,
        opts.view,
        opts.detail,
        opts.screenX,
        opts.screenY,
        opts.clientX,
        opts.clientY,
        opts.ctrlKey,
        opts.altKey,
        opts.shiftKey,
        opts.metaKey,
        opts.button,
        opts.relatedTarget
    );

    //Fire the event
    target.dispatchEvent(event);
},

function uniqueSelectorOf(el) {
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
