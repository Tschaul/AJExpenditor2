/**
 * Map function - use `emit(key, value)1 to generate rows in the output result.
 * @link http://docs.couchdb.org/en/latest/couchapp/ddocs.html#reduce-and-rereduce-functions
 *
 * @param {object} doc - Document Object.
 */
function(doc) {
    if(doc.type==="event"){
        for (var x = 0; x < doc.expenditures.length; x++) {

            var dateSplit = doc.date.split("-").map(function(s){return parseInt(s, 10)});

            var key = [doc.expenditures[x].person,doc.category].concat(dateSplit);

            emit(key, doc.expenditures[x].portion*doc.amount);
        }
    }
}
