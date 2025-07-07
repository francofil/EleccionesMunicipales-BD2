DROP DATABASE IF EXISTS eleccionesmunicipales;
CREATE DATABASE IF NOT EXISTS eleccionesmunicipales;
USE eleccionesmunicipales;

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

-- Tabla Partido
CREATE TABLE Partido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    direccion VARCHAR(255),
    autoridades TEXT
);

-- Tabla Papeleta (superclase)
CREATE TABLE Papeleta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    color VARCHAR(30),
    eleccion INT,
    idPartido INT,  -- <== NUEVO
    FOREIGN KEY (eleccion) REFERENCES Eleccion(id),
    FOREIGN KEY (idPartido) REFERENCES Partido(id)
);


-- Subclases de Papeleta
CREATE TABLE Lista (
    id INT PRIMARY KEY,
    organo VARCHAR(50),
    departamento VARCHAR(100),
    FOREIGN KEY (id) REFERENCES Papeleta(id)
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
    ci VARCHAR(15) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
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

-- Mesa
CREATE TABLE Mesa (
    id INT AUTO_INCREMENT PRIMARY KEY
);

-- Integrantes posibles de mesa (con rol y organismo)
CREATE TABLE IntegranteMesa (
    ci VARCHAR(15) PRIMARY KEY,
    rol VARCHAR(50),
    organismo VARCHAR(100),
    FOREIGN KEY (ci) REFERENCES Votante(ci)
);

-- Relación N:N entre Mesa e IntegranteMesa
CREATE TABLE Mesa_Integrante (
    idMesa INT,
    ciIntegrante VARCHAR(15),
    PRIMARY KEY (idMesa, ciIntegrante),
    FOREIGN KEY (idMesa) REFERENCES Mesa(id),
    FOREIGN KEY (ciIntegrante) REFERENCES IntegranteMesa(ci)
);

-- Establecimiento
CREATE TABLE Establecimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50)
);

-- Circuito
CREATE TABLE Circuito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zona VARCHAR(100),
    tipo VARCHAR(50),
    accesible BOOLEAN,
    direccion VARCHAR(255),
    idEstablecimiento INT,
    idDepartamento INT,
    FOREIGN KEY (idEstablecimiento) REFERENCES Establecimiento(id),
    FOREIGN KEY (idDepartamento) REFERENCES Departamento(id)
);

-- Relación N:N entre Circuito y Elección
CREATE TABLE Circuito_Eleccion (
    idCircuito INT,
    idEleccion INT,
    idMesa INT,
    ciAgente VARCHAR(15),
    mesaCerrada BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (idCircuito, idEleccion),
    FOREIGN KEY (idCircuito) REFERENCES Circuito(id),
    FOREIGN KEY (idEleccion) REFERENCES Eleccion(id),
    FOREIGN KEY (idMesa) REFERENCES Mesa(id),
    FOREIGN KEY (ciAgente) REFERENCES Agente(ci)
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

-- Tabla Voto
CREATE TABLE Voto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idEleccion INT,
    idCircuito INT,
    idpapeleta INT,
    fueEnBlanco BOOLEAN,
    fueAnulado BOOLEAN,
    fecha DATE,
    FOREIGN KEY (idEleccion) REFERENCES Eleccion(id),
    FOREIGN KEY (idCircuito) REFERENCES Circuito(id),
    FOREIGN KEY (idPapeleta) REFERENCES Papeleta(id)
);

-- Elección presidencial
INSERT INTO Eleccion (id, fecha, tipo) VALUES (1, '2025-10-27', 'Presidencial');

-- Departamento y establecimiento
INSERT INTO Departamento (id, nombre) VALUES (1, 'Montevideo');
INSERT INTO Establecimiento (id, tipo) VALUES (1, 'Liceo');
-- Mesas para los circuitos de la eleccion
INSERT INTO Mesa (id) VALUES (1);
INSERT INTO Mesa (id) VALUES (2);

-- Circutos
INSERT INTO Circuito (id, zona, tipo, accesible, direccion, idEstablecimiento, idDepartamento)
VALUES (1, 'Zona 1', 'Ciudad', TRUE, 'Calle 100', 1, 1);
INSERT INTO Circuito (id, zona, tipo, accesible, direccion, idEstablecimiento, idDepartamento)
VALUES (2, 'Zona 2', 'Ciudad', TRUE, 'Calle 200', 1, 1);

-- Votante agente
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('10000001', 'A100001', 'Carlos', 'Agente', '1980-01-01');
INSERT INTO Comisaria (id, idDepartamento) VALUES (1, 1);
INSERT INTO Agente (ci, idComisaria) VALUES ('10000001', 1);

-- Votante Presidente Asignacion a mesa
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('10000002', 'A100002', 'Patricia', 'Mesa', '1975-06-15');
INSERT INTO IntegranteMesa (ci, rol, organismo) VALUES ('10000002', 'Presidente', 'MIDES');
INSERT INTO Mesa_Integrante (idMesa, ciIntegrante)
VALUES (1, '10000002');
INSERT INTO Mesa_Integrante (idMesa, ciIntegrante)
VALUES (2, '10000002');

-- Relacion circuitos -elecciones
INSERT INTO Circuito_Eleccion (idCircuito, idEleccion, idMesa, mesaCerrada)
VALUES (1, 1, 1, FALSE);
INSERT INTO Circuito_Eleccion (idCircuito, idEleccion, idMesa, mesaCerrada)
VALUES (2, 1, 2, FALSE);


-- Insercion VOTANTES
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000000', 'A200000', 'Nombre1', 'Apellido1', '1998-08-10');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000001', 'A200001', 'Nombre2', 'Apellido2', '2002-10-03');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000002', 'A200002', 'Nombre3', 'Apellido3', '2005-05-14');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000003', 'A200003', 'Nombre4', 'Apellido4', '1998-03-02');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000004', 'A200004', 'Nombre5', 'Apellido5', '2009-03-04');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000005', 'A200005', 'Nombre6', 'Apellido6', '2000-08-08');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000006', 'A200006', 'Nombre7', 'Apellido7', '2000-03-09');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000007', 'A200007', 'Nombre8', 'Apellido8', '1998-04-12');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000008', 'A200008', 'Nombre9', 'Apellido9', '2004-11-07');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000009', 'A200009', 'Nombre10', 'Apellido10', '2012-10-17');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000010', 'A200010', 'Nombre11', 'Apellido11', '1997-10-21');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000011', 'A200011', 'Nombre12', 'Apellido12', '2006-02-08');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000012', 'A200012', 'Nombre13', 'Apellido13', '2017-04-23');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000013', 'A200013', 'Nombre14', 'Apellido14', '2004-01-28');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000014', 'A200014', 'Nombre15', 'Apellido15', '1998-08-09');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000015', 'A200015', 'Nombre16', 'Apellido16', '2013-08-28');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000016', 'A200016', 'Nombre17', 'Apellido17', '2011-02-04');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000017', 'A200017', 'Nombre18', 'Apellido18', '1997-09-14');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000018', 'A200018', 'Nombre19', 'Apellido19', '1994-09-09');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000019', 'A200019', 'Nombre20', 'Apellido20', '1990-03-12');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000020', 'A200020', 'Nombre21', 'Apellido21', '2008-01-09');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000021', 'A200021', 'Nombre22', 'Apellido22', '2001-01-02');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000022', 'A200022', 'Nombre23', 'Apellido23', '2002-10-31');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000023', 'A200023', 'Nombre24', 'Apellido24', '2004-07-24');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000024', 'A200024', 'Nombre25', 'Apellido25', '2001-07-17');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000025', 'A200025', 'Nombre26', 'Apellido26', '1990-11-14');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000026', 'A200026', 'Nombre27', 'Apellido27', '2010-05-18');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000027', 'A200027', 'Nombre28', 'Apellido28', '1991-09-14');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000028', 'A200028', 'Nombre29', 'Apellido29', '2016-03-04');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000029', 'A200029', 'Nombre30', 'Apellido30', '1991-04-26');


-- Insercion de votantes que votan en un circuito de una eleccion
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200000');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200001');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 2, 'A200002');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200003');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200004');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200005');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200006');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200007');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200008');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 2, 'A200009');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 2, 'A200010');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200011');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200012');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 2, 'A200013');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 2, 'A200014');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 2, 'A200015');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200016');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 2, 'A200017');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200018');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 2, 'A200019');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 2, 'A200020');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200021');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200022');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 2, 'A200023');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200024');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 2, 'A200025');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200026');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200027');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200028');
INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200029');

-- Insercion de votos
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200000', '2025-10-27', '08:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200001', '2025-10-27', '09:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200002', '2025-10-27', '010:00:00', FALSE, TRUE, 1, 2);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200003', '2025-10-27', '011:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200004', '2025-10-27', '012:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200005', '2025-10-27', '013:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200006', '2025-10-27', '014:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200007', '2025-10-27', '015:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200008', '2025-10-27', '016:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200009', '2025-10-27', '017:00:00', FALSE, TRUE, 1, 2);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200010', '2025-10-27', '08:00:00', FALSE, TRUE, 1, 2);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200011', '2025-10-27', '09:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200012', '2025-10-27', '010:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200013', '2025-10-27', '011:00:00', FALSE, TRUE, 1, 2);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200014', '2025-10-27', '012:00:00', FALSE, TRUE, 1, 2);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200015', '2025-10-27', '013:00:00', FALSE, TRUE, 1, 2);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200016', '2025-10-27', '014:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200017', '2025-10-27', '015:00:00', FALSE, TRUE, 1, 2);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200018', '2025-10-27', '016:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200019', '2025-10-27', '017:00:00', FALSE, TRUE, 1, 2);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200020', '2025-10-27', '08:00:00', FALSE, TRUE, 1, 2);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200021', '2025-10-27', '09:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200022', '2025-10-27', '010:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200023', '2025-10-27', '011:00:00', FALSE, TRUE, 1, 2);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200024', '2025-10-27', '012:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200025', '2025-10-27', '013:00:00', FALSE, TRUE, 1, 2);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200026', '2025-10-27', '014:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200027', '2025-10-27', '015:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200028', '2025-10-27', '016:00:00', FALSE, TRUE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200029', '2025-10-27', '017:00:00', FALSE, TRUE, 1, 1);

-- Partido
INSERT INTO Partido (id, nombre, direccion, autoridades)
VALUES (1, 'Partido Rojo', 'Calle Rojo 123', 'Presidente: RojoPres, Vice: RojoVice');

INSERT INTO Partido (id, nombre, direccion, autoridades)
VALUES (2, 'Partido Verde', 'Calle Verde 123', 'Presidente: VerdePres, Vice: VerdeVice');

INSERT INTO Partido (id, nombre, direccion, autoridades)
VALUES (3, 'Partido Azul', 'Calle Azul 123', 'Presidente: AzulPres, Vice: AzulVice');


-- Insercion Papeletas
INSERT INTO Papeleta (id, color, eleccion, idPartido) VALUES (1, 'Rojo', 1, 1);
INSERT INTO Papeleta (id, color, eleccion, idPartido) VALUES (2, 'Verde', 1, 2);
INSERT INTO Papeleta (id, color, eleccion, idPartido) VALUES (3, 'Azul', 1, 3);

-- Listas
INSERT INTO Lista (id, organo, departamento)
VALUES (1, 'Presidencia', 'Montevideo');

INSERT INTO Lista (id, organo, departamento)
VALUES (2, 'Presidencia', 'Montevideo');

INSERT INTO Lista (id, organo, departamento)
VALUES (3, 'Presidencia', 'Montevideo');

INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('300001', 'C1000', 'CandidatoRojo', 'ApRojo', '1970-01-01');
INSERT INTO Candidato (ci, idPartido) VALUES ('300001', 1);

INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('300002', 'C2000', 'CandidatoVerde', 'ApVerde', '1970-01-01');
INSERT INTO Candidato (ci, idPartido) VALUES ('300002', 2);

INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('300003', 'C3000', 'CandidatoAzul', 'ApAzul', '1970-01-01');
INSERT INTO Candidato (ci, idPartido) VALUES ('300003', 3);

SELECT * FROM ListaVotacion_Circuito_Eleccion WHERE credencial = 'A200000';

INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000030', 'A200030', 'Nombre30', 'Apellido30', '1991-04-26');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000031', 'A200031', 'Nombre31', 'Apellido31', '1991-04-26');
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES ('20000032', 'A200032', 'Nombre32', 'Apellido32', '1991-04-26');

INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES (1, 1, 'A200032');
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200030', '2025-10-27', '18:00:00', FALSE, FALSE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200031', '2025-10-27', '19:00:00', FALSE, FALSE, 1, 1);
INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
VALUES ('A200032', '2025-10-27', '20:00:00', FALSE, FALSE, 1, 1);

-- Voto válido al Partido Rojo (Papeleta 1)
INSERT INTO Voto (idEleccion, idCircuito, idPapeleta, fueEnBlanco, fueAnulado, fecha)
VALUES (1, 1, 1, FALSE, FALSE, '2025-10-27');

-- Voto válido al Partido Verde (Papeleta 2)
INSERT INTO Voto (idEleccion, idCircuito, idPapeleta, fueEnBlanco, fueAnulado, fecha)
VALUES (1, 1, 2, FALSE, FALSE, '2025-10-27');

-- Voto válido al Partido Azul (Papeleta 3)
INSERT INTO Voto (idEleccion, idCircuito, idPapeleta, fueEnBlanco, fueAnulado, fecha)
VALUES (1, 1, 3, FALSE, FALSE, '2025-10-27');

-- Voto en blanco
INSERT INTO Voto (idEleccion, idCircuito, idPapeleta, fueEnBlanco, fueAnulado, fecha)
VALUES (1, 1, NULL, TRUE, FALSE, '2025-10-27');

-- Voto anulado
INSERT INTO Voto (idEleccion, idCircuito, idPapeleta, fueEnBlanco, fueAnulado, fecha)
VALUES (1, 1, NULL, FALSE, TRUE, '2025-10-27');
INSERT INTO Voto (idEleccion, idCircuito, idPapeleta, fueEnBlanco, fueAnulado, fecha)
VALUES (1, 1, 2, FALSE, FALSE, '2025-10-27');

INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES
('20000033', 'A200033', 'Nombre34', 'Apellido34', '1997-04-04'),
('20000034', 'A200034', 'Nombre35', 'Apellido35', '1996-05-05');

INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES
(1, 2, 'A200031'),
(1, 2, 'A200032'),
(1, 1, 'A200033'),
(1, 2, 'A200034');

-- USUARIOS PRUEBA VOTACION
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES
('20000035', 'A200035', 'Nombre35', 'Apellido35', '1997-06-06'),
('20000036', 'A200036', 'Nombre36', 'Apellido36', '1996-07-07');

INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial)
VALUES
(1, 1, 'A200035'),
(1, 1, 'A200036');

-- ADMIN
INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento)
VALUES
('11111111', 'A111111', 'Admin', 'Roberto', '1997-06-06')
