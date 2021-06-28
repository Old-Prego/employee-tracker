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
    const roles = await db.findAllRoles();
    const employees = await db.findAllEmployees();

    const employee = await prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ]);

    const roleList = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleID } = await prompt({
        type: "list",
        name: "roleID",
        message: "What role would you like to assign to the employee?",
        choices: roleList
    });

    employee.role_id = roleID;

    const managerList = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    managerList.unshift({ name: "None", value: null });

    const { managerID } = await prompt({
        type: "list",
        name: "managerID",
        message: "Who is the manager for this employee?",
        choices: managerList
    });

    employee.manager_id = managerID;

    await db.createEmployee(employee);

    console.log("The new employee has been added to the database!");

    mainMenu();
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
    const dept = await prompt([
        {
            name: "name",
            message: "What is the name of the department you would like to add?"
        }
    ]);

    await db.createDepartment(dept);

    console.log("The new department has been added!");

    mainMenu();
}

async function viewDepartments(){
    const depts = await db.findAllDepartments();

    console.log("\n");
    console.table(depts);

    mainMenu();
}

function exitMenu() {
    process.exit();
}