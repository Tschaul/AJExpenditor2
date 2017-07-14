function(doc) {
    if(doc.type==="event"){
        

            var dateSplit = doc.date.split("-").map(function(s){return parseInt(s, 10)});

            emit(dateSplit,null);

    }
    
}
