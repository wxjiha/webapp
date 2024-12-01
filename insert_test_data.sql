# Insert data into the tables

USE webapp;

INSERT INTO items (name, price)
VALUES('Lengthaning Mascara', 18.25),('Volumising Mascara', 20.00), ('Curling Mascara', 15.99) ;

INSERT INTO users (username, hashed_password, email) 
VALUES  ('johndoe13', '$2b$10$EXAMPLEHASHEDPASSWORD', 'johndoe@test.com'),
        ('starana!','&33b4hb%SECONDEXAMPLE&35dh£', 'anasinclair3@test.com');