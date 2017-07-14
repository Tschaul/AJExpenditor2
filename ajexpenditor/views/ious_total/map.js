/**
 * Map function - use `emit(key, value)1 to generate rows in the output result.
 * @link http://docs.couchdb.org/en/latest/couchapp/ddocs.html#reduce-and-rereduce-functions
 *
 * @param {object} doc - Document Object.
 */
function(doc) {
    if(doc.type==="event"){
        for (var x = 0; x < doc.ious.length; x++) {

            var dateSplit = doc.date.split("-").map(function(s){return parseInt(s, 10)});

            var iou = doc.ious[x];

            var amount = iou.portion*doc.amount;
            var key = [iou.borrower,iou.creditor].concat(dateSplit);
            emit(key,amount);

        }
    }
}
