# Amazon Clone

A *Node.js* program that mimics the functionality of an Amazon shopping cart. 

This application uses the [Inquirer](https://www.npmjs.com/package/inquirer) API and utilizes *MySQL* database to simulate a working online store.

With the program, the user can select an item to purchase base on a list of available items for sale. The program then reads the MySQL data and checks whether the item with given quantity desired by user is in stock. If the user inputs a quantity larger than available quantity in stock, thRe program will exit.

### How to run app

1. Go to Terminal in VS Code command line and install required packages:
 >* [MySQL](https://www.npmjs.com/package/mysql)

2. Open MySQL Workbench and initialize connection:
 >* Check out documentation for more information [here](https://dev.mysql.com/doc/workbench/en/)

3. Run application as a customer by entering: ```node bamazonCustomer.js``` <br>
As a customer you can:
 >* View products and available quantity
 >* Add items in a shopping cart

4. Run application as a manager by entering: ```node bamazonManager.js``` <br>
As a manager you can:
 >* View available products by category
 >* Update inventory by adding/removing quantity for new or existing products

View Customer demo [here](https://www.youtube.com/watch?v=pROo1O5pSCY)

View Manager demo [here](https://www.youtube.com/watch?v=IdpGrzhnc74)
