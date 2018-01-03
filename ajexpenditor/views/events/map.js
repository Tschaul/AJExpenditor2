function(doc) {

    if (doc.type === "event") {

        var Event = require('views/lib/event');

        var occurences = Event.getAllOccurences(doc);

        occurences.forEach(function (date) {

            var dateSplit = date.split("-").map(function (s) { return parseInt(s, 10) });

            emit(dateSplit, null);

        })

    }

}
