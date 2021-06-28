const db = require('./db');
const { prompt } = require('inquirer');
require("console.table");
const connection = require("./db/connection");

init();

function init() {
    mainMenu();
}

async function mainMenu() {
    const { operation } = await prompt([
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
                {
                    name: "Exit Menu",
                    value: "EXIT"
                }
                
            ]
        }
    ]);

    switch(operation){
        case "newEmp":
            return newEmployee();
        case "newDep":
            return newDept();
        case "newRol":
            return newRole();
        case "viewEmp":
            return viewEmployees();
        case "viewDepts":
            return viewDepartments();
        case "viewRol":
            return viewRoles();
        case "updEmpRol":
            return updEmpRol();
        case "EXIT":
            return exitMenu();
        default:
            return exitMenu();
    }          
}

async function newEmployee() {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;

        const roleList = res.map(({ id, title }) => ({
            name: title,
            value: id
        }));

        connection.query('SELECT * FROM employee', async (err, res) => {
            if (err) throw err;
    
            const managerList = res.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
    
            managerList.unshift({ name: "None", value: null });

            const employee = await prompt([
                {
                    name: "first_name",
                    message: "What is the employee's first name?"
                },
                {
                    name: "last_name",
                    message: "What is the employee's last name?"
                },
                {
                    type: "list",
                    name: "managerID",
                    message: "Who is the manager for this employee?",
                    choices: managerList
                },
                {
                    type: "list",
                    name: "roleID",
                    message: "What role would you like to assign to the employee?",
                    choices: roleList
                }
            ]);
        
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    role_id: employee.roleID,
                    manager_id: employee.managerID,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log("\n");
                    console.log("Employee created!");
        
                    mainMenu();
                },
            );
        });
    });
}

async function viewEmployees() {
    var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
	ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
	ON m.id = e.manager_id`;

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.log("\n");
        console.table(res);
        console.log("\n");

        mainMenu();
    });
}

async function updEmpRol(){
    connection.query(
        'SELECT * FROM employee',
        (err, res) => {
            if (err) throw err;

            const empList = res.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            connection.query(
                'SELECT * FROM role',
                async (err, res) => {
                    if(err) throw err;

                    const roleList = res.map(({ id, title}) => ({
                        name: title,
                        value: id
                    }));

                    const empRole = await prompt([
                        {
                            type: "list",
                            name: "empID",
                            message: "Which employee's role do you want to update?",
                            choices: empList
                        },
                        {
                            type: "list",
                            name: "roleID",
                            message: "Which role would you like to set?",
                            choices: roleList
                        }
                    ]);

                    connection.query(
                        `UPDATE employee SET role_id = ${empRole.roleID} WHERE id = ${empRole.empID}`,
                        (err, res) => {
                            if (err) throw err;

                            console.log("\n");
                            console.log("The employee's role has been updated!");

                            mainMenu();
                        }
                    );
                }
            ); 
        }
    );
}

async function newDept(){
    const dept = await prompt([
        {
            name: "name",
            message: "What is the name of the department you would like to add?"
        }
    ]);

    connection.query(
        "INSERT INTO department SET ?",
        {
            name: dept.name,
        },
        (err, res) => {
            if (err) throw err;
            console.log("\n");
            console.log("New department has been added!");
            
            mainMenu();
        }
    )
}

async function viewDepartments(){
    var query = "SELECT * FROM department";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);

        mainMenu();
    });
}

async function newRole(){

    var query = 'SELECT * FROM department';

    connection.query(query, async (err, res) => {

        const deptList = res.map(({ id, name}) => ({
            name: name,
            value: id
        }));

        const roleRes = await prompt([
            {
                name: "title",
                message: "What would you like to name this role?"
            },
            {
                name: "salary",
                message: "What salary will this role have?"
            },
            {
                type: "list",
                name: "dept_id",
                message: "Which department does this role fit into?",
                choices: deptList
            }
        ]);

        connection.query('INSERT INTO role SET ?',
            {
                title: roleRes.title,
                salary: roleRes.salary,
                department_id: roleRes.dept_id,
            },
            (err, res) => {
                if (err) throw err;
                console.log("\n");
                console.log("Role created!");

                mainMenu();
            },
        );
    });
}

async function viewRoles() {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);

        mainMenu();
    });
}

function exitMenu() {
    process.exit();
}