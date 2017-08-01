import PouchDB from "pouchdb";

var db = new PouchDB('http://localhost:5984/ajexpenditor');

export function getPeople() {
    return db.query('ajexpenditor/people', {
        include_docs: true
    }).then(data => data.rows.map(row => row.doc));
}

export function getCategories() {
    return db.query('ajexpenditor/categories', {
        include_docs: true
    }).then(data => data.rows.map(row => row.doc));
}

export function getDrafts() {
    return db.query('ajexpenditor/drafts', {
        include_docs: true
    }).then(data => data.rows.map(row => row.doc));
}

export function getEvents(skip) {
    return db.query('ajexpenditor/events', {
        include_docs: true,
        descending: true,
        limit: 20,
        skip: skip
    }).then(data => data.rows.map(row => row.doc));
}