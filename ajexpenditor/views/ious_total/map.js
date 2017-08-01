function(doc) {
    if(doc.type==="event"){
        for (var x = 0; x < doc.ious.length; x++) {

            var dateSplit = doc.date.split("-").map(function(s){return parseInt(s, 10)});

            var iou = doc.ious[x];

            var amount = Math.round(doc.amount*(iou.portion/100));
            var key = [iou.borrower,iou.creditor].concat(dateSplit);
            emit(key,amount);

        }
    }
}
