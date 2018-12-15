DROP DATABASE IF EXISTS radioshack;
CREATE DATABASE radioshack;
USE radioshack;

CREATE TABLE Products(
item_id INTEGER(11) NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT(10) NOT NULL,
primary key(item_id)
);

select * from Products;

INSERT INTO Products(product_name,department_name,price,stock_quantity)
VALUES ("RadioShack Echo (2nd Gen)","Electronics",119.99,21),
("RadioShack Echo Dot (3rd Gen)","Electronics",119.99,12),
("Instant Pot Pressure Cooker","Kitchen",99.95,2),
("TechMate MagGrip Mount","Cell Phones & Accessories",119.99,1),
("Firey HD tablet","Computers & Accessories",59.99,33),
("SunDisk 32GB UC Memory","Computers & Accessories",9.65,42),
("Soni Extra Bass Bluetooth Headphones","Electronics",78.00,9),
("iRob Roomka Robotic Vacuum Cleaner","Home & Kitchen",248.00,37),
("Unker Bluetooth SoundBuds","Electronics",25.99,11),
("Kundle Paperwhite","Electronics",99.99,4);


-- CREATE TABLE Departments(
-- department_id INT NOT NULL AUTO_INCREMENT,
-- department_name VARCHAR(50) NOT NULL,
-- OverHeadCosts DECIMAL(10,2) NOT NULL,
-- TotalSales DECIMAL(10,2) NOT NULL,
-- PRIMARY KEY(department_id));

-- INSERT INTO Departments(department_name, over_head_costs, total_sales)
-- VALUES ('Electronics', 40000.00, 12000.00),
-- ('Computers & Accessories', 60000.00, 7000.00),
-- ('Cell Phones & Accessories', 20000.00, 13000.00),
-- ('Home & Kitchen', 1000.00, 17000.00),
-- ('Kitchen', 1100.00, 12000.00);
