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
    renderMenu();
  });

//initial number of items in inventory from the database
var totalItems = parseInt(10);

// display available items from database
  function readItems() {
    console.log("\n=======================\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      for (var i = 0; i < res.length; i++) {
        console.log(
            `ID: ${res[i].item_id} || Item: ${res[i].product_name} || Department: ${res[i].department_name} || Price: ${res[i].price} || Quantity: ${res[i].stock_quantity} \n`
        );
      }
      console.log("\n=======================\n");
      renderMenu();
    });
  }

//render manager menu options
function renderMenu() {

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
                    readItems();
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

// display low inventory function
function displayLowInventory() {

    //display products that have less than 5 inventory//
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.log("\n=======================\n");
    // Log items 
      for (var i = 0; i < res.length; i++) {
        console.log(
            `ID: ${res[i].item_id} || Item: ${res[i].product_name} || Department: ${res[i].department_name} || Price: ${res[i].price} || Quantity: ${res[i].stock_quantity} \n`
        );
    
      }

      console.log("\n=======================\n");
    //   menu still renders after items are logged
      renderMenu();

    });
}

// add items to existing inventory function
function addToInventory() {

    // prompt for info on item and quantity to add to inventory//
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "Please enter the ID of the item you want to add: ",
                filter: Number,

                // validation to check ID is a valid integer between 1 and 10
                validate: function(value) {
                    if (!isNaN(value) && (value > 0 && value <= totalproducts)) {
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
                message: "Please enter Quantity of the item you want to add:",
                filter: Number,

                validate: function (value) {
                    if (!isNaN(value)) {
                        return true;
                    } else {
                        console.log(' Please enter a valid number!');
                        return false;
                    }
                }
            }

        ]).then(function (answer) {
        //    variable based on user input
            var itemSelected = (answer.item);

            var quantitySelected = parseInt(answer.quantity);

            // ID verication from mysql database
            connection.query("SELECT * FROM products WHERE ?", [{ item_id: itemSelected }], function (err, res) {
                if (err) throw err;
                
                if (res.length === 0) {
                    console.log("Please enter a valid product ID number!");
                    readItems();

                } else {

                    var item = res[0];
                    
                    console.log(`Your inventory has been updated!`)
                    console.log(`You added ${quantitySelected} ${item.product_name}. You now have ${item.stock_quantity + quantitySelected}  in stock \n`)             
                    console.log("=======================\n")

                    connection.query("UPDATE products SET stock_quantity = " + (item.stock_quantity + quantitySelected)
                        + " WHERE item_id = " + itemSelected), function (err, res) {
                            if (err) throw err;
                        }
                        renderMenu();   
                }

            })
        })
        
}

// add new product to inventory function
function addNewProduct() {

    inquirer
        .prompt([
            {
                name: "item_id",
                type: "input",
                message: "Please enter item ID?",
                filter: Number,
                // validation that ID is more than 10
                validate: function(value){
                    if (value<=totalItems) {
                        console.log("ID already taken")
                        return false;
                    }else if (!isNaN(value) && (parseFloat(value) > 0)) {
                        return true;
                      
                    }else{
                        console.log(" Please enter a valid number!")
                        return false;
                    }
                }
            },
            
            {
                name: "item_name",
                type: "input",
                message: "Please enter new item name:",
            },
            {
                name: "department_name",
                type: "input",
                message: "Please enter department of new item:",

            },
            {
                name: "price",
                type: "input",
                message: "Please enter the price of item:",
                filter: Number,
                // validate as number//
                validate: function (value) {
                    if (isNaN(value) === false && (parseFloat(value) > 0)) {
                        return true;
                    } else {
                        console.log("Please enter a valid number!");
                        return false;
                    }
                }
            },
            {
                name: "stock_quantity",
                type: "input",
                message: "Please enter quantity of item to add to inventory:",
                filter: Number,

                validate: function (value) {
                    if (!isNaN(value)) {
                        return true;
                    } else {
                        console.log(' Please enter a valid number!');
                        return false;
                    }
                }
            }

        ]).then(function (answer) {
               
                // add total number of items in inventory
                totalItems++;
                
                // insert to mysql database
                connection.query("INSERT INTO products SET ?",{
                    item_id: answer.item_id,
                    product_name: answer.item_name,
                    department_name: answer.department_name,
                    price: answer.price,
                    stock_quantity: answer.stock_quantity
                  },
            
                function (err, res) {
                        if (err) throw err;
                        
                        console.log(`Item successfully added to inventory! \n You added ${answer.stock_quantity} ${answer.item_name}/s \n in the ${answer.department_name} department for $${answer.price}`)
                        console.log("\n=======================\n")
                        renderMenu();

                    })
            })  
}
