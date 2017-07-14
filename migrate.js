var nano = require('nano')('http://localhost:5984');



var events = require("/home/julian/Desktop/events.json");

events.forEach(event=>{

    event.type ="event";

    event.amount = eval(event.amount);

    event.expenditures.forEach( exp => {
        exp.portion = exp.delta/event.amount;
        delete exp.delta;
        delete exp.saldo;
        delete exp.amount;

        // if(!exp.person){
        //     console.log(event);
        // }

    })

    event.ious.forEach(iou => {
        iou.portion = iou.delta/event.amount;
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
        exp.portion = eval('1'+exp.amount);
        delete exp.delta;
        delete exp.saldo;
        delete exp.amount;

    })

    draft.ious.forEach(iou => {
        iou.portion = eval('1'+iou.amount);
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

