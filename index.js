const inquirer = require('inquirer');
const db = require('./db');

mainMenu();

async function mainMenu() {
    const { operation } = await inquirer
        .prompt([
            {
                type: "list",
                name: "operation",
                message: "What would you like to access?",
                choices: [
                    {
                        name: "Add New Employee",
                        value: "newEmp"
                    },
                    {
                        name: "Add New Manager",
                        value: "newMgr"
                    },
                    {
                        name: "Add New Department",
                        value: "newDep"
                    },
                    {
                        name: "View Employees",
                        value: "viewEmp"
                    },
                    {
                        name: "View Managers",
                        value: "viewMgr"
                    },
                    {
                        name: "View Departments",
                        value: "viewDepts"
                    },
                    {
                        name: "Update Employee Roles",
                        value: "upRole"
                    }
                ]
            }
        ]);
        
        switch(operation){
            case "newEmp":
                newEmployee();
            case "viewEmp":
                console.log(db.viewEmployees());
            case "viewDepts":
                viewDepartments();
            case "viewMgr":
                viewManagers();
        }
}

async function newEmployee() {
    const employee = await inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?"
            },
            {
                type: 'input',
                name: 'last_name',
                message: "What is the employee's last name?"
            }
        ])
}