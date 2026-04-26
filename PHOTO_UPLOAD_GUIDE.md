# Guida Integrazione Google Foto

Questa guida ti spiega come configurare il sistema per caricare le foto dal tuo sito direttamente negli album di Google Foto dei tuoi invitati.

## 1. Configurazione Supabase Storage
Prima di tutto, le foto caricate dagli utenti devono atterrare in uno spazio temporaneo su Supabase.

1. Accedi alla dashboard di [Supabase](https://app.supabase.com/).
2. Vai nella sezione **Storage** (icona a forma di secchio).
3. Clicca su **New Bucket**.
4. Nome Bucket: `wedding-photos`.
5. Impostalo come **Public** (così l'applicazione può caricarci file senza autenticazione complicata per gli ospiti).
6. Salva.

## 2. Configurazione Google Cloud (API)
Per permettere a Supabase di inviare file a Google Foto:

1. Vai su [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un **Nuovo Progetto** chiamato "Wedding Photos".
3. Nella barra di ricerca, cerca **Google Photos Library API** e clicca su **Abilita**.
4. Vai su **Schermata consenso OAuth**:
   - Tipo utente: **Esterno**.
   - Inserisci nome app (es. Wedding Site) e la tua email.
   - Aggiungi lo scope: `https://www.googleapis.com/auth/photoslibrary.appendonly` (permette solo di aggiungere foto, non di cancellarle).
   - In "Test users", aggiungi la tua email di Google (quella dove risiedono gli album).
5. Vai su **Credenziali**:
   - Clicca su **Crea credenziali** -> **ID client OAuth**.
   - Tipo applicazione: **Applicazione Web**.
   - URI di reindirizzamento autorizzati: `https://developers.google.com/oauthplayground` (lo useremo solo una volta per ottenere il Refresh Token).
   - Salva e copia il **Client ID** e il **Client Secret**.

## 3. Ottenere il Refresh Token (Una tantum)
Il Refresh Token serve alla funzione per agire a tuo nome anche quando non sei connesso.

1. Vai su [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
2. Clicca sull'icona dell'ingranaggio (Settings) in alto a destra:
   - Spunta **Use your own OAuth credentials**.
   - Inserisci il tuo **Client ID** e **Client Secret**.
3. Nella colonna di sinistra (Step 1), incolla questo scope: `https://www.googleapis.com/auth/photoslibrary.appendonly`.
4. Clicca su **Authorize APIs** e accedi col tuo account Google.
5. Clicca su **Exchange authorization code for tokens** (Step 2).
6. Copia il **Refresh Token** che appare.

## 4. Configurazione Supabase Edge Function
Ora devi dire a Supabase come usare queste chiavi.

1. Installa la [Supabase CLI](https://supabase.com/docs/guides/cli) sul tuo computer se non l'hai già.
2. Inizializza le funzioni: `supabase functions new upload-to-google-photos`.
3. Copia il codice che trovi nel file `supabase/functions/upload-to-google-photos/index.ts` (creato da me nel tuo progetto).
4. Configura i segreti su Supabase tramite terminale:
   ```bash
   supabase secrets set GOOGLE_CLIENT_ID=tuo_client_id
   supabase secrets set GOOGLE_CLIENT_SECRET=tuo_client_secret
   supabase secrets set GOOGLE_REFRESH_TOKEN=tuo_refresh_token
   ```
5. Distribuisci la funzione: `supabase functions deploy upload-to-google-photos`.

## 5. Ultimo Step: Collegare l'Album
Nel file `App.jsx`, assicurati che gli `albumId` nelle categorie corrispondano agli ID interni dei tuoi album di Google Foto (non il link breve, ma l'ID lungo che puoi trovare tramite API o semplicemente creando un test di upload).

---
**Nota:** Se questa procedura ti sembra troppo lunga, puoi usare **Zapier** collegando "Supabase Storage" a "Google Photos". È molto più semplice e non richiede codice!
