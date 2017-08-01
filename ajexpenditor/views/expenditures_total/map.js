/**
 * Map function - use `emit(key, value)1 to generate rows in the output result.
 * @link http://docs.couchdb.org/en/latest/couchapp/ddocs.html#reduce-and-rereduce-functions
 *
 * @param {object} doc - Document Object.
 */
function(doc) {

    if(doc.type==="event"){

        var dateSplit = doc.date.split("-").map(function(s){return parseInt(s, 10)});

        doc.expenditures.forEach(function(exp) {

            var key = [exp.person,doc.category].concat(dateSplit);

            emit(key, Math.round(doc.amount*(exp.portion/100)));
            
        });

    }
}
