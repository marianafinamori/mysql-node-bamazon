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
            choices: ["View Products Sales by Department", "Create New Department"]
        })
        .then(function (answer) {
            if (answer.todo === "View Products Sales by Department") {
                viewDepartments();
            } else if (answer.todo === "Create New Department") {
                addNew();
            }
        })
}

function viewDepartments() {
    var salesArray = [];
    var profitArray = [];
    var profit;
    var query = "SELECT SUM (product_sales) AS sales_by_dep, department_name FROM products GROUP BY department_name"
    connection.query(query, function(err, res) {
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
            salesArray.push(res[i].sales_by_dep);
        }
        // console.log(salesArray);
        })

        var query = "SELECT * FROM departments";
        connection.query(query, function(err, results) {
            for (var i = 0; i < results.length; i++) {
                profitArray.push(salesArray[i] - results[i].over_head_costs);
            }
            // console.log(profitArray);

            var tableDepartments = new Table({
                head: ["Department Id", "Department Name", "Over Head Costs", "Product Sales", "Total Profit"],
                colWidths: [17, 22, 17, 17, 17]
            });
            for (var i = 0; i < results.length; i++) {
                tableDepartments.push([results[i].department_id, results[i]. department_name, results[i].over_head_costs, salesArray[i], profitArray[i]]);
            }
            console.log(tableDepartments.toString());
            anythingElse();
        })
    }

function addNew() {
    inquirer
        .prompt([
            {
                name: "department",
                type: "input",
                message: "What department would you like to create?"
            },
            {
                name: "costs",
                type: "input",
                message: "What is the over head cost of products in this new department?"
            },
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answer.department.toUpperCase(),
                    over_head_costs: answer.costs
                },
                function (err) {
                    if (err) throw err;
                    console.log("DEPARTMENT CREATED SUCCESSFULLY");
                    addProducts();
                }

            )
        })
}

function addProducts() {
    inquirer
        .prompt([
            {
                name: "department",
                type: "input",
                message: "Confirm the name of the department you are adding new products"
            },
            {
                name: "product",
                type: "input",
                message: "What product would you like to add?"
            },
            {
                name: "price",
                type: "input",
                message: "How much this product will be sold for?"
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
                    stock_quantity: answer.stock,
                },
                function (err) {
                    if (err) throw err;
                    console.log("Product successfully added");
                    addOtherProducts();
                }

            )
        })
}

function addOtherProducts() {
    inquirer
        .prompt([
            // Here we ask the user to confirm.
            {
                type: "confirm",
                message: "Do you want to add other products to this department?",
                name: "confirm",
                default: true
            }
        ])
        .then(function (inquirerResponse) {
            if (inquirerResponse.confirm) {
                addProducts();
            } else {
                init();
                
            }
        });
}

function init() {
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