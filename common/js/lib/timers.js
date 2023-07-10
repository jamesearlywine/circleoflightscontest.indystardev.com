window.timers = {
    collection : {},
    timer : {
        instance: function() {
            return {
                name: null,
                _start: null,
                _end: null,
                duration: null,
                start: function() {
                    this._start = new Date().getTime();
                    return this;
                },
                end: function() {
                    this._end = new Date().getTime();
                    this.calculateDuration();
                    return this;
                },
                calculateDuration: function() {
                    this.duration = this._end - this._start;
                    return this;
                },
                name: function(name) {
                    if (name !== undefined) {
                        this.name = name;
                        return this;    
                    } else {
                        return this;
                    }
                }
            }
        }
    },
    create : function(name) {
        this.collection[name] = this.timer.instance();
        this.get(name).name = name;
        return this.get(name);
    },
    get : function (name) {
        return this.collection[name];
    },
    
    /*
    smallTest : function() {
        if (this.get('smallTest') === undefined) {
            var timer = this.create('smallTest');
            var img = new Image();
            img.onload = function(timer) {
                timer.end();
                console.log('smallTest complete, timer: ', timer);
            }.bind({}, timer);
            timer.start();
            img.src='common/img/header-bar-bg.png?cachebreaker=' + new Date().getTime();
        }
    },
    bigTest : function(callback) {
        if (this.get('bigTest') === undefined) {
            var timer = this.create('bigTest');
            var img = new Image();
            img.onload = function(timer, callback) {
                timer.end();
                console.log('bigTest complete, timer: ', timer);
                callback();
            }.bind({}, timer, callback);
            timer.start();
            img.src='common/img/bg.jpg?cachebreaker=' + new Date().getTime();    
        }
    },
    runTests : function() {
        this.bigTest(this.smallTest.bind(this));
    }
    */
}