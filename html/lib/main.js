import PouchDB from "pouchdb";

var db = new PouchDB('http://localhost:5984/ajexpenditor');

// db.info().then(function (info) {
//   console.log(info);
// })

db.query('ajexpenditor/people',{
  include_docs : true
}).then(data=>{
    console.log(data.rows)
})
