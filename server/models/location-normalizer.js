module.exports = function(locationString) {
    var fixedString = locationString.replace('WB E OF', 'AND');
    fixedString = fixedString.replace('W/B E OF', 'AND');

    fixedString = fixedString.replace('E/B W OF', 'AND');
    fixedString = fixedString.replace('EB W OF', 'AND');

    fixedString = fixedString.replace('NB S OF', 'AND');
    fixedString = fixedString.replace('N/B S OF', 'AND');

    fixedString = fixedString.replace('S/B N OF', 'AND');
    fixedString = fixedString.replace('SB N OF', 'AND');

    fixedString = fixedString.replace('E/B E OF', 'AND');
    fixedString = fixedString.replace('EB E OF', 'AND');

    fixedString = fixedString.replace('S/B S OF', 'AND');
    fixedString = fixedString.replace('SB S OF', 'AND');

    fixedString = fixedString.replace('N/B N OF', 'AND');
    fixedString = fixedString.replace('NB N OF', 'AND');

    fixedString = fixedString.replace('W/B W OF', 'AND');
    fixedString = fixedString.replace('WB W OF', 'AND');

    fixedString = fixedString.replace('SB NORTH OF', 'AND');
    fixedString = fixedString.replace('SB SOUTH OF', 'AND');

    fixedString = fixedString.replace('N/B S', 'AND');


    return fixedString;
};