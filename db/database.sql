DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;
USE employees;

Create Table department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

Create Table role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    CONSTRAINT department_id FOREIGN KEY (department_id) References department(id) on delete cascade
);

Create Table employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) UNIQUE NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    CONSTRAINT manager_id FOREIGN KEY (manager_id) References employee(id) on delete set null
);