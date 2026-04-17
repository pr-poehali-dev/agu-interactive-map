
CREATE TABLE t_p61924321_agu_interactive_map.campus_assets (
    id SERIAL PRIMARY KEY,
    asset_key VARCHAR(255) NOT NULL UNIQUE,
    asset_type VARCHAR(50) NOT NULL,
    data_url TEXT,
    s3_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p61924321_agu_interactive_map.building_positions (
    id SERIAL PRIMARY KEY,
    building_id VARCHAR(10) NOT NULL UNIQUE,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);
