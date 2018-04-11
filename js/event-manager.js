const EventManager = new (function() {
    const events = {};

    this.publish = function(name, data){
        let handlers = events[name];
        if(!!handlers === false) return;
        handlers.forEach(function(handler){
            handler.call(this, data)
        })
    }

    this.subscribe = function(name, handler){
        let handlers = events[name];
        if(!!handlers === false){
            handlers = events[name] = []
        }
        handlers.push(handler)
    }

    this.unsubscribe = function(name, handler){
        let handlers = events[name];
        if(!!handlers === false) return;
        const handlerIndex = handlers.indexOf(handler)
        handlers.splice(handlerIndex);
    }
})