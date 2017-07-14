import PouchDB from "pouchdb";
import * as React from "react";
import * as ReactDOM from "react-dom";

var db = new PouchDB('http://localhost:5984/ajexpenditor');

// db.info().then(function (info) {
//   console.log(info);
// })

const e = React.createElement;

db.query('ajexpenditor/people',{
  include_docs : true
}).then(data=>{
    console.log(data.rows)
})

var root = document.getElementById('root');

console.log(root);

ReactDOM.render(
  e('div', null, 'Hello World'),
  root
);