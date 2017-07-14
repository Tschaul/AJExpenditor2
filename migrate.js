var nano = require('nano')('http://localhost:5984');



const dataPath = "/home/julian/Desktop/events.json";

var events = require(dataPath);

//console.log(events[0]);

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

nano.db.destroy('ajexpenditor',function(){

    nano.db.create('ajexpenditor',function(){

        var db = nano.db.use('ajexpenditor');

        events.forEach(event=>{

            db.insert(event, function(err, body){
                if(!err){
                    console.log("success");
                }
            });
        })
    })
})

