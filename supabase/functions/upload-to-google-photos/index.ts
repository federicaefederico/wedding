// supabase/functions/upload-to-google-photos/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')
const GOOGLE_REFRESH_TOKEN = Deno.env.get('GOOGLE_REFRESH_TOKEN')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { filePath, fileName, categoryKey } = await req.json()
    console.log(`Ricevuta richiesta per categoria: "${categoryKey}", file: ${fileName}`)

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Recupera configurazione album da Supabase
    const { data: settings, error: settingsError } = await supabase
      .from('album_settings')
      .select('*')
      .eq('category_key', categoryKey)
      .single()

    if (settingsError || !settings) {
      console.error("Errore recupero settings:", settingsError)
      throw new Error(`Configurazione per "${categoryKey}" non trovata nel database.`)
    }

    // 2. Ottieni Token Google
    console.log("Richiesta access token a Google...")
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    })
    
    if (!tokenResponse.ok) {
      throw new Error("Errore durante il recupero del token di Google")
    }
    
    const { access_token } = await tokenResponse.json()
    let albumId = settings.google_album_id

    // 3. Se non abbiamo l'albumId salvato, creiamolo ora
    if (!albumId) {
      console.log(`ID album non presente per "${categoryKey}". Creazione su Google Foto...`)
      const createAlbumRes = await fetch('https://photoslibrary.googleapis.com/v1/albums', {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ album: { title: settings.google_album_title } })
      })
      
      if (!createAlbumRes.ok) {
        throw new Error("Impossibile creare l'album su Google Foto")
      }
      
      const newAlbum = await createAlbumRes.json()
      albumId = newAlbum.id
      console.log(`Nuovo album creato su Google! ID: ${albumId}`)

      // Salva l'ID su Supabase per la prossima volta
      await supabase
        .from('album_settings')
        .update({ google_album_id: albumId })
        .eq('category_key', categoryKey)
      
      console.log("ID album salvato nel database.")
    }

    // 4. Scarica da Supabase Storage
    console.log(`Scaricamento file: ${filePath}`)
    const { data: fileData, error: downloadError } = await supabase.storage.from('wedding-photos').download(filePath)
    if (downloadError) throw downloadError

    // 5. Carica bytes su Google
    console.log("Caricamento su Google Photos...")
    const uploadRes = await fetch('https://photoslibrary.googleapis.com/v1/uploads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/octet-stream',
        'X-Goog-Upload-File-Name': fileName,
        'X-Goog-Upload-Protocol': 'raw',
      },
      body: fileData,
    })
    
    if (!uploadRes.ok) throw new Error("Errore invio bytes a Google")
    const uploadToken = await uploadRes.text()

    // 6. Crea Media Item nell'album
    const createRes = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        albumId: albumId,
        newMediaItems: [{ simpleMediaItem: { uploadToken } }],
      }),
    })
    
    if (!createRes.ok) throw new Error("Errore aggiunta foto all'album")

    console.log("Foto aggiunta con successo!")

    // 7. Pulisci Storage
    await supabase.storage.from('wedding-photos').remove([filePath])

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    console.error("ERRORE FINALE FUNZIONE:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
