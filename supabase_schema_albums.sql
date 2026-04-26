-- Tabella per la gestione dinamica degli album di Google Foto (Versione 2)
CREATE TABLE IF NOT EXISTS album_settings (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_key TEXT UNIQUE NOT NULL, -- es: 'chiesa', 'torta'
  display_title TEXT NOT NULL,       -- Titolo mostrato sul sito
  google_album_title TEXT NOT NULL,  -- Nome dell'album su Google Foto
  google_album_id TEXT,               -- ID reale dell'album (popolato dall'app)
  share_url TEXT,                    -- Link pubblico di condivisione
  is_visible BOOLEAN DEFAULT true,   -- Stato di visibilità sul sito
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inserimento dati iniziali (Categorie predefinite)
INSERT INTO album_settings (category_key, display_title, google_album_title, is_visible)
VALUES 
  ('chiesa', 'Momenti Chiesa', 'Wedding_day_chiesa', true),
  ('ingresso', 'Ingresso Sposa', 'Wedding_day_ingresso', true),
  ('torta', 'Taglio della Torta', 'Wedding_day_torta', true),
  ('ballo', 'Pista da Ballo', 'Wedding_day_ballo', true),
  ('fuochi', 'Fuochi d''Artificio', 'Wedding_day_fuochi', true),
  ('ospiti', 'Insieme a voi', 'Wedding_day_ospiti', true)
ON CONFLICT (category_key) DO UPDATE 
SET display_title = EXCLUDED.display_title;

-- Configurazione Row Level Security (RLS)
ALTER TABLE album_settings ENABLE ROW LEVEL SECURITY;

-- Permetti a tutti (ospiti) di leggere solo gli album visibili
-- Nota: Il filtro 'is_visible' è applicato nel codice frontend, 
-- qui permettiamo la lettura di base.
CREATE POLICY "Allow public read access" ON album_settings
  FOR SELECT USING (true);

-- Permetti agli admin autenticati di gestire tutto
CREATE POLICY "Allow authenticated all" ON album_settings
  FOR ALL USING (auth.role() = 'authenticated');
