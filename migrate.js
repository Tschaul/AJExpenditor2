var nano = require('nano')('http://localhost:5984');

var saveData = true;

var events = require("/home/julian/Desktop/events.json");

events.forEach(event=>{

    event.type ="event";

    event.amountScribble = event.amount;

    event.amount = Math.round(eval(event.amount)*10000);

    event.expenditures.forEach( exp => {

        exp.portion = Math.round(((exp.delta*10000)/event.amount)*100);
        delete exp.delta;
        delete exp.saldo;
        delete exp.amount;

    })

    event.ious.forEach(iou => {
        iou.portion =  Math.round(((iou.delta*10000)/event.amount)*100);
        delete iou.delta;
        delete iou.saldo;
        delete iou.amount;
    })

    delete event.ID;

})

var drafts = require("/home/julian/Desktop/drafts.json");

drafts.forEach(draft=>{

    draft.type ="draft";

    draft.expenditures.forEach( exp => {
        exp.portion = Math.round(eval('1'+exp.amount)*100);
        delete exp.delta;
        delete exp.saldo;
        delete exp.amount;

    })

    draft.ious.forEach(iou => {
        iou.portion = Math.round(eval('1'+iou.amount)*100);
        delete iou.delta;
        delete iou.saldo;
        delete iou.amount;
    })

    delete draft.ID;
    delete draft.amount;
    delete draft.date;
    delete draft.category;
    delete draft.description;

})

var people = require("/home/julian/Desktop/people.json");

people.forEach(person=>{

    person.type ="person";

    delete person.ID;

})

var categories = require("/home/julian/Desktop/categories.json");

categories.forEach(category=>{

    category.type ="category";

    category.fullName = category.longerName;

    delete category.longerName;
    delete category.ID;

})

if(saveData){
nano.db.destroy('ajexpenditor',function(){

    nano.db.create('ajexpenditor',function(){

        var db = nano.db.use('ajexpenditor');

        events.forEach(event=>{

            db.insert(event, function(err, body){
                if(!err){
                    console.log("event saved successfully");
                }
            });
        })

        drafts.forEach(draft=>{

            db.insert(draft, function(err, body){
                if(!err){
                    console.log("draft saved successfully");
                }
            });
        })

        people.forEach(person=>{

            db.insert(person, function(err, body){
                if(!err){
                    console.log("person saved successfully");
                }
            });
        })

        categories.forEach(category=>{

            db.insert(category, function(err, body){
                if(!err){
                    console.log("category saved successfully");
                }
            });
        })
    })
})
}



