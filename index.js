const inquirer = require('inquirer');
const db = require('./db');
const { prompt } = require('inquirer');
require("console.table");

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
                        name: "Add New Role",
                        value: "newRol"
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
                        name: "View Roles",
                        value: "viewRol"
                    },
                    {
                        name: "Update Employee Roles",
                        value: "updEmpRol"
                    },
                    
                ]
            }
        ]);
        
        switch(operation){
            case "newEmp":
                newEmployee();
            case "newMgr":
                newManager();
            case "newDep":
                newDept();
            case "newRol":
                newRole();
            case "viewEmp":
                viewEmployees();
            case "viewDepts":
                viewDepartments();
            case "viewMgr":
                viewManagers();
            case "viewRol":
                viewRoles();
            case "updEmpRol":
                updEmpRol();
            default:
                return exitMenu();
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

async function viewEmployees() {
    const employees = await db.findAllEmployees();

    console.log("\n");
    console.table(employees);

    mainMenu();
}

async function updEmpRol(){
    const employees = await db.findAllEmployees();

    const empList = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { empID } = await prompt([
        {
            type: "list",
            name: "empID",
            message: "Which employee's role do you want to update?",
            choices: empList
        }
    ]);

    const roles = await db.findAllRoles();

    const roleChoices = roles.map(({ id, title}) => ({
        name: title,
        value: id
    }));

    const { roleID } = await prompt([
        {
            type: "list",
            name: "roleID",
            message: "Which role would you like to set?",
            choices: roleChoices
        }
    ]);

    await db.updateEmployeeRole(empID, roleID);

    console.log("The Employee's role has been updated.");

    mainMenu();
}

async function newDept(){
    
}

function exitMenu() {
    process.exit();
}