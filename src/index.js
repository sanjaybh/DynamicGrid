import "./styles.css";

var grid = require("./grid.js");

var gridParent = document.querySelector(".example-grid-parent");

var gridObject = grid.initializeGrid("myDataGrid", gridParent, {
  title: "My Grid",
  data: [
    { name: "Jon Doe", gender: "male", age: 35 },
    { name: "Jane Doe", gender: "female", age: 30 }
  ],
  columnModel: [
    {
      title: "User Name",
      column: "name",
      width: "200px",
      align: "left"
    },
    {
      title: "Gender",
      column: "gender",
      width: "100px",
      align: "left",
      renderer: function(value, row) {
        switch (value) {
          case "male":
            return "👨";
          case "female":
            return "👩";
          default:
            return value;
        }
      }
    },
    {
      title: "Age",
      column: "age",
      width: "100px",
      align: "right"
    }
  ],
  height: "500px"
});

gridObject.gridElement.addEventListener("rowclick", function(event) {
  console.log("clicked row: ", event.detail);
});

//set data any time
gridObject.setData([
  { name: "Ramesh", gender: "male", age: 20 },
  { name: "Surekha", gender: "female", age: 11 }
]);

//gridObject.destroy(); /* Destory grid */

console.log(gridObject);
