import PouchDB from "pouchdb";

const windowPort = window.location.port === "5000"
    ? "5984"
    : window.location.port

const portStr = windowPort
    ? ":"+windowPort
    : "";

const url = window.location.protocol+"//"+window.location.hostname+portStr+"/ajexpenditor"

var db = new PouchDB(url)

var eventChangeHandlers = [];

db.changes({
    since: 'now',
    live: true,
    include_docs: true
}).on('change', function (change) {
    //console.log("CHANGE",change);
    if(change.doc.type==="event" || change.deleted){
        eventChangeHandlers.forEach(handler => handler());
    }
}).on('error', function (err) {
    //console.log("ERROR FROM CHANGES FEED",err);
});

export function getPeople() {
    return db.query('ajexpenditor/people',{
        include_docs : true
    }).then(data=>data.rows.map(row=>row.doc))
}

export function getCategories() {
    return db.query('ajexpenditor/categories',{
        include_docs : true
    }).then(data=>data.rows.map(row=>row.doc))
}

export function getDrafts() {
    return db.query('ajexpenditor/drafts',{
        include_docs : true
    }).then(data=>data.rows.map(row=>row.doc))
}

export function getEvents(skip,limit) {
    return db.query('ajexpenditor/events',{
        include_docs : true,
        descending: true,
        limit: limit,
        skip: skip
    }).then(data=> data.rows.map(row=>row.doc))
}

export function getExpendituresTotal() {
    return db.query('ajexpenditor/expenditures_total',{
        reduce: true,
        group_level: 1
    }).then(data => data.rows.map(row=>{
        return {
            person: row.key[0],
            value: row.value
        }
    }))
}

export function getIousTotal() {
    return db.query('ajexpenditor/ious_total',{
        reduce: true,
        group_level: 2
    }).then(data => data.rows.map(row=>{
        return {
            borrower: row.key[0],
            creditor: row.key[1],
            value: row.value
        }
    }))
}

export function post(doc){
    return db.post(doc);
}

export function put(doc){
    return db.put(doc);
}

export function remove(id,rev){
    return db.remove(id,rev);
}

export function onEventsChange(handler){
    eventChangeHandlers.push(handler);
}