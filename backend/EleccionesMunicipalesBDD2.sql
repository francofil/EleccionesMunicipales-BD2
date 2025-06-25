
    CREATE DATABASE IF NOT EXISTS eleccionesmunicipalesbdd2;
    USE eleccionesmunicipalesbdd2;

    -- Tabla Departamento
    CREATE TABLE Departamento (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL
    );

    -- Tabla Comisaria
    CREATE TABLE Comisaria (
        id INT AUTO_INCREMENT PRIMARY KEY,
        idDepartamento INT NOT NULL,
        FOREIGN KEY (idDepartamento) REFERENCES Departamento(id)
    );

    -- Tabla Elección
    CREATE TABLE Eleccion (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATE,
        tipo VARCHAR(50)
    );

    -- Tabla Papeleta (superclase)
    CREATE TABLE Papeleta (
        id INT AUTO_INCREMENT PRIMARY KEY,
        color VARCHAR(30),
        eleccion INT,
        FOREIGN KEY (eleccion) REFERENCES Eleccion(id)
    );

    -- Tabla Partido
    CREATE TABLE Partido (
        id INT AUTO_INCREMENT PRIMARY KEY,
        idPapeleta INT,
        nombre VARCHAR(100),
        direccion VARCHAR(255),
        autoridades TEXT,
        FOREIGN KEY (idPapeleta) REFERENCES Papeleta(id)
    );

    -- Subclases de Papeleta
    CREATE TABLE Lista (
        id INT PRIMARY KEY,
        organo VARCHAR(50),
        departamento VARCHAR(100),
        idPartido INT,
        FOREIGN KEY (id) REFERENCES Papeleta(id),
        FOREIGN KEY (idPartido) REFERENCES Partido(id)
    );

    CREATE TABLE Balotaje (
        id INT PRIMARY KEY,
        FOREIGN KEY (id) REFERENCES Papeleta(id)
    );

    CREATE TABLE Plebiscito (
        id INT PRIMARY KEY,
        FOREIGN KEY (id) REFERENCES Papeleta(id)
    );

    -- Tabla Votante
    CREATE TABLE Votante (
        ci VARCHAR(15) PRIMARY KEY,
        credencial VARCHAR(15) UNIQUE NOT NULL,
        nombre VARCHAR(100),
        apellido VARCHAR(100),
        fecha_nacimiento DATE
    );

    CREATE TABLE Usuario (
        ci VARCHAR(15) PRIMARY KEY,  -- misma cédula que en Votante
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,  -- contraseña hasheada
        rol ENUM('admin', 'presidente') NOT NULL,
        FOREIGN KEY (ci) REFERENCES Votante(ci)
    );

    -- Subclases de Votante
    CREATE TABLE Agente (
        ci VARCHAR(15) PRIMARY KEY,
        idComisaria INT NOT NULL,
        FOREIGN KEY (ci) REFERENCES Votante(ci),
        FOREIGN KEY (idComisaria) REFERENCES Comisaria(id)
    );

    CREATE TABLE Candidato (
        ci VARCHAR(15) PRIMARY KEY,
        idPartido INT NOT NULL,
        FOREIGN KEY (ci) REFERENCES Votante(ci),
        FOREIGN KEY (idPartido) REFERENCES Partido(id)
    );

    -- Mesa e IntegranteMesa
    CREATE TABLE Mesa (
        id INT AUTO_INCREMENT PRIMARY KEY
    );

    CREATE TABLE IntegranteMesa (
        ci VARCHAR(15) PRIMARY KEY,
        rol VARCHAR(50),
        organismo VARCHAR(100),
        idMesa INT,
        FOREIGN KEY (ci) REFERENCES Votante(ci),
        FOREIGN KEY (idMesa) REFERENCES Mesa(id)
    );

    -- Tabla Establecimiento
    CREATE TABLE Establecimiento (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tipo VARCHAR(50)
    );

    -- Tabla Circuito (modificada)
    CREATE TABLE Circuito (
        id INT AUTO_INCREMENT PRIMARY KEY,
        zona VARCHAR(100),
        tipo VARCHAR(50),
        accesible BOOLEAN,
        direccion VARCHAR(255),
        idEstablecimiento INT,
        ciAgente VARCHAR(15),
        idDepartamento INT,
        idMesa INT UNIQUE,
        FOREIGN KEY (idEstablecimiento) REFERENCES Establecimiento(id),
        FOREIGN KEY (ciAgente) REFERENCES Agente(ci),
        FOREIGN KEY (idDepartamento) REFERENCES Departamento(id),
        FOREIGN KEY (idMesa) REFERENCES Mesa(id)
    );

    -- Relación N:N entre Circuito y Elección
    CREATE TABLE Circuito_Eleccion (
    idCircuito INT,
    idEleccion INT,
    mesaCerrada BOOLEAN DEFAULT FALSE,
    ciPresidente VARCHAR(15),  -- cédula del usuario presidente
    PRIMARY KEY (idCircuito, idEleccion),
    FOREIGN KEY (idCircuito) REFERENCES Circuito(id),
    FOREIGN KEY (idEleccion) REFERENCES Eleccion(id),
    FOREIGN KEY (ciPresidente) REFERENCES Usuario(ci)
    );


    -- Lista de votantes habilitados por elección y circuito
    CREATE TABLE ListaVotacion_Circuito_Eleccion (
        idEleccion INT,
        idCircuito INT,
        credencial VARCHAR(15),
        PRIMARY KEY (idEleccion, idCircuito, credencial),
        FOREIGN KEY (idEleccion, idCircuito) REFERENCES Circuito_Eleccion(idEleccion, idCircuito),
        FOREIGN KEY (credencial) REFERENCES Votante(credencial)
    );

    -- Relación N:N entre Establecimiento y Agente
    CREATE TABLE Establecimiento_Agente (
        idEstablecimiento INT,
        idAgente VARCHAR(15),
        PRIMARY KEY (idEstablecimiento, idAgente),
        FOREIGN KEY (idEstablecimiento) REFERENCES Establecimiento(id),
        FOREIGN KEY (idAgente) REFERENCES Agente(ci)
    );

    -- Relación Votante - Circuito_Eleccion con atributos del voto
    CREATE TABLE Votante_Circuito_Eleccion (
    credencial VARCHAR(15),
    fecha DATE,
    hora TIME,
    esObservado BOOLEAN,
    fueEmitido BOOLEAN,
    idEleccion INT,
    idCircuito INT,
    PRIMARY KEY (credencial, idEleccion, idCircuito),
    FOREIGN KEY (credencial) REFERENCES Votante(credencial),
    FOREIGN KEY (idEleccion) REFERENCES Eleccion(id),
    FOREIGN KEY (idCircuito) REFERENCES Circuito(id)
);


-- INSERTS DE PRUEBA ACTUALIZADOS PARA LA BDD

USE eleccionesmunicipalesbdd2;

-- Departamento
INSERT INTO Departamento (nombre) VALUES ('Montevideo');

-- Comisaría
INSERT INTO Comisaria (idDepartamento) VALUES (1);

-- Establecimiento
INSERT INTO Establecimiento (tipo) VALUES ('Liceo');

-- Mesa
INSERT INTO Mesa () VALUES (); -- id = 1
INSERT INTO Mesa () VALUES (); -- id = 2

-- Votantes
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento) VALUES
('10000001', 'A000001', 'Juan', 'Pérez', '1990-01-01'),  -- agente
('10000002', 'A000002', 'Ana', 'Gómez', '1985-01-01'),   -- presidente mesa
('10000003', 'A000003', 'Luis', 'Rodríguez', '1980-01-01'), -- votante 1
('10000004', 'A000004', 'Laura', 'Fernández', '1992-01-01'), -- votante 2
('10000005', 'A000005', 'Mario', 'Silva', '1994-01-01');  -- candidato

-- Usuario (solo para presidente, ejemplo con hash dummy)
INSERT INTO Usuario (ci, username, password, rol) VALUES
('10000002', 'presidente1', '$2b$10$dummyHashPasswordValue12345678', 'presidente');

-- Agente
INSERT INTO Agente (ci, idComisaria) VALUES ('10000001', 1);

-- Integrante de mesa
INSERT INTO IntegranteMesa (ci, rol, organismo, idMesa) VALUES ('10000002', 'Presidente', 'MIDES', 1);

-- Establecimiento - Agente
INSERT INTO Establecimiento_Agente (idEstablecimiento, idAgente) VALUES (1, '10000001');

-- Circuito
INSERT INTO Circuito (
    zona, tipo, accesible, direccion, idEstablecimiento,
    ciAgente, idDepartamento, idMesa
) VALUES (
    'Centro', 'Ciudad', TRUE, 'Av. Italia 1234', 1,
    '10000001', 1, 1
); -- id = 1

-- Elección
INSERT INTO Eleccion (fecha, tipo) VALUES ('2025-07-11', 'Municipal'); -- id = 1

-- Asociación Circuito - Elección con presidente asignado
INSERT INTO Circuito_Eleccion (idCircuito, idEleccion, mesaCerrada, ciPresidente)
VALUES (1, 1, FALSE, '10000002');

-- Lista de habilitados a votar en este circuito/elección
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial) VALUES
(1, 1, 'A000001'),
(1, 1, 'A000002');

-- Papeleta
INSERT INTO Papeleta (color, eleccion) VALUES ('Blanco', 1); -- id = 1

-- Partido
INSERT INTO Partido (idPapeleta, nombre, direccion, autoridades) VALUES
(1, 'Partido Democrático', 'Calle Libertad 123', 'Presidente: Sosa, Vice: Méndez'); -- id = 1

-- Lista
INSERT INTO Lista (id, organo, departamento, idPartido) VALUES
(1, 'Intendencia', 'Montevideo', 1);

-- Candidato
INSERT INTO Candidato (ci, idPartido) VALUES ('10000005', 1);

-- Votos emitidos
INSERT INTO Votante_Circuito_Eleccion (
    credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito
) VALUES
('A000001', '2025-07-11', '10:00:00', FALSE, TRUE, 1, 1),
('A000002', '2025-07-11', '10:15:00', FALSE, TRUE, 1, 1);
