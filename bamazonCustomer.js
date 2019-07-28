var mysql = require("mysql");
var inquirer = require("inquirer");
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

// Insert your own Password here....
  password: "",

  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  readItems();
});


// display available items from database
function readItems() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    for (var i = 0; i < res.length; i++) {
      console.log(
          `ID: ${res[i].item_id} || Item: ${res[i].product_name} || Department: ${res[i].department_name} || Price: ${res[i].price} || Quantity: ${res[i].stock_quantity} \n`
      );
    }

    buyItems();
  });
}

// User prompt to select desired item to purchase
function buyItems() {
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "Please enter ID of item you want to buy:",
        // validation to check ID is a valid integer between 1 and 10
        validate: function(value) {
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10) {
            return true;
          } else {
            console.log("\nEnter a valid number from 1-10.");
            return false;
          }
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many do you want to buy?",
        // validation to check quantity is a valid integer above 0
        validate: function(value) {
            if (isNaN(value) === false && parseInt(value) > 0) {
            return true;
          } else {
            console.log("\nEnter a valid integer above 0.");
            return false;
          }
        }
      }
    ])
    .then(function(answer) {
      var quantity = answer.quantity;
      var id = answer.item;
    //   console.log(id);
      //   var query1 = "SELECT * FROM products";


    //   queries the database to retrieve the selected item's stock, price, and name
      var query1 = "SELECT stock_quantity, price, product_name FROM products WHERE item_id = ?";
      connection.query(query1, [id], function(err, res) {
        if (err) throw err;

        var currentQuantity = res[0].stock_quantity;
        var price = res[0].price;
        var name = res[0].product_name;

        // check is sufficient quantity is a accessible, or that the user's desired quantity is no greater than the maximum
        if(quantity <= currentQuantity){
            var totalSpent = price*quantity;
            updateQuantity(id, quantity, currentQuantity);
            console.log(`You spent $${totalSpent} for ${quantity} ${name}/s`)
        }
        else{
            console.log(`Sorry, insufficient quantity in stock. There are only ${currentQuantity} ${name}/s available.`)
            connection.end();
        }
        // );
      });
    });
}

/**
 * Updates the item's total stock / quantity depending on how much the user purchased
 * @param {Int} id 
 * @param {Int} quantity 
 * @param {Int} currentQuantity 
 */

function updateQuantity(id, quantity, currentQuantity){
    var quantityLeft = currentQuantity - quantity;
    connection.query( 
        // updated quantity of item on specific column
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: quantityLeft 
          },
          {
            item_id: id
          }
        ],
        function(err, res) {
          if (err) throw err;
          console.log(`There are now only ${quantityLeft} items left`)

        //   user prompt to continue shopping
          inquirer.prompt([{
              name:'confirm',
              type:'confirm',
              message: "Would you like to continue shopping?"
          }
          ]).then(function(answer){

            // checks user's answer
              if(answer.confirm){
                  readItems();
              }
              else{
                connection.end();
              }
          })
        }
      );
}
