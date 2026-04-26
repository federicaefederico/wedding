-- Tabella per la gestione dinamica degli album di Google Foto
CREATE TABLE IF NOT EXISTS album_settings (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_key TEXT UNIQUE NOT NULL, -- es: 'chiesa', 'torta'
  display_title TEXT NOT NULL,       -- Titolo mostrato sul sito
  google_album_title TEXT NOT NULL,  -- Nome dell'album su Google Foto
  google_album_id TEXT,               -- ID reale dell'album (popolato dall'app)
  share_url TEXT,                    -- Link pubblico di condivisione
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inserimento dati iniziali (Categorie predefinite)
INSERT INTO album_settings (category_key, display_title, google_album_title)
VALUES 
  ('chiesa', 'Momenti Chiesa', 'Wedding_day_chiesa'),
  ('ingresso', 'Ingresso Sposa', 'Wedding_day_ingresso'),
  ('torta', 'Taglio della Torta', 'Wedding_day_torta'),
  ('ballo', 'Pista da Ballo', 'Wedding_day_ballo'),
  ('fuochi', 'Fuochi d''Artificio', 'Wedding_day_fuochi'),
  ('ospiti', 'Insieme a voi', 'Wedding_day_ospiti')
ON CONFLICT (category_key) DO NOTHING;

-- Configurazione Row Level Security (RLS)
ALTER TABLE album_settings ENABLE ROW LEVEL SECURITY;

-- Permetti a tutti (ospiti) di leggere la configurazione degli album
CREATE POLICY "Allow public read access" ON album_settings
  FOR SELECT USING (true);

-- Permetti solo agli admin autenticati di aggiornare i link o i titoli
CREATE POLICY "Allow authenticated update" ON album_settings
  FOR UPDATE USING (auth.role() = 'authenticated');
