CREATE TABLE filieres(
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL UNIQUE
);

ALTER TABLE eleves
    ADD COLUMN parent_id BIGINT;

ALTER TABLE eleves
    ADD CONSTRAINT fk_eleves_parent
    FOREIGN KEY (parent_id) REFERENCES parents(id);

ALTER TABLE eleves
    ALTER COLUMN parent_id SET NOT NULL;

ALTER TABLE matieres
    ADD COLUMN code VARCHAR(30),
    ADD COLUMN coefficient_new NUMERIC(6,2),
    ADD COLUMN niveau VARCHAR(20),
    ADD COLUMN filiere_id BIGINT;

ALTER TABLE matieres
    ADD CONSTRAINT uq_matieres_code UNIQUE(code);

ALTER TABLE matieres
    ADD CONSTRAINT fk_matieres_filiere
    FOREIGN KEY (filiere_id) REFERENCES filieres(id);

ALTER TABLE matieres
    ALTER COLUMN code SET NOT NULL,
    ALTER COLUMN coefficient_new SET NOT NULL,
    ALTER COLUMN niveau SET NOT NULL,
    ALTER COLUMN filiere_id SET NOT NULL;

ALTER TABLE matieres DROP COLUMN coefficient;
ALTER TABLE matieres RENAME COLUMN coefficient_new TO coefficient;