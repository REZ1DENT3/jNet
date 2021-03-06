jNet.cookie = function (document) {

    /**
     * @param key {string}
     */
    this.remove = function (key) {
        this.set(key, '', {expires: -1});
    };

    /**
     * @param key {string}
     * @param value {string}
     * @param attributes {{}}
     * @returns {boolean}
     */
    this.set = function (key, value, attributes) {

        attributes = attributes || {};

        if (typeof attributes.expires === 'number') {
            /**
             * @type {Date}
             */
            var expires = new Date();
            expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);

            /**
             * @type {Date}
             */
            attributes.expires = expires;
        }

        if (typeof attributes.path == "undefined") {
            /**
             * @type {string}
             */
            attributes.path = '/';
        }

        try {
            var result = JSON.stringify(value);
            if (/^[\{\[]/.test(result)) {
                value = result;
            }
        }
        catch (e) {
        }

        /**
         * @type {string}
         */
        value = encodeURIComponent(String(value))
            .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

        /**
         * @type {string}
         */
        key = encodeURIComponent(String(key));
        key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
        key = key.replace(/[\(\)]/g, encodeURI);

        return (document.cookie = [
                key, '=', value,
                attributes.expires && '; expires=' + attributes.expires.toUTCString(),
                attributes.path && '; path=' + attributes.path,
                attributes.domain && '; domain=' + attributes.domain,
                attributes.secure ? '; secure' : ''
            ].join('')).length > 0;

    };

    /**
     * @param key {string}
     * @returns {*}
     */
    this.get = function (key) {
        var obj = {};
        if (document.cookie.length) {
            var rDecode = /(%[0-9A-Z]{2})+/g;
            document.cookie.split('; ').forEach(function (line) {
                var parts = line.split('=');
                var name = parts[0].replace(rDecode, decodeURIComponent);
                var cookie = parts.slice(1).join('=');
                cookie = cookie.jNTrim('["]+');
                cookie = cookie.replace(rDecode, decodeURIComponent);
                obj[name] = cookie;
            });
        }
        if (typeof key == "undefined") {
            return obj;
        }
        return obj[key];
    };

    return this;

}(document);
