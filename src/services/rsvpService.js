import { supabase } from '../lib/supabaseClient'

/**
 * Invia una nuova risposta RSVP al database Supabase.
 */
export const submitRSVP = async (rsvpData) => {
  const { data, error } = await supabase
    .from('rsvp')
    .insert([
      {
        name: rsvpData.name,
        email: rsvpData.email || null,
        attendance: rsvpData.attendance,
        dietary_requirements: rsvpData.dietary_requirements || null,
        message: rsvpData.message || null,
      },
    ])

  if (error) {
    console.error('Errore nell\'invio dell\'RSVP:', error)
    throw error
  }

  return data
}

/**
 * Recupera tutte le risposte dal database.
 * Richiede che l'utente sia autenticato (gestito dalle policy RLS).
 */
export const getRSVPs = async () => {
  const { data, error } = await supabase
    .from('rsvp')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Errore nel recupero degli RSVP:', error)
    throw error
  }

  return data
}

/**
 * Cancella una risposta specifica.
 */
export const deleteRSVP = async (id) => {
  const { error } = await supabase
    .from('rsvp')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Errore nella cancellazione dell\'RSVP:', error)
    throw error
  }
}
