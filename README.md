# b.amazon

Bamazon is a node.js program that mimics the functionality of an Amazon shopping cart. 

Bamazon uses the [Inquirer](https://www.npmjs.com/package/inquirer) npm package and utilizes mysql database to simulate a working online store.

With the program, the user can select an item to purchase base on a list of available items for sale. The program then reads the mysql data and checks whether the item with given quantity desired by user is in stock. If the user inputs a quantity larger than available quantity in stock, the program will exit.

### To Run App
- Go to Terminal in VS Code command line input: npm install mysql inquirer
- Initialize MySQL database
- Input your own password in bamazonCustomer.js file
- run customer level app with command: node bamazonCustomer.js

