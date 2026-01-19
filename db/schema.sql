-- Dejo las tablas definidas en este archivo por si necesito consultar más adelante
-- También lo tengo en OneNote - 3.1 Diseño esquema Base de datos y 3.2.0 Crear BD y tablas por terminal

-- Comando para crear cada tabla
CREATE TABLE publishers (
    id_publisher SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    country VARCHAR(50)
);

CREATE TABLE games (
    id_game SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    release_date DATE,
    players_num SMALLINT,
    id_publisher INT REFERENCES publishers(id_publisher) ON DELETE SET NULL,
    cover_url VARCHAR(300), 
    rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10)    
);

CREATE TABLE genres (
    id_genre SERIAL PRIMARY KEY,
    name VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE platforms (
    id_platform SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE shops (
    id_shop SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    url_web VARCHAR(200) UNIQUE NOT NULL
);

CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL CONSTRAINT chk_email_pattern CHECK (email LIKE '%@%.%'),
    password VARCHAR(255) NOT NULL

);

CREATE TABLE library (
    id_user INT REFERENCES users(id_user) ON DELETE CASCADE,
    id_game INT REFERENCES games(id_game) ON DELETE CASCADE,
    buy_date DATE DEFAULT CURRENT_DATE,
    played_hours INT DEFAULT 0 CHECK (played_hours >= 0),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'playing', 'completed')),
    personal_rating SMALLINT CHECK (personal_rating >= 1 AND personal_rating <= 10),
    PRIMARY KEY (id_user, id_game)
);

CREATE TABLE games_genres (
    id_game INT REFERENCES games(id_game) ON DELETE CASCADE,
    id_genre INT REFERENCES genres(id_genre) ON DELETE CASCADE,
    PRIMARY KEY (id_game, id_genre)
);

CREATE TABLE games_platforms (
    id_game INT REFERENCES games(id_game) ON DELETE CASCADE,
    id_platform INT REFERENCES platforms(id_platform) ON DELETE CASCADE,
    PRIMARY KEY (id_game, id_platform)
);

CREATE TABLE games_shops (
    id_game INT REFERENCES games(id_game) ON DELETE CASCADE,
    id_shop INT REFERENCES shops(id_shop) ON DELETE CASCADE,
    price DECIMAL(5,2) NOT NULL CHECK (price >= 0),
    in_stock BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_game, id_shop)
);
