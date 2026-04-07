import { useEffect, useState } from 'react'
import { getRSVPs, deleteRSVP } from '../services/rsvpService'
import { motion } from 'framer-motion'
import { Trash2, Users, CheckCircle2, XCircle, MessageSquare, AlertTriangle, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
      } else {
        fetchData()
      }
    }
    
    checkUser()
  }, [navigate])

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await getRSVPs()
      setRsvps(data)
    } catch (err) {
      setError('Errore nel caricamento dei dati. Assicurati di aver effettuato il login su Supabase.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa risposta?')) {
      try {
        await deleteRSVP(id)
        setRsvps(rsvps.filter(item => item.id !== id))
      } catch (err) {
        alert('Errore nella cancellazione.')
      }
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter(r => r.attendance === 'yes').length,
    notAttending: rsvps.filter(r => r.attendance === 'no').length,
  }

  if (loading) return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="text-navy animate-pulse font-serif text-2xl">Caricamento risposte...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f3f0e7] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-serif text-navy mb-2">Dashboard RSVP</h1>
              <p className="text-navy-muted tracking-widest uppercase text-xs">Federica & Federico - 12 Settembre 2026</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white text-navy-muted border border-navy/10 rounded-full text-xs font-bold uppercase tracking-widest hover:text-navy hover:border-navy transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-navy/5 text-center">
              <div className="text-2xl font-serif text-navy">{stats.total}</div>
              <div className="text-[10px] text-navy-muted uppercase tracking-tighter">Totali</div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-navy/5 text-center">
              <div className="text-2xl font-serif text-green-600">{stats.attending}</div>
              <div className="text-[10px] text-navy-muted uppercase tracking-tighter">Sì</div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-navy/5 text-center">
              <div className="text-2xl font-serif text-red-500">{stats.notAttending}</div>
              <div className="text-[10px] text-navy-muted uppercase tracking-tighter">No</div>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-navy/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-navy text-white text-[10px] uppercase tracking-widest">
                  <th className="p-5 font-bold">Ospite</th>
                  <th className="p-5 font-bold">Presenza</th>
                  <th className="p-5 font-bold">Allergie / Note</th>
                  <th className="p-5 font-bold">Messaggio</th>
                  <th className="p-5 font-bold text-center">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {rsvps.map((rsvp) => (
                  <motion.tr 
                    key={rsvp.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-navy/[0.02] transition-colors"
                  >
                    <td className="p-5">
                      <div className="font-serif text-navy text-lg">{rsvp.name}</div>
                      <div className="text-xs text-navy-muted">{rsvp.email || 'Nessuna email'}</div>
                    </td>
                    <td className="p-5">
                      {rsvp.attendance === 'yes' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ci sarà
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Non ci sarà
                        </span>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="text-sm text-navy/80 italic max-w-xs">
                        {rsvp.dietary_requirements || '-'}
                      </div>
                    </td>
                    <td className="p-5">
                      {rsvp.message ? (
                        <div className="group relative cursor-help">
                          <MessageSquare className="w-5 h-5 text-gold/60" />
                          <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-navy text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                            {rsvp.message}
                          </div>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => handleDelete(rsvp.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {rsvps.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="p-20 text-center text-navy-muted font-serif">
                      Nessuna risposta ricevuta finora.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
