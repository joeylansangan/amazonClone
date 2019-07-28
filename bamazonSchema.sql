DROP DATABASE IF EXIST bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(60) NULL,
  department_name VARCHAR(60) NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_quantity INT NOT NULL DEFAULT 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) values
("invisible shades", "Sports & Outdoors", 349.99, 2),
("digital gloves", "Kids & Baby", 89.99, 93),
("soil piece", "Farming", 0.99, 9000),
("Angel may Laugh", "Video Games", 15.00, 250),
("Mega Diapers", "Movies", 7.99, 6),
("Lion mane", "Beauty & Health", 199.99, 18),
("Nokia 3310", "Automotive & Industrial", 149.99, 85),
("Black Pantene", "Video Games", 59.99, 65),
("Healing Salve", "Beauty & Health", 1499.99, 4),
("Hot Kettle bell set", "Sports & Outdoors", 79.99, 30);


SELECT * FROM products;

