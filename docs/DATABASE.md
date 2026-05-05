# Database Schema

## PostgreSQL Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- Hashed with bcrypt
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  start_time TIME,
  end_date DATE,
  end_time TIME,
  location TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Field Definitions

#### Users Table
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | SERIAL PRIMARY KEY | Auto | Unique identifier |
| username | VARCHAR(255) UNIQUE | Yes | User's login username |
| password | VARCHAR(255) | Yes | Hashed password (bcrypt) |
| created_at | TIMESTAMP | Auto | Account creation time |

#### Events Table
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | SERIAL PRIMARY KEY | Auto | Unique identifier |
| user_id | INTEGER | Yes | References users(id) |
| title | VARCHAR(255) | Yes | Event name/title |
| start_date | DATE | Yes | Event start date |
| start_time | TIME | No | Event start time |
| end_date | DATE | No | Event end date (defaults to start_date if null) |
| end_time | TIME | No | Event end time |
| location | TEXT | No | Event location/venue |
| description | TEXT | No | Additional event details |
| created_at | TIMESTAMP | Auto | Record creation time |
| updated_at | TIMESTAMP | Auto | Last update time |

### Notes
- `end_date` defaults to `start_date` when not provided
- `start_time` and `end_time` can be null for all-day events
- All text fields use TEXT type for flexibility
- Each user only sees their own events (user_id filtering)
