const connection = require("./connection");

function viewEmployees() {
    connection.query('SELECT * FROM employees', (err, results) => {
        if (err) throw err;

        var employees = [];

        results.forEach(({ID, FIRST_NAME, LAST_NAME}) => {

            employees.push(`${ID}. ${FIRST_NAME} ${LAST_NAME}\n`);
        })
        return employees;
    })
}

module.exports = viewEmployees;