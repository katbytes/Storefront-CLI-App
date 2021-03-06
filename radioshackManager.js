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
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "End Session"
        ]
      }
    ])
    .then(function(ans) {
      switch (ans.doThing) {
        case "View Products for Sale":
          viewProducts();
          break;
        case "View Low Inventory":
          viewLowInventory();
          break;
        case "Add to Inventory":
          addToInventory();
          break;
        case "Add New Product":
          addNewProduct();
          break;
        case "End Session":
          console.log("Bye!");
      }
    });
}

// View all of the inventory
function viewProducts() {
  console.log("Viewing Products");

  connection.query("SELECT * FROM Products", function(err, res) {
    if (err) throw err;
    console.log(
      "----------------------------------------------------------------------------------------------------"
    );

    for (var i = 0; i < res.length; i++) {
      console.log(
        "ID: " +
          res[i].item_id +
          " | " +
          "Product: " +
          res[i].product_name +
          " | " +
          "Department: " +
          res[i].department_name +
          " | " +
          "Price: " +
          res[i].Price +
          " | " +
          "QTY: " +
          res[i].stock_quantity
      );
      console.log(
        "--------------------------------------------------------------------------------------------------"
      );
    }

    StartRS();
  });
}

// View the inventory less than 5
function viewLowInventory() {
  console.log("Viewing Low Inventory");

  connection.query("SELECT * FROM Products", function(err, res) {
    if (err) throw err;
    console.log(
      "----------------------------------------------------------------------------------------------------"
    );

    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity <= 5) {
        console.log(
          "ID: " +
            res[i].item_id +
            " | " +
            "Product: " +
            res[i].product_name +
            " | " +
            "Department: " +
            res[i].department_name +
            " | " +
            "Price: " +
            res[i].price +
            " | " +
            "QTY: " +
            res[i].stock_quantity
        );
        console.log(
          "--------------------------------------------------------------------------------------------------"
        );
      }
    }

    StartRS();
  });
}

// Display a prompt to add more of an item to the store
// Asks how much
function addToInventory() {
  console.log("Adding to Inventory");

  connection.query("SELECT * FROM Products", function(err, res) {
    if (err) throw err;
    var itemArray = [];
    //pushes each item into an itemArray
    for (var i = 0; i < res.length; i++) {
      itemArray.push(res[i].product_name);
    }

    inquirer
      .prompt([
        {
          type: "list",
          name: "product",
          choices: itemArray,
          message: "Which item would you like to add inventory?"
        },
        {
          type: "input",
          name: "qty",
          message: "How much would you like to add?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              return false;
            }
          }
        }
      ])
      .then(function(ans) {
        var currentQty;
        for (var i = 0; i < res.length; i++) {
          if (res[i].product_name === ans.product) {
            currentQty = res[i].stock_quantity;
          }
        }
        connection.query(
          "UPDATE Products SET ? WHERE ?",
          [
            { stock_quantity: currentQty + parseInt(ans.qty) },
            { product_name: ans.product }
          ],
          function(err, res) {
            if (err) throw err;
            console.log("The quantity was updated.");
            StartRS();
          }
        );
      });
  });
}

// Allows a manager to add a completely new product to store
function addNewProduct() {
  console.log("Adding New Product");
  var deptNames = [];

  // Grabs the name of departments
  connection.query("SELECT * FROM Departments", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      deptNames.push(res[i].department_name);
    }
  });

  inquirer
    .prompt([
      {
        type: "input",
        name: "product",
        message: "Product: ",
        validate: function(value) {
          if (value) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        type: "list",
        name: "department",
        message: "Department: ",
        choices: deptNames
      },
      {
        type: "input",
        name: "price",
        message: "Price: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        type: "input",
        name: "quantity",
        message: "Quantity: ",
        validate: function(value) {
          if (isNaN(value) == false) {
            return true;
          } else {
            return false;
          }
        }
      }
    ])
    .then(function(ans) {
      connection.query(
        "INSERT INTO Products SET ?",
        {
          product_name: ans.product,
          department_name: ans.department,
          Price: ans.price,
          stock_quantity: ans.quantity
        },
        function(err, res) {
          if (err) throw err;
          console.log("Another item was added to the store.");
        }
      );
      StartRS();
    });
}

StartRS();
