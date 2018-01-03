function(doc) {

    if (doc.type === "event") {

        var Event = require('views/lib/event');

        var occurences = Event.getAllOccurences(doc);

        doc.ious.forEach(function (iou) {

            occurences.forEach(function (date) {

                var dateSplit = date.split("-").map(function (s) { return parseInt(s, 10) });


                var amount = Math.round(doc.amount * (iou.portion / 100));
                var key = [iou.borrower, iou.creditor].concat(dateSplit);
                emit(key, amount);
            })

        })
    }
}
