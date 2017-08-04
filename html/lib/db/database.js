import PouchDB from "pouchdb";

const windowPort = window.location.port === "5000"
    ? "5984"
    : window.location.port

const portStr = windowPort
    ? ":"+windowPort
    : "";

const url = window.location.protocol+"//"+window.location.hostname+portStr+"/ajexpenditor"

var db = new PouchDB(url)

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

export function getEvents(skip) {
    return db.query('ajexpenditor/events',{
        include_docs : true,
        descending: true,
        limit: 20,
        skip: skip
    }).then(data=> data.rows.map(row=>row.doc))
}

export function post(doc){
    return db.post(doc);
}