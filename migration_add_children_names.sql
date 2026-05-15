-- Aggiunge la colonna children_names alla tabella rsvp
ALTER TABLE rsvp ADD COLUMN children_names TEXT;

-- Nota: Questa colonna memorizzerà i nomi dei bambini come stringa separata da virgole,
-- seguendo lo stesso pattern usato per children_ages.
