CREATE TABLE IF NOT EXISTS features (
    geoid SERIAL NOT NULL,
    uuid VARCHAR NOT NULL,
    geom GEOMETRY NOT NULL,
    properties JSONB,
    datasource_id VARCHAR,
    created_at TIMESTAMP DEFAULT current_timestamp,
    updated_at TIMESTAMP DEFAULT current_timestamp
);

CREATE INDEX features_gix ON features USING GIST (geom);

-- Add a spatial column to the table
-- SELECT AddGeometryColumn ('public','features','geom',4326,'POINT',2);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- DROP TRIGGER features_update IF EXISTS;
CREATE TRIGGER features_update BEFORE UPDATE ON features FOR EACH ROW EXECUTE PROCEDURE update_modified_column(); ;
