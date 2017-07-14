function(newDoc, oldDoc, userCtx) {
    if(doc.type==="event"){
        for (var x = 0; x < doc.ious.length; x++) {

            var iou = doc.ious[x];

            if( iou.borrower > iou.creditor ){
                throw({forbidden:"borrower and creditor must be in lexical order"})
            } 

        }
    }
}