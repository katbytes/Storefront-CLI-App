// npm package to connect to db
var mysql = require("mysql");
// npm package to ask some ?s
var inquirer = require("inquirer");
// Chalk Info
const chalk = require("chalk");

// The connection information to the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "radioshack"
});

// Connect to the mysql server and sql database 'radio_shack.sql'
// connection.connect(function(err) {
//   if (err) throw err;
//   console.log("connected as id " + connection.threadId);
//   afterConnection();
// });

const radioOne = chalk.white.bgRed;
const radioTwo = chalk.yellow.dim;
const radioThree = chalk.blue.bold;
const radioFour = chalk.green.dim;

function StartRS() {
  connection.query("SELECT * FROM Products", function(err, res) {
    if (err) throw err;
    console.log(
      radioOne(
        "\n----------------------------------------- Welcome to RadioShack -----------------------------------------\n"
      )
    );
    for (var i = 0; i < res.length; i++) {
      console.log(
        radioThree(
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
        )
      );
      console.log(
        radioTwo(
          "---------------------------------------------------------------------------------------------------------"
        )
      );
    }
    console.log(" ");

    // The app should then prompt users with two messages:
    // 1) Should ask them the ID of the product that they would like to buy
    // 2) Should ask how many units of the product they would like to buy
    inquirer
      .prompt([
        {
          type: "input",
          name: "id",
          message: radioFour(
            "Please type the ID of the product that you would like to purchase today:"
          ),
          // Validate a to make sure the return value is NaN
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          type: "input",
          name: "qty",
          message: radioFour(
            "How many of these would you like to purchase today?:"
          ),
          // Validate a to make sure the return value is NaN
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        const idFilter = res.filter(function(product) {
          return product.item_id === parseInt(answer.id);
        });
        if (idFilter.length === 0) {
          console.log("Invalid ID Number");

          setTimeout(StartRS, 2000);
          // StartRS();
        } else {
          var whatIsPurchas = answer.id - 1;
          var qtyOfPurchase = parseInt(answer.qty);
          var totalOfPurchase = parseFloat(
            (res[whatIsPurchas].price * qtyOfPurchase).toFixed(2)
          );

          // Verfify that the qty is in stock
          if (res[whatIsPurchas].stock_quantity >= qtyOfPurchase) {
            // Updates qty in Products after purchase
            connection.query(
              "UPDATE Products SET ? WHERE ?",
              [
                {
                  stock_quantity:
                    res[whatIsPurchas].stock_quantity - qtyOfPurchase
                },
                { item_id: answer.id }
              ],
              function(err, result) {
                if (err) throw err;
                console.log(
                  "Success! Your total is $" +
                    totalOfPurchase.toFixed(2) +
                    ". Your item(s) will be shipped to you in 3-5 business days."
                );
              }
            );
            // connection.query("SELECT * FROM Departments", function(err, deptRes) {
            //   if (err) throw err;
            //   var index;
            //   for (var i = 0; i < deptRes.length; i++) {
            //     if (
            //       deptRes[i].department_name ===
            //       res[whatIsPurchas].department_name
            //     ) {
            //       index = i;
            //     }
            //   }
            //   // Updating the total_sales in the departments table
            //   connection.query(
            //     "UPDATE Departments SET ? WHERE ?",
            //     [
            //       { total_sales: deptRes[index].total_sales + totalOfPurchase },
            //       { department_name: res[whatIsPurchas].department_name }
            //     ],
            //     function(err, deptRes) {
            //       if (err) throw err;
            //       // console.log("Updated Dept Sales.");
            //     }
            //   );
            // });
          } else {
            console.log(
              "Well, this is embarrassing. It appears that RadioShack is out of that item."
            );
          }
        }
        reprompt();
      });
  });
}

// Ask if they would like to purchase additional items
function reprompt() {
  inquirer
    .prompt([
      {
        type: "checkbox",
        name: "reply",
        message: "Would you like to purchase another item?",
        choices: ["Keep Shopping", "No"]
      }
    ])
    .then(function(answer) {
      // console.log(answer);
      if (answer === "Keep Shopping") {
        StartRS();
      } else {
        console.log("Thank you! Come again!");
      }
    });
}
StartRS();
