var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require ('cli-table');
var chosenProduct;
var subtotal = 0;
var quantitySelected;
var total;
var currentRevenue;

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
    init();
});

function init() {
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
    connection.query(query, function (err, results) {
        if (err) throw err;
        var tableSale = new Table ({
            head: ["Item id", "Product", "Department", "Price", "Stock Quantity"],
            colWidths: [20,35,20,20,20]
        });
            for (var i = 0; i < results.length; i++) {
                tableSale.push([results[i].item_id, results[i].product_name, results[i].department_name,
                    results[i].price, results[i].stock_quantity])
            }
            console.log(tableSale.toString());
        buyOrNot();
    })

}


function buyOrNot() {
    inquirer
        .prompt([
            // Here we ask the user to confirm.
            {
                type: "confirm",
                message: "Do you want to buy anything?",
                name: "confirm",
                default: true
            }
        ])
        .then(function (inquirerResponse) {
            if (inquirerResponse.confirm) {
                choose();
            } else {
                console.log("\nTHAT'S OKAY. COME BACK SOON.\n");
                connection.end();
            }
        });
}

function choose() {
    // console.log("You chose to buy")
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
                    message: "What would you like to buy?",
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like?",
                }
            ])
            .then(function (answer) {
                quantitySelected = answer.quantity;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenProduct = results[i];
                    }
                }
                if (chosenProduct.stock_quantity >= parseInt(quantitySelected)) {
                    // console.log("go ahead")
                    buy()
                } else {
                    console.log("There are only " + chosenProduct.stock_quantity + " " + chosenProduct.product_name.toUpperCase() + " in stock.")
                    buyMore();
                }
            })
    })
}

function buy() {
    // connection.query("SELECT item_id, price, stock_quantity FROM products WHERE product_name=" + chosenProduct);
    // console.log(chosenProduct);
    var currentStock;
    currentStock = chosenProduct.stock_quantity - quantitySelected;
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
        function (error) {
            if (error) throw err;
        }
    )
    console.log(chosenProduct.product_name.toUpperCase() + " - current stock: " + currentStock);
    subtotal = subtotal + (chosenProduct.price * parseInt(quantitySelected));
    console.log("Subtotal = " + subtotal);
    revenue();
    buyMore();
}

function buyMore() {
    inquirer
        .prompt([
            // Here we ask the user to confirm.
            {
                type: "confirm",
                message: "Do you want to buy anything else?",
                name: "confirm",
                default: true
            }
        ])
        .then(function (inquirerResponse) {
            if (inquirerResponse.confirm) {
                choose();
            } else {
                checkout();
                connection.end();
            }
        });
}

function checkout() {
    total = subtotal;
    console.log("TOTAL = " + total);
    console.log("Thank you for shopping");
    
}

function revenue() {
    // console.log("revenue before " + chosenProduct.product_sales);
    // currentRevenue = chosenProduct.product_sales + (chosenProduct.price * parseInt(quantitySelected));
    // console.log("revenue after sale = " + currentRevenue);
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                product_sales: currentRevenue
            },
            {
                item_id: chosenProduct.item_id
            }
        ],
        function (error) {
            if (error) throw err;
        }
    )
}



