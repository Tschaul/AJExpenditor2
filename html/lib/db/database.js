import PouchDB from "pouchdb";

var db = new PouchDB('http://localhost:5984/ajexpenditor');

export function getPeople() {
    return db.query('ajexpenditor/people',{
        include_docs : true
    }).then(data=>data.rows.map(row=>row.doc))
}

export function getEvents() {
    return db.query('ajexpenditor/events',{
        include_docs : true,
        descending: true,
        limit: 20,
    }).then(data=> data.rows.map(row=>row.doc))
}