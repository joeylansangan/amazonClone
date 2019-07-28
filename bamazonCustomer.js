var mysql = require("mysql");
var inquirer = require("inquirer");
// create connection
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

// Insert own password here......
  password: "rootroot",

  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  readItems();
});

// queries bamazon database data and prints the data to the terminal
function readItems() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      for (var i = 0; i < res.length; i++) {
        console.log(
          "ID: " +
            res[i].item_id +
            " || " +
            "Item: " +
            res[i].product_name +
            " || Department: " +
            res[i].department_name +
            " || Price: " +
            res[i].price +
            " || Quantity: " +
            res[i].stock_quantity +
            "\n"
        );
      }
  
      buyItems();
    });
  }

// Prompts user which Items to buy
function buyItems() {
    inquirer
      .prompt([
         //select item prompt 
        {
          name: "item",
          type: "input",
          message: "Please enter the ID of the item you want to purchase?",
          // ID integer validation
          validate: function(value) {
            // const itemPrompt = isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10 ? "\nEnter a valid number from 1-10." : "\nEnter a valid number from 1-10."; 
            // console.log(itemPrompt);
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10) {
            return true;
          } else {
            console.log("\nEnter a valid integer from 1-10.");
            return false;
          }
        }
       
        },
        // select quantity prompt
        {
          name: "quantity",
          type: "input",
          message: "How many do want to buy?",
          // quantity validation
          validate: function(value) {
            //   if quantity is an integer > 0
              if (isNaN(value) === false && parseInt(value) > 0) {
              return true;
            // prompt user to enter valid number
            } else {
              console.log("\nEnter a valid number above 0.");
              return false;
            }
          }
        }
      ])
      .then(function(answer) {
        // variables based on user input  
        var quantity = answer.quantity;
        var id = answer.item;
  
      //bamazon database query from products table
        var query1 = "SELECT stock_quantity, price, product_name FROM products WHERE item_id = ?";
        connection.query(query1, [id], function(err, res) {
          if (err) throw err;
          
        // variables with bamazon database data
          var currentQuantity = res[0].stock_quantity;
          var price = res[0].price;
          var name = res[0].product_name;
  
          // quantity validation
        //if user desired quantity is < quantity in stock...
          if(quantity <= currentQuantity){
              updateQuantity(id, quantity, currentQuantity);
            //   prompt user purchase summary
              console.log("You spent $"+(price*quantity)+" to buy "+ quantity+" "+name+"/s")
          }
          else{
              console.log("Insufficient quantity available! There is only "+currentQuantity+" available.");
              connection.end();
          }
          // );
        });
      });
  }
  
/**
 Updates the item's total stock / quantity depending on how much the user purchased
 @param {Int} id 
 @param {Int} quantity 
 @param {Int} currentQuantity 
 */

//  update quantity function
function updateQuantity(id, quantity, currentQuantity){
    var quantityLeft = currentQuantity - quantity;
    connection.query( 
        
        // update bamazon mysql database on products table
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

          console.log("There are now only "+quantityLeft+ " items left.")

        //   buy another item prompt
          inquirer.prompt([{
              name:'confirm',
              type:'confirm',
              message: "Do you want to buy another item?"
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
