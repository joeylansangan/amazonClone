# Amazon Clone

A *Node.js* program that mimics the functionality of an Amazon shopping cart. 

This application uses the [Inquirer](https://www.npmjs.com/package/inquirer) API and utilizes *MySQL* database to simulate a working online store.

With the program, the user can select an item to purchase base on a list of available items for sale. The program then reads the MySQL data and checks whether the item with given quantity desired by user is in stock. If the user inputs a quantity larger than available quantity in stock, thRe program will exit.

### How to run app

1. Go to Terminal in VS Code command line and install required packages:
 >* [MySQL](https://www.npmjs.com/package/mysql)

2. Open MySQL Workbench and initialize connection:
 >* Check out documentation for more information [here](https://dev.mysql.com/doc/workbench/en/)

3. Run application as a customer by entering: ```node bamazonCustomer.js```

4. Run application as a manager by entering: ```node bamazonManager.js```

