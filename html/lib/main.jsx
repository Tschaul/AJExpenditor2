import * as React from "react";
import * as ReactDOM from "react-dom";

import {db} from "./db/database";

import {TableView} from "./views/TableView"


db.query('ajexpenditor/people',{
  include_docs : true
}).then(data=>{
    console.log(data.rows)
})

ReactDOM.render(
  (<TableView/>),
  document.getElementById('root')
);