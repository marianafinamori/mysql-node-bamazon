DROP DATABASE IF EXISTS bamazon2;
CREATE database bamazon2;
USE bamazon2;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT(10),
    PRIMARY KEY(item_id)
);

SELECT * FROM products;

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(10,2) NULL,
    PRIMARY KEY(department_id)
);

SELECT * FROM departments;