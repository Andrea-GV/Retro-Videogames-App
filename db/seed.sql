-- 1. Creo una semilla para popular la base de datos con unos datos iniciales antes de hacer el CRUD
-- \c retro_games_db    -- ⚠️ Conecto con la BD para que sepa dónde introducir estos datos
-- ⚠️❌ Esto me dio error asi que lo quito y ejecuto la conexión directamente,
-- 2. Alimento las tablas maestras
-- 3. Ejecuto el seed por terminal: psql -U postgres -d retro_games_db -f db/seed.sql
-- 4. Hago queries para comprobar que se ha poblado (✅ todo ha ido ok)

-- Publishers --- ✅ Completa de datos
INSERT INTO publishers (name, country) VALUES
('Atari', 'USA'),
('Nintendo', 'Japan'),
('SEGA', 'Japan'),
('Capcom', 'Japan'),
('Konami', 'Japan'),
('Namco', 'Japan'),
('Square', 'Japan'),
('Enix', 'Japan'),
('Sierra On-Line', 'USA'),
('LucasArts', 'USA'),
('Taito', 'Japan'),
('Sony Interactive Entertainment', 'Japan'),
('Microsoft Studios', 'USA');

-- Genres --- ✅ Completa de datos
INSERT INTO genres (name) VALUES
('Acción'),
('Arcade'),
('Aventura'),
('Estrategia'),
('Fantasía'),
('Fighting'),
('Open World'),
('Plataforma'),
('Puzzle'),
('RPG'),
('Sci-Fi'),
('Shooter'),
('Stealth'), 
('Survival');

-- Platforms --- ✅ Completa de datos
INSERT INTO platforms (name) VALUES
('PC'),
('Arcade'),
('Atari 2600'),
('Sega SG-1000'),
('Nintendo NES'),
-- 5
('Nintendo 64'),
('Commodore 64 GS'),
('Sega Mega Drive'),
('Super Nintendo SNES'),
('Game Boy'),
-- 10
('PlayStation'),
('Game Boy Color');
-- Dejo aquí otras por si quiero añadir más
-- ('PlayStation 2'),
-- ('Xbox'),
-- ('Nintendo GameCube'),
-- ('Sega Dreamcast'),
-- ('Game Boy Advance'),
-- ('PlayStation 3'),
-- ('Xbox 360'),
-- ('Nintendo Wii'),

-- Games --- ✅ Completa de datos
INSERT INTO games
(name, release_date, players_num, cover_url, rating, id_publisher)
VALUES
('Pong', '1972-11-29', 2, 'https://upload.wikimedia.org/wikipedia/commons/2/26/Pong.svg', 8.5, 1),
('Space Invaders', '1978-06-01', 1, 'https://en.wikipedia.org/wiki/Space_Invaders_(Atari_2600_video_game)#/media/File:Space-Invaders-Atari-2600-box-art.jpg', 9.0, 11),
('Pac-Man', '1980-05-22', 1, 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Pac-Man_gameplay_%281x_pixel-perfect_recreation%29.png', 9.5, 6),
('Super Mario Bros.', '1985-09-13', 2, 'https://en.wikipedia.org/wiki/Super_Mario_Bros.#/media/File:NES_Super_Mario_Bros.png', 9.8, 2),
('The Legend of Zelda', '1986-02-21', 1, 'https://en.wikipedia.org/wiki/The_Legend_of_Zelda_(video_game)#/media/File:Legend_of_Zelda_NES.PNG', 9.7, 2),
-- 5
('Sonic the Hedgehog', '1991-06-23', 1, 'https://upload.wikimedia.org/wikipedia/en/d/d3/MD_Sonic_the_Hedgehog.png', 9.2, 3),
('Street Fighter II: The World Warrior', '1991-02-06', 2, 'https://www.maniac.de/wp-content/uploads/2017/09/super-street-fighter-2-TEST.jpg',  9.6, 4),
('Dragon Quest',  '1986-05-27', 1, 'https://en.wikipedia.org/wiki/Dragon_Quest_(video_game)#/media/File:Dragon_quest_battle_2.png', 7.2, 8),
('King''s Quest I: Quest for the Crown', '1984-05-10', 1, 'https://retrofreakreviews.com/wp-content/uploads/2017/01/kingsquest.gif', 7.3, 9),
('Final Fantasy VII', '1997-01-31', 1, 'https://upload.wikimedia.org/wikipedia/en/1/1b/FFVIIbattleexample.png', 9.7, 7),
-- 10
('Star Wars: Shadows of the Empire', '1996-12-02', 1, 'https://upload.wikimedia.org/wikipedia/en/d/d7/Shadowsoftheempire_gameplay.jpg', 8.1, 10),
('Metal Gear Solid', '1998-09-03', 1, 'https://upload.wikimedia.org/wikipedia/en/2/25/MGS_screen_psx.jpg', 9.6, 5);

-- Shops --- ✅ Completa de datos
INSERT INTO shops (name, url_web) VALUES
('El corte inglés', 'https://www.elcorteingles.es/videojuegos/'),
('Fnac', 'https://www.fnac.es/juegos/'),
('Mail Soft', 'Catálogo por correo'),   --- Pasó a ser el GAME
('GAME', 'https://www.game.es/'),
('Blockbuster', 'Espacio físico - Videoclub nostálgico'),
('Arcade Salón', 'Espacio físico - Salón de recreativos'),
('Centro Mail', 'Espacio físico - Tienda especializada'),
('Pryca - Carrefour', 'https://www.carrefour.es/gaming/');


-- Users (Con password simple e idéntica) --- ✅ Completa de datos
INSERT INTO users (username, email, password) VALUES
('andrea','andrea@email.com','1234'),
('cristina','cristina@email.com','1234'),
('lucas','lucas@email.com','1234'),
('carlos','carlos@email.com','1234'),
('paula','paula@email.com','1234');

-- Games-Genres (Mario = Plataformas) --- ✅ Completa de datos
INSERT INTO games_genres (id_game, id_genre) VALUES

(1,2), -- pong - arcade
(2,2),(2,11), -- space - arcade y SCI-FI
(3,9),(3,2), -- pacman - puzzle y arcade
(4,8), -- super mario - plataforma
(5,3),(5,5),  -- zelda - aventura y fantasía
(6,8),  -- sonic . plataforma
(7,6), -- street fighter - fighting
(8,3),(8,10), -- dragon quest - aventura y RPG
(9,3), (9,9), -- kings quest - aventura y puzzle
(10,5),(10,10), -- f fantasy - RPG y fantasía
(11,1),(11,3), -- star wars - acción y aventura
(12,13); -- metal G - stealth

-- Games-Platforms (Mario en NES y SNES) --- ✅ Completa de datos
INSERT INTO games_platforms (id_game, id_platform) VALUES
(1,3), -- pong en Atari
(2,2), -- space en Arcade
(3,2), -- pacman en Arcade
(4,5), -- super mario en NES
(5,5), -- zelda en NES
(6,8),  -- sonic en  Mega Dr
(7,9), -- street fighter en  SNES
(8,1), -- dragon quest en pc (y NES ?)
(9,1), -- kings quest en pc
(10,11), -- f fantasy  en PlaySt
(11,6), -- star wars en Nintendo 64
(12,11); -- metal G en PlaySt

-- Games-Shops ⚠️❗️ PRECIOS EN EUROS PARA EVITAR QUE ORDER BY PRICE SALGA RARO. 
-- ⚠️❗️ Convertir a ptas en el front --> const pesetas = Math.round(euros * 166.386);
INSERT INTO games_shops (id_game, id_shop, price, in_stock) VALUES
-- Arcade clásicos (precio por partida)
(1, 6, 0.15, false),   -- Pong
(2, 6, 0.15, false),   -- Space Invaders
(3, 6, 0.15, false),   -- Pac-Man
(7, 6, 0.30, false),   -- Street Fighter II

-- Venta física
(4, 7, 39.06, false),  -- Super Mario - Centro Mail
(4, 1, 42.03, false),  -- Super Mario - El Corte Inglés
(5, 7, 45.07, false),  -- Zelda - Centro Mail
(6, 8, 42.03, false),  -- Sonic - Pryca
(7, 2, 48.04, false),  -- Street Fighter - Fnac
(8, 7, 45.07, false),  -- Dragon Quest - Centro Mail
(8, 1, 42.03, false),  -- Dragon Quest - El Corte Inglés

-- PC / Mail Order
(9, 3, 15.02, false),  -- Kings Quest - Mail Soft
(9, 7, 24.01, false),  -- Kings Quest - Centro Mail

-- PlayStation era
(10, 2, 54.06, false), -- Final Fantasy - Fnac
(12, 1, 54.06, false), -- Metal Gear - El Corte Inglés
(12, 2, 54.06, false), -- Metal Gear - Fnac
(11, 7, 48.04, false), -- Star Wars - Centro Mail

-- Alquiler
(4, 5, 3.00, false),   -- Super Mario - Blockbuster

-- GAME (heredero de Centro Mail)
(4, 4, 39.95, false), -- Super Mario en GAME -- En euros
(5, 4, 39.95, false), -- Zelda en GAME -- En euros
(11, 4, 29.95, false); -- Star Wars en GAME -- En euros