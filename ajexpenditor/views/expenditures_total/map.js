function(doc) {

    if (doc.type === "event") {

        var Event = require('views/lib/event');

        var occurences = Event.getAllOccurences(doc);

        doc.expenditures.forEach(function (exp) {

            occurences.forEach(function (date) {

                var dateSplit = date.split("-").map(function (s) { return parseInt(s, 10) });

                var key = [exp.person, doc.category].concat(dateSplit);

                emit(key, Math.round(doc.amount * (exp.portion / 100)));

            })
            
        });

    }
}
