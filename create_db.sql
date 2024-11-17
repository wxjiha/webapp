# Create database script for webapp

# Create the database
CREATE DATABASE IF NOT EXISTS webapp;
USE webapp;

# Create the tables
CREATE TABLE IF NOT EXISTS books (id INT AUTO_INCREMENT,name VARCHAR(50),price DECIMAL(5, 2) unsigned,PRIMARY KEY(id));

# Create the app user
CREATE USER IF NOT EXISTS 'web_app'@'localhost' IDENTIFIED BY 'qwerty'; 
GRANT ALL PRIVILEGES ON webapp.* TO ' web_app'@'localhost';