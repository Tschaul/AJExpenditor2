var pwd = process.env.COUCHDB_PASSWORD;

//var nano = require('nano')('http://localhost:5984');
var nano = require('nano')('https://andiundjulian:'+pwd+"@couchdb.tschaul.com");

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

var peopleCount = 0, peopleTotal = people.length;
var categoriesCount = 0, categoriesTotal = categories.length;
var draftsCount = 0, draftsTotal = drafts.length;
var eventsCount = 0, eventsTotal = events.length;

function logState() {
    console.log("events: "+eventsCount+"/"+eventsTotal+" drafts: "+draftsCount+"/"+draftsTotal+" categories: "+categoriesCount+"/"+categoriesTotal+" people: "+peopleCount+"/"+peopleTotal);
}

function insertEvents(db) {
    if(eventsCount<eventsTotal){

        db.insert(events[eventsCount], function(err, body){
            if(!err){
                eventsCount++;
                logState()
                insertEvents(db)
            }
        });
    }
}

if(saveData){
nano.db.destroy('ajexpenditor',function(){

    nano.db.create('ajexpenditor',function(){

        var db = nano.db.use('ajexpenditor');

        // events.forEach(event=>{

        //     db.insert(event, function(err, body){
        //         if(!err){
        //             eventsCount++;
        //             logState()
        //         }
        //     });
        // })

        insertEvents(db)

        drafts.forEach(draft=>{

            db.insert(draft, function(err, body){
                if(!err){
                    draftsCount++;
                    logState()
                }
            });
        })

        people.forEach(person=>{

            db.insert(person, function(err, body){
                if(!err){
                    peopleCount++;
                    logState()
                }
            });
        })

        categories.forEach(category=>{

            db.insert(category, function(err, body){
                if(!err){
                    categoriesCount++;
                    logState()
                }
            });
        })
    })
})
}



