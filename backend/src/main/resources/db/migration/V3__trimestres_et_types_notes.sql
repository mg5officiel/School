ALTER TABLE evaluations
    ADD COLUMN type_evaluation VARCHAR(25) NOT NULL DEFAULT 'NOTE_CLASSE',
    ADD COLUMN trimestre VARCHAR(15);

ALTER TABLE evaluations
    ADD CONSTRAINT ck_evaluations_periode
    CHECK (
        (type_evaluation = 'NOTE_CLASSE' AND trimestre IS NULL)
        OR
        (type_evaluation = 'NOTE_TRIMESTRIELLE' AND trimestre IN ('PREMIER', 'DEUXIEME', 'TROISIEME'))
    );

ALTER TABLE bulletins
    ADD COLUMN trimestre VARCHAR(15);

ALTER TABLE bulletins
    ADD CONSTRAINT ck_bulletins_periode
    CHECK (
        (annuel = TRUE AND trimestre IS NULL)
        OR
        (annuel = FALSE AND trimestre IN ('PREMIER', 'DEUXIEME', 'TROISIEME'))
    );

CREATE UNIQUE INDEX uq_bulletins_annuels
    ON bulletins(eleve_id, annee_scolaire_id)
    WHERE annuel = TRUE;

CREATE UNIQUE INDEX uq_bulletins_trimestriels
    ON bulletins(eleve_id, annee_scolaire_id, trimestre)
    WHERE annuel = FALSE;
