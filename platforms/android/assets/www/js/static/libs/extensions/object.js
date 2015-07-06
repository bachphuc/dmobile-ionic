String.prototype.ucFrist = function() {
    return this.charAt(0).toUpperCase() + this.substring(1);
};

Function.prototype.getArgs = function() {
    var matches = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/);
    if (!matches) {
        return [];
    }
    if (matches.length < 2) {
        return [];
    }
    var names = matches[1]
        .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
        .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
};