-- SCRIPT PER AGGIORNARE LA TABELLA RSVP
-- Eseguire questo script nel SQL Editor di Supabase

-- 1. Rinominare la colonna email in surname
ALTER TABLE rsvp RENAME COLUMN email TO surname;
ALTER TABLE rsvp ALTER COLUMN surname SET DATA TYPE text;

-- 2. Aggiungere campi per la gestione dei bambini
ALTER TABLE rsvp ADD COLUMN has_children boolean DEFAULT false;
ALTER TABLE rsvp ADD COLUMN children_ages text;

-- Opzionale: Commenti per chiarezza
COMMENT ON COLUMN rsvp.surname IS 'Cognome dell''ospite';
COMMENT ON COLUMN rsvp.has_children IS 'Indica se l''ospite porta bambini';
COMMENT ON COLUMN rsvp.children_ages IS 'Età dei bambini separate da virgola (es: 2,5,8)';
