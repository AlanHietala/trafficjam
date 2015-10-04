var queries = {
     groupByLocation: {
        $group: {_id: '$LOCATION'}
    },
    normalizeCountsForNumberOfMeasurements: {
        $project: {name: 1, normalizedSum: {$divide: ['$volumeSum', '$arteryCount']}}
    },

     forRecordsMatchingDateRange: function(startDate, endDate) {
         var query = {$match: {TIMECOUNT: {$gte: startDate, $lte: endDate}}};
         return query;
    },
     countRows: {
         $group: {_id: null, theCount: {$sum: 1}}
    },
    sumCountsGroupedByArteryCodeAndFirstLocation: {
        $group: {_id: '$ARTERYCODE', volumeSum: {$sum: '$Count'}, arteryCount: {$sum: 1}, name: {$first: '$LOCATION'}}
    },
    greaterThan1NormalizedCount: {
        $match: {normalizedSum: {$gte: 1}}
    }
};

module.exports = queries;