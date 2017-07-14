function(doc) {
    if(doc.type==="draft"){
        
        emit(doc.draftDescription,null);

    }
    
}
