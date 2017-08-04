function(newDoc, oldDoc, userCtx) {
    if(newDoc.type==="event"){

        if(typeof(newDoc.amount)!=="number" || (newDoc.amount % 1) !==0 || newDoc.amount <= 0 || isNaN(newDoc.amount)){
            throw({forbidden:"amount must be a valid positive integer"})
        }

        if(typeof(newDoc.description)!=="string"){
            throw({forbidden:"description must be a string"})
        }

        if(typeof(newDoc.category)!=="string"){
            throw({forbidden:"category must be a string"})
        }

        if(typeof(newDoc.amountScribble)!=="string"){
            throw({forbidden:"amountScribble must be a string"})
        }

        if(typeof(newDoc.date)!=="string" || newDoc.date.length!==10 || newDoc.date.split("-").length!==3){
            throw({forbidden:"date must be a string with format YYYY-MM-DD"})
        }

        if( Object.prototype.toString.call( newDoc.ious ) !== '[object Array]'  ){
            throw({forbidden:"ious must be an array"})
        }

        newDoc.ious.forEach(function(iou){

            if(typeof(iou.borrower)!=="string"){
                throw({forbidden:"borrower must be a string"})
            }

            if(typeof(iou.creditor)!=="string"){
                throw({forbidden:"creditor must be a string"})
            }

            if(typeof(iou.portion)!=="number" || (iou.portion % 1) !==0){
                throw({forbidden:"portion must be a number"})
            }

            if( iou.borrower > iou.creditor ){
                throw({forbidden:"borrower and creditor must be in lexical order"})
            } 

        })

        if( Object.prototype.toString.call( newDoc.expenditures ) !== '[object Array]' ){
            throw({forbidden:"expenditures must be an array"})
        }

        newDoc.expenditures.forEach(function(expenditure){

            if(typeof(expenditure.person)!=="string"){
                throw({forbidden:"person must be a string"})
            }

            if(typeof(expenditure.portion)!=="number"|| (expenditure.portion % 1) !==0){
                throw({forbidden:"portion must be a number"})
            }

        })
    }
}