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
    displayInventory();
  });

  
  function displayInventory() {
    //Display store items , id ,and price and stock_quantity//

    connection.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        var inventory = "";
        for (var i = 0; i < result.length; i++) {
            inventory = "";
            inventory += "Item ID: " + result[i].item_id + " | ";
            inventory += "Product Name: " + result[i].product_name + " | ";
            inventory += "Department: " + result[i].department_name + " | ";
            inventory += "Price : " + result[i].price + " | ";
            inventory += "Quantity: " + result[i].stock_quantity + "\n";

            console.log(inventory);
        }

        //get total number of products in database from database and update totalproducts//
        totalproducts = parseInt(result.length)
        // console.log(totalproducts);
        renderMenu();
       
    });
}

function renderMenu() {
    //prompt manager menu
    inquirer
      .prompt([
            {
                name: "action",
                type: "list",
                message: "What would you like to do?",
                choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]

            }])
        // switch function that takes in user input
        .then(function (answer) {
            switch (answer.action) {
                case "View Products":
                    displayInventory();
                    break;

                case "View Low Inventory":
                    displayLowInventory();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;

                case "Add New Product":
                    addNewProduct();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}