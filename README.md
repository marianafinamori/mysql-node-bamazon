# mysql-node-bamazon
REQUIREMENTS
- create a "bamazon" database using mysql
- create a "products" table using mysql
- create a "departments" table using my sql
- create a command-line app called "customer.js" that will allow customers to decide to buy, what to buy and how much to buy from a store using the store database
- create a command-line app called manager.js that will allow store managers to check inventory, see which product has low inventory count, add products and create new products.
- create a command-line app called supervisor.js that will allow store supervisors to check profit of each store department and create new departments

TECHNOLOGIES
- Javascript
- node.js
- npm inquirer
- npm mysql
- npm cli-table
- mysql

CODE EXPLANATION
- the database and tables were created using mysql
- the app prompts user in each step to decide which function/action will be called
- sometimes, like when the user decides what to buy and how many unities of it, the user's responses to the prompts are used to make requests from the database
- the data from the database is constantly updated in case the user buys anything or the manager decides to add and create products and the supervisor check profit. The answers to the prompts (inquirer) are used to call specific functions.

VIDEOS USE COMMAND-LINE 
customer.js
https://drive.google.com/file/d/1tXnHd5KL7XLFBN1TskEomxxeY69O5zGe/view?usp=sharing


manager.js
https://drive.google.com/file/d/1jtHBSteFUD0AsI5i3J8kJV1pm23C9b_R/view?usp=sharing


supervisor.js
https://drive.google.com/file/d/1PrXqsR_sCNnNbGXF2RBjLwp1Ir2QvjFj/view?usp=sharing









