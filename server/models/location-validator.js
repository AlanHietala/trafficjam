module.exports = function (locationString) {
    isValid = true;
    invalidRegex = /.*([#0-9\(\)]|\sTO\s|\sLEG$|\sRAMP$).*/;
    if(invalidRegex.test(locationString)) {
        isValid = false;
    }
    return isValid;
};