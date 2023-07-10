window.indystar_environment = {

    /**
     * Environmental Variables - returned by get(), depending on environment state
     */
    variables : {
        'dev' : {
            baseURL: 'http://circleoflightscontest.indystardev.com/',
            assetsBaseURL: 'http://s3.amazonaws.com//circleoflights/',
            shareSettings : {
                caption: 'INDYSTARDEV.COM',
                facebookAppId: '980280605364146',
                media: 'http://circleoflightscontest.indystardev.com/common/img/DigitalColoringContestHeader-thumbnail.jpg',
                redirectUrl: 'http://circleoflightscontest.indystardev.com/common/html/close.html'
            },
            googleAnalyticsCode: '',
            omniture : {
                defaults : {
                    section: 'sponsor-story',
                    extension: null,
                    showDevice: true,
                    debugTransport: true
                }
            },
        },
        'production' : {
            baseURL: 'http://digital.indystar.com/circleoflights/',
            assetsBaseURL: 'http://s3.amazonaws.com//circleoflights/',
            shareSettings : {
                caption: 'INDYSTAR.COM',
                facebookAppId: '1626445147605499',
                media: 'http://digital.indystar.com/circleoflights/common/img/DigitalColoringContestHeader-thumbnail.jpg',
                redirectUrl: 'http://digital.indystar.com/circleoflights/common/html/close.html'
                
            },
            googleAnalyticsCode: '',
            omniture : {
                defaults : {
                    section: 'sponsor-story',
                    extension: null,
                    showDevice: true,
                    debugTransport: false
                }
            },          
        }
        
    },
    
    /**
     * Environment URL Config
     */
    environmentURLs: {
        // environment
        'dev': [
            // urls that trigger that environment state
            'indystardev.com'
        ]
    },
    defaults: {
        // if no url matches, this is the environment state to trigger..
        'environment': 'production'  
    },

    /**
     *  Getters / Setters
     */
    get: function(key, defaultValue) {
        if (key ===undefined) {
            return this.variables[this.environment];
        }
        if (this.variables[this.environment][key] === undefined) {
            if (defaultValue !== undefined) {
                return defaultValue;
            } else {
                return undefined;
            }
        } else {
            return this.variables[this.environment][key];
        }
    },
    set: function(key, value) {
        return this.variables[this.environment][key] = value;
    },
    put: function(key, value) {
        return this.set(key, value);
    },

    /**
     *  Environment Detection 
     */
    environment: null,
    _url: window.location.href,
    detect: function() {
        for (var key in this.environmentURLs) {
            if ( this._urlIsEnvironment(this.environmentURLs[key]) ) {
                this.environment = key;
                return;
            } 
        }
        this.environment = this.defaults.environment;
    },
    _urlIsEnvironment: function(env) {
        for (var key in env) {
            if (this._url.toLowerCase().indexOf(env[key]) !== -1) {
                return true;
            }
        }
        return false;
    }
}
window.indystar_environment.detect();