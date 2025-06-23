
CREATE DATABASE IF NOT EXISTS elecciones;
USE elecciones;

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
    departamento VARCHAR(100), -- Puede ser cambiado a FK(Departamento.id) si se desea más normalización
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

-- Tabla Circuito
CREATE TABLE Circuito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zona VARCHAR(100),
    tipo VARCHAR(50),
    accesible BOOLEAN,
    direccion VARCHAR(255),
    listaCredenciales TEXT,
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
    PRIMARY KEY (idCircuito, idEleccion),
    FOREIGN KEY (idCircuito) REFERENCES Circuito(id),
    FOREIGN KEY (idEleccion) REFERENCES Eleccion(id)
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
    ci VARCHAR(15),
    fecha DATE,
    hora TIME,
    estado ENUM('valido', 'anulado', 'blanco'),
    esObservado BOOLEAN,
    fueEmitido BOOLEAN,
    idEleccion INT,
    idCircuito INT,
    PRIMARY KEY (ci, idEleccion, idCircuito),
    FOREIGN KEY (ci) REFERENCES Votante(ci),
    FOREIGN KEY (idEleccion) REFERENCES Eleccion(id),
    FOREIGN KEY (idCircuito) REFERENCES Circuito(id)
);

ALTER TABLE Circuito_Eleccion
ADD COLUMN mesaCerrada BOOLEAN DEFAULT FALSE;
