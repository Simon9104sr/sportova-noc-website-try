CREATE DATABASE IF NOT EXISTS sportova_noc;
USE sportova_noc;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  bio TEXT,
  phone VARCHAR(20),
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sports types
CREATE TABLE sport_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50)
);

-- Events table
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sport_type_id INT NOT NULL,
  creator_id INT NOT NULL,
  location VARCHAR(255) NOT NULL,
  event_date DATETIME NOT NULL,
  duration_minutes INT,
  max_participants INT,
  current_participants INT DEFAULT 1,
  difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'intermediate',
  status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sport_type_id) REFERENCES sport_types(id),
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Event participants table
CREATE TABLE event_participants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('joined', 'left', 'cancelled') DEFAULT 'joined',
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_participant (event_id, user_id)
);

-- Insert default sports types
INSERT INTO sport_types (name, description, icon) VALUES
('Football', 'Soccer/Football matches', '⚽'),
('Basketball', 'Basketball games', '🏀'),
('Tennis', 'Tennis matches', '🎾'),
('Volleyball', 'Volleyball games', '🏐'),
('Running', 'Running/Jogging groups', '🏃'),
('Cycling', 'Cycling events', '🚴'),
('Swimming', 'Swimming sessions', '🏊'),
('Badminton', 'Badminton matches', '🏸'),
('Table Tennis', 'Ping Pong matches', '🏓'),
('Gym', 'Gym workouts', '💪');

-- Create indexes for better performance
CREATE INDEX idx_events_creator ON events(creator_id);
CREATE INDEX idx_events_sport ON events(sport_type_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_participants_event ON event_participants(event_id);
CREATE INDEX idx_participants_user ON event_participants(user_id);