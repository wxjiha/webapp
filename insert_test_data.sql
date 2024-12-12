# Insert data into the tables

USE webapp;

INSERT INTO items (name, price)
VALUES('Lengthaning Mascara', 00.18),('Volumising Mascara', 00.20), ('Curling Mascara', 00.16) ;

INSERT INTO users (username, hashed_password, email) 
VALUES  ('johndoe13', '$2b$10$EXAMPLEHASHEDPASSWORD', 'johndoe@test.com'),
        ('starana!','&33b4hb%SECONDEXAMPLE&35dh£', 'anasinclair3@test.com');