var utils = require("./utils.js");

const gridDefaultConfiguration = {
  title: "Data Table",
  height: "100%",
  width: "100%",
  data: [],
  dataType: "object",
  columnModel: [],
  noDataMessage: "No Data Available",
  defaultOuterStyleClass: "default-table-style"
};

var gridObject, gridElement;

/* Given more time, I would have:

  * Used ES6 Classes or ES prototypes for better code organization
  * Added sorting
  * Added tests
*/

/* Init grid and return grid object */
function initializeGrid(gridName, parentElement, configuration) {
  var config = utils.mergeObjects({}, gridDefaultConfiguration, configuration);
  if (!gridName) {
    throw new Error("Grid name must be provided.");
  }
  if (!parentElement) {
    throw new Error("Parent element must be provided.");
  }

  gridObject = {
    name: gridName,
    gridElement: gridElement,
    parentElement: parentElement,
    config: config,
    setData: setData,
    destroy: destroy
  };

  renderGrid();
  gridObject.gridElement = gridElement;

  return gridObject;
}

function setData(data) {
  const tbodyEl = gridElement.querySelector("tbody");

  // clear tbody
  while (tbodyEl.firstChild) {
    tbodyEl.removeChild(tbodyEl.firstChild);
  }

  createRows(tbodyEl, gridObject.config.columnModel, data);
}

function renderGrid() {
  if (!gridObject.parentElement) {
    throw new Error("Parent element must be provided.");
  }
  var parent = gridObject.parentElement,
    config = gridObject.config;

  //empty the parent element
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }

  //create basic table
  gridElement = utils.createElement("table", [config.defaultOuterStyleClass]);
  gridElement.style.width = config.width;
  parent.style.height = config.height;

  //create column heads
  const theadEl = utils.createElement("thead");
  if (!config.columnModel || !config.columnModel.length) {
    config.columnModel = creteColumnModelFromData(config.data);
  }
  createColumnHeaders(theadEl, config.columnModel);
  gridElement.appendChild(theadEl);

  const tbodyEl = utils.createElement("tbody");
  if (config.data && config.data.length) {
    createRows(tbodyEl, config.columnModel, config.data);
  } else {
    addEmptyMessage(config, tbodyEl);
  }
  gridElement.appendChild(tbodyEl);

  //append table
  parent.appendChild(gridElement);
}

function addEmptyMessage(config, tbodyEl) {
  var td = utils.createElement("td");
  td.textContent = config.noDataMessage;
  td.setAttribute("colspan", config.columnModel.length);
  td.style.textAlign = "center";
  tbodyEl.append(td);
}

function creteColumnModelFromData(data) {
  var columns = Object.keys(data[0]);
  return columns.map(function(column) {
    return {
      title: column,
      column: column
    };
  });
}

function createColumnHeaders(theadEl, columnModel) {
  var trEl = utils.createElement("tr");
  theadEl.append(trEl);
  columnModel.forEach(function(columnDefination) {
    var newColEl = utils.createElement("th");
    newColEl.textContent = columnDefination.title || columnDefination.column;
    trEl.appendChild(newColEl);
  });
}

function createRows(tbodyEl, columnModel, data) {
  data.forEach(function(record, index) {
    var trEl = utils.createElement("tr");
    tbodyEl.append(trEl);

    //row click event handler
    trEl.addEventListener("click", function(event) {
      var rowClickEvent = new CustomEvent("rowclick", {
        detail: {
          record: record,
          index: index,
          rowElement: trEl
        }
      });
      gridElement.dispatchEvent(rowClickEvent);
    });

    //create tds for each datum
    columnModel.forEach(function(model) {
      var newColEl = utils.createElement("td");
      newColEl.style.textAlign = model.align;
      /* Content: render content thru render if any, else render as plain text */
      if (model.renderer) {
        newColEl.innerHTML = model.renderer(record[model.column]);
      } else {
        newColEl.textContent = record[model.column];
      }
      trEl.appendChild(newColEl);
    });
  });
}

function destroy() {
  //event handlers will be removed automatically when elements are garbage collected
  gridObject.parentElement.removeChild(gridObject.parentElement.firstChild);
}

module.exports = {
  initializeGrid: initializeGrid
};
