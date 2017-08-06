var ws = new WebSocket("ws://localhost:8889/");
    var frame = 0;
    var isOpen = false;
    ws.onopen = function(e) {
        console.log('opening');
        isOpen = true;
    };
    ws.onclose = function(e) {
        console.log('closing');
        console.log(e);
        isOpen = false;
    };
    ws.onerror = function(e) {
        console.log('error');
        console.log(e);
    }