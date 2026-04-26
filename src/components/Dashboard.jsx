import { useEffect, useState } from 'react'
import { getRSVPs, deleteRSVP } from '../services/rsvpService'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Users, CheckCircle2, XCircle, MessageSquare, AlertTriangle, LogOut, Camera, Save, ExternalLink, Eye, EyeOff, Plus, Heart, GlassWater, Gift, Music, Church, Cake, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [rsvps, setRsvps] = useState([])
  const [albumSettings, setAlbumSettings] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ key: '', title: '', googleTitle: '', iconName: 'Camera' })
  
  const availableIcons = [
    { id: 'Camera', icon: Camera },
    { id: 'Church', icon: Church },
    { id: 'Cake', icon: Cake },
    { id: 'Music', icon: Music },
    { id: 'Users', icon: Users },
    { id: 'Heart', icon: Heart },
    { id: 'GlassWater', icon: GlassWater },
    { id: 'Gift', icon: Gift },
    { id: 'Sparkles', icon: Sparkles }
  ]
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
      } else {
        fetchData()
        fetchAlbumSettings()
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
      setError('Errore nel caricamento dei dati RSVP.')
    } finally {
      setLoading(false)
    }
  }

  const fetchAlbumSettings = async () => {
    const { data, error } = await supabase
      .from('album_settings')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Errore caricamento album:', error)
    } else {
      setAlbumSettings(data)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.key || !newCategory.title) return

    const cleanKey = newCategory.key.toLowerCase().replace(/\s+/g, '_')

    const { data, error } = await supabase
      .from('album_settings')
      .insert([
        { 
          category_key: cleanKey, 
          display_title: newCategory.title,
          google_album_title: newCategory.googleTitle,
          icon_name: newCategory.iconName,
          is_visible: true
        }
      ])
      .select()

    if (error) {
      alert('Errore: ' + error.message)
    } else {
      setAlbumSettings([...albumSettings, data[0]])
      setShowAddModal(false)
      setNewCategory({ key: '', title: '', googleTitle: '' })
    }
  }

  const handleUpdateAlbum = async (id, updates) => {
    setUpdatingId(id)
    const { error } = await supabase
      .from('album_settings')
      .update(updates)
      .eq('id', id)
    
    if (error) {
      alert('Errore durante l\'aggiornamento dell\'album.')
    } else {
      // Refresh local state
      setAlbumSettings(albumSettings.map(a => a.id === id ? { ...a, ...updates } : a))
    }
    setUpdatingId(null)
  }

  const handleDeleteAlbum = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa categoria?')) {
      const { error } = await supabase
        .from('album_settings')
        .delete()
        .eq('id', id)
      
      if (error) alert('Errore eliminazione: ' + error.message)
      else setAlbumSettings(albumSettings.filter(a => a.id !== id))
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
      <div className="text-navy animate-pulse font-serif text-2xl">Caricamento dashboard...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f3f0e7] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-serif text-navy mb-2">Area Amministrativa</h1>
              <p className="text-navy-muted tracking-widest uppercase text-xs">Gestione Matrimonio - 12 Settembre 2026</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white text-navy-muted border border-navy/10 rounded-full text-xs font-bold uppercase tracking-widest hover:text-navy hover:border-navy transition-all shadow-sm w-fit"
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

        {/* --- SEZIONE RSVP --- */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-gold" />
            <h2 className="text-2xl font-serif text-navy">Risposte Inviti (RSVP)</h2>
          </div>
          
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
        </section>

        {/* --- SEZIONE GESTIONE ALBUM --- */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-gold" />
              <h2 className="text-2xl font-serif text-navy">Gestione Album Foto</h2>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-navy text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Nuova Categoria</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albumSettings.map((album) => (
              <motion.div 
                key={album.id}
                layout
                className={`bg-white p-6 rounded-3xl shadow-lg border border-navy/5 flex flex-col gap-4 transition-opacity ${!album.is_visible ? 'opacity-60' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    {!album.is_visible && (
                      <div className="px-3 py-1 bg-navy/10 text-navy-muted rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Nascosto
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleUpdateAlbum(album.id, { is_visible: !album.is_visible })}
                      title={album.is_visible ? "Nascondi dal sito" : "Mostra sul sito"}
                      className={`p-2 rounded-lg transition-colors ${album.is_visible ? 'text-navy-muted hover:bg-navy/5' : 'text-gold bg-gold/5'}`}
                    >
                      {album.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(album.id)}
                      className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-serif text-navy">{album.display_title}</h3>

                <div className="space-y-4 flex-grow">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy-muted uppercase tracking-widest">Nome Album Google</label>
                    <input 
                      type="text"
                      className="w-full p-3 bg-paper rounded-xl border border-navy/5 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                      defaultValue={album.google_album_title}
                      onBlur={(e) => {
                        if (e.target.value !== album.google_album_title) {
                          handleUpdateAlbum(album.id, { google_album_title: e.target.value })
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy-muted uppercase tracking-widest">Link Condivisione (Share URL)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        className="flex-grow p-3 bg-paper rounded-xl border border-navy/5 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                        placeholder="https://photos.app.goo.gl/..."
                        defaultValue={album.share_url}
                        onBlur={(e) => {
                          if (e.target.value !== album.share_url) {
                            handleUpdateAlbum(album.id, { share_url: e.target.value })
                          }
                        }}
                      />
                      {album.share_url && (
                        <a 
                          href={album.share_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-navy text-white rounded-xl hover:bg-navy/90 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy-muted uppercase tracking-widest">Icona</label>
                    <div className="flex flex-wrap gap-1 p-2 bg-paper rounded-xl border border-navy/5">
                      {availableIcons.map(({ id, icon: IconComponent }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleUpdateAlbum(album.id, { icon_name: id })}
                          className={`p-2 rounded-lg transition-all ${album.icon_name === id ? 'bg-gold text-white shadow-sm' : 'text-navy-muted hover:bg-navy/5'}`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[9px] text-navy-muted italic">
                    ID Google: {album.google_album_id ? album.google_album_id.substring(0, 8) + '...' : 'Non creato'}
                  </span>
                  {updatingId === album.id && (
                    <span className="text-[10px] text-gold animate-pulse font-bold">Salvataggio...</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* --- MODAL AGGIUNGI CATEGORIA --- */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-navy/5"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-serif text-navy">Nuova Categoria</h2>
                <p className="text-navy-muted text-xs uppercase tracking-widest mt-2">Aggiungi un nuovo album</p>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-widest">Identificativo (es: selfie)</label>
                  <input 
                    type="text"
                    required
                    value={newCategory.key}
                    onChange={(e) => setNewCategory({...newCategory, key: e.target.value})}
                    placeholder="Sola parola, es: aperitivo"
                    className="w-full p-4 bg-paper rounded-2xl border border-navy/10 focus:border-gold/50 focus:outline-none transition-colors text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-widest">Titolo da mostrare agli ospiti</label>
                  <input 
                    type="text"
                    required
                    value={newCategory.title}
                    onChange={(e) => setNewCategory({...newCategory, title: e.target.value})}
                    placeholder="Es: I vostri Selfie"
                    className="w-full p-4 bg-paper rounded-2xl border border-navy/10 focus:border-gold/50 focus:outline-none transition-colors text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-widest">Nome Album Google Foto</label>
                  <input 
                    type="text"
                    required
                    value={newCategory.googleTitle}
                    onChange={(e) => setNewCategory({...newCategory, googleTitle: e.target.value})}
                    placeholder="Es: Wedding_day_selfie"
                    className="w-full p-4 bg-paper rounded-2xl border border-navy/10 focus:border-gold/50 focus:outline-none transition-colors text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-widest">Scegli un'icona</label>
                  <div className="grid grid-cols-5 gap-2 p-3 bg-paper rounded-2xl border border-navy/10">
                    {availableIcons.map(({ id, icon: IconComponent }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setNewCategory({...newCategory, iconName: id})}
                        className={`p-3 rounded-xl flex items-center justify-center transition-all ${newCategory.iconName === id ? 'bg-gold text-white shadow-lg' : 'text-navy-muted hover:bg-navy/5'}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-grow py-4 bg-paper text-navy-muted rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-navy/5 transition-colors"
                  >
                    Annulla
                  </button>
                  <button 
                    type="submit"
                    className="flex-grow py-4 bg-navy text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-lg"
                  >
                    Crea Categoria
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
