// npm package to connect to db
var mysql = require("mysql");
// npm package to ask some ?s
var inquirer = require("inquirer");

// The connection information to the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "radioshack"
});

function StartRS() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "doThing",
        message: "What would you like to do?",
        choices: [
          "View Product Sales by Department",
          "Create New Department",
          "End Session"
        ]
      }
    ])
    .then(function(ans) {
      switch (ans.doThing) {
        case "View Product Sales by Department":
          viewProductByDept();
          break;
        case "Create New Department":
          createNewDept();
          break;
        case "End Session":
          console.log("Bye!");
      }
    });
}

// View product sales by department
function viewProductByDept() {
  // Prints the items for sale and their details
  connection.query("SELECT * FROM Departments", function(err, res) {
    if (err) throw err;
    console.log("Product Sales by Department");
    console.log(
      "----------------------------------------------------------------------------------------------------"
    );

    for (var i = 0; i < res.length; i++) {
      console.log(
        "Department ID: " +
          res[i].department_id +
          " | " +
          "Department Name: " +
          res[i].department_name +
          " | " +
          "Over Head Cost: " +
          res[i].OverHeadCosts.toFixed(2) +
          " | " +
          "Product Sales: " +
          res[i].TotalSales.toFixed(2) +
          " | " +
          "Total Profit: " +
          (res[i].TotalSales - res[i].OverHeadCosts).toFixed(2)
      );
      console.log(
        "--------------------------------------------------------------------------------------------------"
      );
    }
    StartRS();
  });
}

// Create a new department
function createNewDept() {
  console.log("Creating New Department");
  // Prompts to add deptName and numbers. if no value is then by default = 0
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "Department Name: "
      },
      {
        type: "input",
        name: "overHeadCost",
        message: "Over Head Cost: ",
        default: 0,
        validate: function(val) {
          if (isNaN(val) === false) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        type: "input",
        name: "prodSales",
        message: "Product Sales: ",
        default: 0,
        validate: function(val) {
          if (isNaN(val) === false) {
            return true;
          } else {
            return false;
          }
        }
      }
    ])
    .then(function(ans) {
      connection.query(
        "INSERT INTO Departments SET ?",
        {
          department_name: ans.deptName,
          OverHeadCosts: ans.overHeadCost,
          TotalSales: ans.prodSales
        },
        function(err, res) {
          if (err) throw err;
          console.log("Another department has been added");
        }
      );
      StartRS();
    });
}

StartRS();
