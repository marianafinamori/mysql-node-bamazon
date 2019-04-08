var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require ('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon2"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("Connected to DB!");
    start();
});

function start() {
    inquirer
        .prompt({
            name: "todo",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        })
        .then(function (answer) {
            if (answer.todo === "View Products for Sale") {
                viewProducts();
            } else if (answer.todo === "View Low Inventory") {
                lowInventory();
            } else if (answer.todo === "Add to Inventory") {
                addQuantity();
            } else if (answer.todo === "Add New Product") {
                addNew();
            }
        })
}

function viewProducts() {
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
    connection.query(query, function (err, results) {
        if (err) throw err;
        var tableSale = new Table ({
            head: ["Item id", "Product", "Department", "Price", "Stock Quantity"],
            colWidths: [17,28,17,17,17]
        });
            for (var i = 0; i < results.length; i++) {
                tableSale.push([results[i].item_id, results[i].product_name, results[i].department_name,
                    results[i].price, results[i].stock_quantity])
            }
            console.log(tableSale.toString());
        anythingElse();
    })

}

function lowInventory() {
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, results) {
        if (err) throw err;
        var tableLow = new Table ({
            head: ["Item id", "Product", "Department", "Price", "Stock Quantity"],
            colWidths: [17,28,17,17,17]
        });
            for (var i = 0; i < results.length; i++) {
                tableLow.push([results[i].item_id, results[i].product_name, results[i].department_name,
                    results[i].price, results[i].stock_quantity])
            }
            console.log(tableLow.toString());
        anythingElse();
    })

}


function addQuantity() {
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
    connection.query(query, function (err, results) {
        if (err) throw err;
        var tableSale = new Table ({
            head: ["Item id", "Product", "Department", "Price", "Stock Quantity"],
            colWidths: [17,28,17,17,17]
        });
            for (var i = 0; i < results.length; i++) {
                tableSale.push([results[i].item_id, results[i].product_name, results[i].department_name,
                    results[i].price, results[i].stock_quantity])
            }
            console.log(tableSale.toString());
        addMore();
    })

}

function addMore() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var productsArray = [];
                        for (var i = 0; i < results.length; i++) {
                            productsArray.push(results[i].product_name);
                        }
                        return productsArray;
                    },
                    message: "Which product to want to add more?",
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to add?",
                }
            ])
            .then(function (answer) {
                quantitySelected = answer.quantity;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenProduct = results[i];
                    }
                }
                ///
                // connection.query("SELECT item_id, price, stock_quantity FROM products WHERE product_name=" + chosenProduct);
                // console.log(chosenProduct);
                var currentStock;
                currentStock = parseInt(chosenProduct.stock_quantity) + parseInt(quantitySelected);

                // console.log('query params: ', currentStock, chosenProduct.item_id);

                // console.log(currentStock);
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: currentStock
                        },
                        {
                            item_id: chosenProduct.item_id
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        // console.log("it worked")
                        console.log(chosenProduct.product_name.toUpperCase() + " - current stock: " + currentStock);
                        addEvenMore();
                    }
                );

            })
    })
}

function addEvenMore() {
    inquirer
        .prompt([
            // Here we ask the user to confirm.
            {
                type: "confirm",
                message: "Do you want to add more items?",
                name: "confirm",
                default: true
            }
        ])
        .then(function (inquirerResponse) {
            if (inquirerResponse.confirm) {
                addMore();
            } else {
                anythingElse();
                
            }
        });
}

function addNew() {
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "What product would you like to add?"
            },
            {
                name: "department",
                type: "input",
                message: "What department would you like to add the new product in?"
            },
            {
                name: "price",
                type: "input",
                message: "How much will the new product cost?"
            },
            {
                name: "stock",
                type: "input",
                message: "How many unities of the new product would like to add?"
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.product,
                    department_name: answer.department.toUpperCase(),
                    price: answer.price,
                    stock_quantity: answer.stock
                },
                function (err) {
                    if (err) throw err;
                    console.log("Product successfully added");
                    anythingElse();
                }
            )
        })

}

function anythingElse() {
    inquirer
        .prompt([
            // Here we ask the user to confirm.
            {
                type: "confirm",
                message: "Do you want to do anything else?",
                name: "confirm",
                default: true
            }
        ])
        .then(function (inquirerResponse) {
            if (inquirerResponse.confirm) {
                start();
            } else {
                console.log("\nGOOD BYE.\n");
                connection.end();
            }
        });
}


