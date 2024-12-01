# Create database script for webapp

# Create the database
CREATE DATABASE IF NOT EXISTS webapp;
USE webapp;

# Create the tables
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT,
    name VARCHAR(50),
    price DECIMAL(5, 2) unsigned,
    PRIMARY KEY(id));

# Create the app user
CREATE USER IF NOT EXISTS 'app_user'@'localhost' IDENTIFIED BY 'qwerty'; 
GRANT ALL PRIVILEGES ON webapp.* TO ' app_user'@'localhost';

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,   
    username VARCHAR(50) NOT NULL UNIQUE, 
    hashed_password VARCHAR(255) NOT NULL, 
    email VARCHAR(100) NOT NULL UNIQUE,    
);