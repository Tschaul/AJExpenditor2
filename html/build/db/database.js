import PouchDB from "pouchdb";

const windowPort = window.location.port === "5000" ? "5984" : window.location.port;

const portStr = windowPort ? ":" + windowPort : "";

const url = window.location.protocol + "//" + window.location.hostname + portStr + "/ajexpenditor";

var db = new PouchDB(url);

var eventChangeHandlers = [];

db.changes({
    since: 'now',
    live: true,
    include_docs: true
}).on('change', function (change) {
    //console.log("CHANGE",change);
    if (change.doc.type === "event" || change.deleted) {
        eventChangeHandlers.forEach(handler => handler());
    }
}).on('error', function (err) {
    //console.log("ERROR FROM CHANGES FEED",err);
});

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

export function getEvents(skip, limit, untilDate) {

    const startkey = untilDate ? [untilDate.getFullYear(), untilDate.getMonth() + 1, untilDate.getDate()] : undefined;

    return db.query('ajexpenditor/events', {
        include_docs: true,
        descending: true,
        limit: limit,
        skip: skip,
        startkey: startkey
    }).then(data => data.rows.map(row => {

        const monthStr = row.key[1] < 10 ? "0" + row.key[1] : row.key[1];

        const dayStr = row.key[2] < 10 ? "0" + row.key[2] : row.key[2];

        return Object.assign(row.doc, { occurenceDate: row.key[0] + "-" + monthStr + "-" + dayStr });
    }));
}

export function getExpendituresTotal(groupLevel) {
    groupLevel = groupLevel || 1;
    return db.query('ajexpenditor/expenditures_total', {
        reduce: true,
        group_level: groupLevel
    }).then(data => data.rows.map(row => {
        return {
            person: row.key[0],
            category: row.key[1],
            year: row.key[2],
            month: row.key[3],
            day: row.key[4],
            value: row.value
        };
    }));
}

export function getIousTotal() {
    return db.query('ajexpenditor/ious_total', {
        reduce: true,
        group_level: 2
    }).then(data => data.rows.map(row => {
        return {
            borrower: row.key[0],
            creditor: row.key[1],
            value: row.value
        };
    }));
}

export function post(doc) {
    return db.post(doc);
}

export function put(doc) {
    return db.put(doc);
}

export function remove(id, rev) {
    return db.remove(id, rev);
}

export function onEventsChange(handler) {
    eventChangeHandlers.push(handler);
}