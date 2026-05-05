import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  MapPin,
  Send,
  GlassWater,
  PartyPopper,
  UtensilsCrossed,
  Music2,
  ChevronDown,
  Lock,
  Loader2,
  Camera,
  Church,
  Sparkles,
  Cake,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Music,
  Gift,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react'
import sigillo from './assets/sigillo.png'
import chiesa from './assets/chiesa.jpeg'
import villa from './assets/villa.jpeg'
import tortaSvg from './assets/icons/torta.svg'
import aperitivoSvg from './assets/icons/aperitivo.svg'
import posateSvg from './assets/icons/posate.svg'
import cerimoniaSvg from './assets/icons/cerimonia.svg'
import inizioFestaSvg from './assets/icons/inizioFesta.svg'
import { intervalToDuration, format, differenceInDays } from 'date-fns'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { submitRSVP } from './services/rsvpService'
import { supabase } from './lib/supabaseClient'
import Dashboard from './components/Dashboard'
import { useScroll, useMotionValueEvent } from 'framer-motion'

// --- Utility for Password Hashing ---
async function hashPassword(string) {
  // Check if we are in a secure context (HTTPS or localhost)
  if (!window.crypto || !window.crypto.subtle) {
    // Fallback for development via IP address or insecure contexts
    // It's not a real hash but satisfies the "not in plain text" requirement for local testing
    return 'insecure_hash_' + btoa(string);
  }
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// --- Components ---
const GuestAccess = ({ onAuthenticate, dbPassword }) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.trim() === dbPassword.trim()) {
      const hash = await hashPassword(password.trim())
      localStorage.setItem('guest_auth_hash', hash)
      onAuthenticate()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] bg-paper flex items-center justify-center px-4 bg-eucalyptus">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-lg shadow-2xl border border-navy/5 w-full max-w-md text-center space-y-8"
      >
        <div className="space-y-2">
          <div className="w-16 h-16 bg-navy/5 text-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-6xl text-navy corsivo">Benvenuti</h2>
          <p className="text-navy-muted text-xs uppercase tracking-widest px-4">
            Inserisci la password per accedere al sito del matrimonio di Federica e Federico
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              autoFocus
              className={`w-full p-4 bg-paper rounded-2xl border ${error ? 'border-red-400 animate-shake' : 'border-navy/10'} focus:border-navy focus:outline-none transition-all text-center tracking-[0.5em] font-bold`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy transition-colors p-2"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {error && (
              <p className="absolute top-full left-0 right-0 text-[10px] text-red-500 font-bold uppercase mt-2 animate-bounce">
                Password Errata
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-navy text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>Accedi</span>
          </button>
        </form>
      </motion.div>
    </div>
  )
}

const CardSeparator = () => (
  <div className="flex items-center justify-center w-full py-16 px-4 overflow-hidden">
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      whileInView={{ width: '200px', opacity: 0.2 }}
      className="h-px bg-navy"
    />
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 0.3 }}
      className="mx-8 text-navy shrink-0"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C13 10 21 11 22 12C21 13 13 14 12 22C11 14 3 13 2 12C3 11 11 10 12 2Z" />
      </svg>
    </motion.div>
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      whileInView={{ width: '200px', opacity: 0.2 }}
      className="h-px bg-navy"
    />
  </div>
)

const Countdown = ({ targetDate, showMonths = false }) => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const duration = intervalToDuration({ start: now, end: targetDate })
  const totalDays = differenceInDays(targetDate, now)

  const items = showMonths
    ? [
      { label: duration.months === 1 ? 'MESE' : 'MESI', value: duration.months || 0 },
      { label: duration.days === 1 ? 'GIORNO' : 'GIORNI', value: duration.days || 0 },
      { label: duration.hours === 1 ? 'ORA' : 'ORE', value: duration.hours || 0 },
      { label: duration.minutes === 1 ? 'MINUTO' : 'MINUTI', value: duration.minutes || 0 },
      { label: duration.seconds === 1 ? 'SECONDO' : 'SECONDI', value: duration.seconds || 0 },
    ]
    : [
      { label: totalDays === 1 ? 'GIORNO' : 'GIORNI', value: totalDays || 0 },
      { label: duration.hours === 1 ? 'ORA' : 'ORE', value: duration.hours || 0 },
      { label: duration.minutes === 1 ? 'MINUTO' : 'MINUTI', value: duration.minutes || 0 },
      { label: duration.seconds === 1 ? 'SECONDO' : 'SECONDI', value: duration.seconds || 0 },
    ]

  return (
    <div className={`grid grid-cols-2 ${showMonths ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-4 px-4 max-w-4xl mx-auto my-12`}>
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-lg text-center shadow-lg"
        >
          <div className="text-4xl md:text-5xl font-serif text-paper mb-1">{item.value}</div>
          <div className="text-xs tracking-widest text-paper/80 uppercase font-medium">{item.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

const TimelineItem = ({ time, title, icon, isLeft }) => {
  const isSvg = typeof icon === 'string';
  const Icon = !isSvg ? icon : null;

  return (
    <div className="relative grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center py-10 group">
      {/* Left Side */}
      <div className={`relative flex flex-col items-end justify-center ${isLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="flex flex-col items-end pr-8 md:pr-16"
        >
          {/* Icon Above */}
          <div className="w-16 h-16 md:w-32 md:h-32 flex items-center justify-center mb-2">
            {isSvg ? (
              <img src={icon} alt="" className="w-14 h-14 md:w-28 md:h-28 object-contain" />
            ) : (
              <Icon className="w-10 h-10 md:w-20 md:h-20 text-navy/70" />
            )}
          </div>

          {/* Time & Horizontal Bar */}
          <div className="relative flex items-center justify-end w-full">
            {/* Horizontal Connector - Matching vertical style and avoiding collision */}
            <div className="absolute right-[-32px] md:right-[-64px] w-4 md:w-8 h-0.5 bg-navy" />
            <div className="text-navy-dark font-bold text-xl md:text-4xl tracking-[0.2em] leading-none z-10">
              {time}
            </div>
          </div>

          {/* Title Below */}
          <div className="text-navy text-[10px] md:text-base font-serif uppercase tracking-[0.3em] text-right mt-3 opacity-80">
            {title}
          </div>
        </motion.div>
      </div>

      {/* Center Line Spacer */}
      <div className="w-0.5" />

      {/* Right Side */}
      <div className={`relative flex flex-col items-start justify-center ${!isLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="flex flex-col items-start pl-8 md:pl-16"
        >
          {/* Icon Above */}
          <div className="w-16 h-16 md:w-32 md:h-32 flex items-center justify-center mb-2">
            {isSvg ? (
              <img src={icon} alt="" className="w-14 h-14 md:w-28 md:h-28 object-contain" />
            ) : (
              <Icon className="w-10 h-10 md:w-20 md:h-20 text-navy/70" />
            )}
          </div>

          {/* Time & Horizontal Bar */}
          <div className="relative flex items-center justify-start w-full">
            {/* Horizontal Connector - Matching vertical style and avoiding collision */}
            <div className="absolute left-[-32px] md:left-[-64px] w-4 md:w-8 h-0.5 bg-navy" />
            <div className="text-navy-dark font-bold text-xl md:text-4xl tracking-[0.2em] leading-none z-10">
              {time}
            </div>
          </div>

          {/* Title Below */}
          <div className="text-navy text-[10px] md:text-base font-serif uppercase tracking-[0.3em] text-left mt-3 opacity-80">
            {title}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border border-navy/10 bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden mb-4 last:mb-0 transition-all duration-300 hover:border-navy/20">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-6 text-left transition-colors"
    >
      <span className="font-serif text-navy text-lg pr-8">{question}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        className="text-navy-muted"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="p-6 pt-0 text-navy-muted text-sm border-t border-navy/5 leading-relaxed whitespace-pre-line">
            {answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

const FAQAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null)

  const items = [
    {
      q: "Entro quando devo confermare?",
      a: "Vi preghiamo di confermare la vostra presenza entro il 12 Luglio 2026 compilando indivisualmente il modulo RSVP qui sotto."
    },
    {
      q: "C'è un dress code particolare?",
      a: "Non è previsto un dress code specifico: sentitevi liberi di esprimere il vostro stile con un tocco di eleganza che renda ancora più speciale l'occasione."
    },
    {
      q: "Cosa devo fare se ho allergie o restrizioni alimentari?",
      a: "Potete indicare qualsiasi allergia o intolleranza direttamente nel modulo RSVP. Avviseremo lo chef per garantirvi un menu dedicato."
    },
    {
      q: "I bambini sono i benvenuti?",
      a: "Certamente! I più piccoli sono i benvenuti e sarà previsto per loro un menù dedicato. Se avete esigenze particolari, saremo felici di fare il possibile per soddisfarle.\n\nTuttavia, desideriamo informarvi che, data l’atmosfera intima della location e il mood della serata, non sono previste aree gioco o servizi di animazione.\n\nVi chiediamo gentilmente di segnalarci nel modulo RSVP qui sotto eventuali necessità specifiche, come la disponibilità di seggioloni o spazi per culle, così da poterci organizzare al meglio."
    },
    {
      q: "È disponibile un parcheggio presso la Villa?",
      a: "Sì, Villa Valenca dispone di un ampio parcheggio privato e gratuito a disposizione di tutti gli ospiti.\nL'indirizzo esatto per raggiungere l'ingresso del parcheggio è Via Castrezzato 108 - 25030 Coccaglio (BS)."
    }
  ]

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {items.map((faq, idx) => (
        <FAQItem
          key={idx}
          question={faq.q}
          answer={faq.a}
          isOpen={activeIndex === idx}
          onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
        />
      ))}
    </div>
  )
}

const PhotoCard = ({ title, icon: Icon, desc, albumUrl, categoryKey, albumTitle }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [uploadCount, setUploadCount] = useState({ current: 0, total: 0 })
  const fileInputRef = useRef(null)

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setIsUploading(true)
    setStatus(null)
    setUploadCount({ current: 0, total: files.length })

    let hasError = false

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadCount({ current: i + 1, total: files.length })

      // Verifica dimensione (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        console.warn(`File ${file.name} troppo grande.`)
        continue
      }

      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${categoryKey}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        // 1. Upload su Supabase Storage
        const { error } = await supabase.storage
          .from('wedding-photos')
          .upload(fileName, file)

        if (error) throw error

        // 2. Chiama la Edge Function
        const { error: funcError } = await supabase.functions.invoke('upload-to-google-photos', {
          body: {
            filePath: fileName,
            fileName: file.name,
            categoryKey: categoryKey
          }
        })

        if (funcError) throw funcError

      } catch (err) {
        console.error(`Errore caricamento ${file.name}:`, err)
        hasError = true
      }
    }

    if (hasError) {
      setStatus('error')
    } else {
      setStatus('success')
      setTimeout(() => setStatus(null), 5000)
    }

    setIsUploading(false)
    setUploadCount({ current: 0, total: 0 })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-[2rem] border border-navy/5 shadow-xl hover:shadow-2xl transition-all group flex flex-col items-center text-center space-y-4 relative overflow-hidden"
    >
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-green-50/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4"
        >
          <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
          <p className="text-sm font-bold text-navy">Caricato con successo!</p>
          <p className="text-[10px] text-navy-muted">Verrà aggiunto all'album a breve</p>
        </motion.div>
      )}

      <div className="w-16 h-16 bg-paper rounded-2xl flex items-center justify-center group-hover:bg-navy/5 transition-colors">
        <Icon className="w-8 h-8 text-gold" />
      </div>

      <div>
        <h3 className="text-lg font-serif text-navy mb-1">{title}</h3>
      </div>

      <div className="pt-4 flex flex-row w-full gap-2">
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1 py-3 bg-navy text-white rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-gold transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <Camera className="w-3 h-3" />
              Carica
            </>
          )}
        </button>

        <a
          href={albumUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 bg-paper text-navy rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-navy/5 transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-3 h-3" />
          Album
        </a>
      </div>
    </motion.div>
  )
}

// --- Navigation Component ---
const Navbar = ({ isOpen, isAuthenticated }) => {
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()
  const navigate = useNavigate()
  const location = useLocation()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious()
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  const handleNavClick = (id) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } })
    } else {
      const element = document.getElementById(id.toLowerCase())
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && isAuthenticated && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: hidden ? -100 : 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-[60] bg-highlight border-b border-navy/10 px-4 py-4 md:px-12 shadow-sm"
        >
          <ul className="max-w-7xl mx-auto flex justify-between items-center gap-2 md:gap-4">
            {['Location', 'Programma', 'Regalo', 'Foto', 'FAQ', 'RSVP'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => handleNavClick(item)}
                  className="text-[9px] md:text-xs uppercase tracking-[0.2em] font-bold text-navy-dark hover:text-white transition-colors cursor-pointer bg-transparent border-none p-1 md:p-2"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

// --- Home Component (Landing Page) ---

function Home({ isOpen, setIsOpen, isAuthenticated, onAuthenticated, dbPassword }) {
  const [isReady, setIsReady] = useState(false)
  const [isOpening, setIsOpening] = useState(false)

  const [showMonths, setShowMonths] = useState(false)
  const targetDate = new Date('2026-09-12T15:30:00')
  const navigate = useNavigate()
  const location = useLocation()

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attendance: '',
    dietary_requirements: '',
    message: '',
    privacyAccepted: false
  })
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [copiedId, setCopiedId] = useState(null)

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }


  useEffect(() => {
    if (document.readyState === 'complete') {
      setIsReady(true)
    } else {
      window.addEventListener('load', () => setIsReady(true))
      return () => window.removeEventListener('load', () => setIsReady(true))
    }
  }, [])

  useEffect(() => {
    if (isOpen && location.state?.scrollTo) {
      const id = location.state.scrollTo.toLowerCase()
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
          // Clear state to avoid scrolling again on back navigation
          window.history.replaceState({}, document.title)
        }
      }, 100)
    }
  }, [isOpen, location.state])

  const handleOpenEnvelope = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);
    setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('envelope-opened', 'true');
    }, 2400);
  }

  const handleRSVPSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.attendance) {
      alert('Per favore compila i campi obbligatori (*)')
      return
    }
    if (!formData.privacyAccepted) {
      alert('Per favore accetta l\'informativa sulla privacy per procedere')
      return
    }

    setIsSubmitting(true)
    setStatus(null)

    try {
      await submitRSVP(formData)
      setStatus('success')
      setFormData({
        name: '',
        email: '',
        attendance: '',
        dietary_requirements: '',
        message: '',
        privacyAccepted: false
      })
    } catch (error) {
      setStatus('error')
      alert('Si è verificato un errore durante l\'invio. Riprova più tardi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper bg-eucalyptus overflow-x-hidden pt-0 mt-0">
      <AnimatePresence>
        {!isReady && (
          <motion.div
            key="preloader"
            className="fixed inset-0 z-[100] bg-paper flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Loader2 className="w-8 h-8 text-navy animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReady && isOpen && !isAuthenticated && (
          <GuestAccess dbPassword={dbPassword} onAuthenticate={onAuthenticated} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReady && !isOpen && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#f3f0e7] px-4 perspective-[1500px] overflow-hidden"
            initial={{ opacity: 1 }}
            animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.8, ease: "easeOut" }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-[250vw] md:w-[150vw] xl:w-[120vw] aspect-[4/3] cursor-pointer"
              onClick={handleOpenEnvelope}
              initial={{ scale: 1 }}
              animate={isOpening ? { scale: 3 } : { scale: 1 }}
              transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-[#fcfbf9] rounded-none z-10 border border-navy/10 overflow-hidden"></div>
              <div className="absolute inset-0 z-20 pointer-events-none drop-shadow-2xl filter will-change-[filter]">
                <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  <polygon fill="#f9f7f3" points="0,0 200,150 0,300" stroke="rgba(0,0,0,0.04)" strokeWidth="1" strokeLinejoin="round" />
                  <polygon fill="#f9f7f3" points="400,0 200,150 400,300" stroke="rgba(0,0,0,0.04)" strokeWidth="1" strokeLinejoin="round" />
                  <polygon fill="#fdfdfc" points="0,300 200,150 400,300" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeLinejoin="round" />
                </svg>
              </div>
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2 z-30 pointer-events-none origin-top rounded-none filter drop-shadow-xl will-change-[transform,filter]"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: isOpening ? 180 : 0 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  <polygon fill="#f8f5f0" points="0,0 200,150 400,0" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeLinejoin="round" />
                </svg>
                <div
                  className="absolute left-1/2  pointer-events-auto"
                  style={{ transform: "translate(-50%, -50%) translateZ(1px)" }}
                >
                  <div className="w-[12vw] max-w-[150px] min-w-[100px] aspect-square flex items-center justify-center group filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] will-change-[filter]">
                    <img
                      src={sigillo}
                      alt=""
                      loading="eager"
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 will-change-transform block"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`transition-all duration-1000 ${isOpen && isAuthenticated ? 'opacity-100' : 'opacity-0 blur-lg pointer-events-none h-screen overflow-hidden'}`}>
        <section className="relative min-h-screen flex flex-col items-center justify-between text-center px-0 pt-12 overflow-hidden">
          {/* Background Image with Fixed Effect */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-scroll md:bg-fixed"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')"
              }}
            />
            {/* Overlay for Readability */}
            <div className="absolute inset-0 bg-paper/70 backdrop-blur-[1px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isOpen ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative z-10 flex flex-col items-center space-y-2 mt-auto mb-auto"
          >
            <h1 className="text-[clamp(4rem,12vw,11rem)] font-kunstler text-navy leading-[0.8] whitespace-nowrap">
              Federica e Federico
            </h1>
            <div className="flex items-center justify-center space-x-4 text-navy-muted">
              <div className="h-px w-12 bg-navy/20" />
              <Heart className="w-4 h-4" />
              <div className="h-px w-12 bg-navy/20" />
            </div>
            <p className="text-[clamp(0.9rem,3.5vw,1.5rem)] tracking-[0.3em] font-light text-navy-muted uppercase pt-2 whitespace-nowrap">
              12 Settembre 2026
            </p>
          </motion.div>

          {/* Spacer to keep content centered */}
          <div className="h-12 w-full relative z-10 invisible md:block" />
        </section>

        <section id="countdown" className="pt-16 pb-4 bg-navy">
          <div className="text-center mb-12">
            <h2 className="text-6xl text-paper mb-2 corsivo">Conto alla rovescia</h2>
            <p className="text-paper/80 perpetua text-sm">Manca sempre meno al nostro Sì!</p>
          </div>
          <Countdown targetDate={targetDate} showMonths={showMonths} />
        </section>

        <section id="citazione" className="py-32 flex flex-col items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-2xl"
          >
            <h3 className="text-3xl md:text-5xl font-script text-navy leading-relaxed">
              "Comincia da qui<br />
              il nostro per sempre"
            </h3>
          </motion.div>
        </section>

        <section className="pt-0 pb-24 px-4 relative overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col items-center">

            {/* Gallery Section */}
            <div className="w-full max-w-6xl mx-auto p-0 mb-16">
              <div
                className="grid gap-3 md:gap-4 w-full aspect-[4/5] md:aspect-video"
                style={{
                  gridTemplateColumns: '3fr 3fr 4fr',
                  gridTemplateRows: '37fr 13fr 50fr'
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative overflow-hidden shadow-lg border border-navy/5"
                >
                  <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="relative overflow-hidden shadow-lg border border-navy/5"
                >
                  <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative overflow-hidden shadow-lg border border-navy/5"
                  style={{ gridRow: '1 / span 2', gridColumn: '3' }}
                >
                  <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="relative overflow-hidden shadow-2xl border border-navy/5"
                  style={{ gridRow: '2 / span 2', gridColumn: '1 / span 2' }}
                >
                  <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative overflow-hidden shadow-lg border border-navy/5"
                  style={{ gridColumn: '3', gridRow: '3' }}
                >
                  <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="" />
                </motion.div>
              </div>
            </div>

            <CardSeparator />

            <div id="location" className="text-center mb-12 space-y-4">
              <h2 className="text-7xl md:text-5xl text-navy corsivo">Le location</h2>
              <p className="text-navy tracking-[0.5em] text-xs perpetua">Informazioni Utili</p>
            </div>


            <div className="flex flex-col items-center gap-16 w-full max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/60 backdrop-blur-md rounded-lg shadow-2xl border border-navy/5 flex flex-col w-full max-w-2xl group overflow-hidden"
              >
                <div className="w-full relative overflow-hidden flex items-center justify-center p-4 md:p-6">
                  <motion.img
                    src={chiesa}
                    alt="Chiesa di San Giuseppe Calasanzio"
                    whileHover={{ scale: 1.02 }}
                    className="w-full h-auto max-h-[500px] object-contain shadow-lg"
                  />
                </div>
                <div className="pt-7 pb-7 text-center">
                  <span className="text-navy/70 text-[18px] tracking-[0.2em] perpetua">La Cerimonia</span>
                </div>

                <div className="pb-10 flex flex-col items-center text-center space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-3xl text-navy font-medium perpetuaGrassetto">Chiesa di San Giuseppe Calasanzio</h3>
                    <p className="text-navy font-light text-[16px] px-4 tracking-[0.01em] stampatelloMinuscolo">Via Don Carlo Gnocchi, 16 – 20148 Milano (MI)</p>
                  </div>
                  <div className="text-navy/70 text-[18px] tracking-[0.1em] perpetua">
                    Ore 15:30
                  </div>
                  <div className="pt-4">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Chiesa+di+San+Giuseppe+Calasanzio+Via+Don+Carlo+Gnocchi+16+20148+Milano"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group inline-flex items-center gap-3 px-8 py-4 bg-navy text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-navy/90 hover:shadow-xl hover:-translate-y-1 transition-all shadow-md"
                    >
                      <MapPin className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform" />
                      <span>Apri su Google Maps</span>
                      <div className="absolute -inset-1 bg-gold/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </a>
                  </div>
                </div>
              </motion.div>



              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/60 backdrop-blur-md rounded-lg shadow-2xl border border-navy/5 flex flex-col w-full max-w-2xl group overflow-hidden"
              >
                <div className="w-full relative overflow-hidden flex items-center justify-center p-4 md:p-6">
                  <motion.img
                    src={villa}
                    alt="Villa Valenca"
                    whileHover={{ scale: 1.02 }}
                    className="w-full h-auto max-h-[500px] object-contain shadow-lg"
                  />
                </div>
                <div className="pt-5 pb-7 text-center">
                  <span className="text-navy/70 text-[18px] tracking-[0.2em] perpetua">Il Ricevimento</span>
                </div>

                <div className="pb-10 flex flex-col items-center text-center space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-3xl text-navy font-medium perpetuaGrassetto">Villa Valenca</h3>
                    <p className="text-navy font-light text-[16px] px-4 tracking-[0.01em] stampatelloMinuscolo">Via Bersini Don Luigi, 20 – 25038 Rovato (BS)</p>
                  </div>
                  <div className="pt-4">
                    <a
                      href="https://maps.app.goo.gl/kdcajB4Ycqnvi7K5A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group inline-flex items-center gap-3 px-8 py-4 bg-navy text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-navy/90 hover:shadow-xl hover:-translate-y-1 transition-all shadow-md"
                    >
                      <MapPin className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform" />
                      <span>Apri su Google Maps</span>
                      <div className="absolute -inset-1 bg-gold/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            <CardSeparator />

            <div id="programma" className="w-full max-w-4xl">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-7xl md:text-5xl text-navy corsivo">Il programma</h2>
                <p className="text-navy tracking-[0.5em] text-xs perpetua">Il nostro giorno insieme</p>
              </div>
              <div className="w-full max-w-4xl mx-auto px-4">
                <div className="relative">
                  {/* Central Vertical Line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-navy -translate-x-1/2" />
                  <TimelineItem isLeft time="15:30" title="La Cerimonia" icon={cerimoniaSvg} />
                  <TimelineItem isLeft={false} time="18:00" title="L'Aperitivo" icon={aperitivoSvg} />
                  <TimelineItem isLeft time="19:30" title="La Cena" icon={posateSvg} />
                  <TimelineItem isLeft={false} time="22:00" title="Il Taglio della torta" icon={tortaSvg} />
                  <TimelineItem isLeft time="23:00" title="La Festa" icon={inizioFestaSvg} />
                  <TimelineItem isLeft={false} time="02:00" title="La buonanotte" icon={PartyPopper} isLast />
                </div>
              </div>
            </div>
          </div>
        </section>

        <CardSeparator />

        <section id="regalo" className="px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-16 space-y-7">
              <h2 className="text-7xl md:text-5xl text-navy corsivo leading-[3.5rem]">Il regalo <br />più grande</h2>
              <p className="text-navy tracking-[0.5em] text-xs perpetua">Un gesto d'amore</p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-md p-10 md:p-16 rounded-lg border border-navy/5 shadow-2xl relative overflow-hidden group"
            >
              <div className="relative z-10 space-y-8">
                <p className="text-navy/70 leading-relaxed max-w-lg mx-auto font-light">
                  Il pensiero più bello che possiate <br /> farci è essere con noi <br /> nel nostro grande giorno. <br />
                  Ma se desiderate aiutarci a realizzare <br /> il nostro sogno di viaggio <br /> nel <span className="text-3xl text-navy corsivo">Sudafrica</span>, <br />
                  qui trovate le coordinate per farlo: <br />
                </p>
                <div className="pt-4 flex flex-col items-center space-y-4">
                  <div className="bg-paper py-6 px-0 rounded-lg border border-navy/5 card-shadow flex flex-col space-y-6 items-center w-full">
                    <div className="flex flex-col items-center space-y-2 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-navy-muted uppercase tracking-[0.3em] font-bold">IBAN</span>
                        <button
                          onClick={() => handleCopy("IT20 W036 6901 6001 1070 1979 531", "iban")}
                          className="p-1.5 hover:bg-navy/5 rounded-lg transition-colors text-navy-muted hover:text-navy group/copy"
                          title="Copia IBAN"
                        >
                          {copiedId === "iban" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-navy text-xs md:text-sm tracking-[0.01rem] text-center perpetua">
                        IT20 W036 6901 6001 1070 1979 531
                      </p>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-navy-muted uppercase tracking-[0.3em] font-bold">Intestato a</span>
                        <button
                          onClick={() => handleCopy("F Pulejo & F Minnella", "payee")}
                          className="p-1.5 hover:bg-navy/5 rounded-lg transition-colors text-navy-muted hover:text-navy group/copy"
                          title="Copia Intestatario"
                        >
                          {copiedId === "payee" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-navy perpetua tracking-wide text-[13px]">
                        F Pulejo & F Minnella
                      </p>
                    </div>
                  </div>

                </div>
                <p className="text-navy/70 leading-relaxed max-w-lg mx-auto font-light">
                  Ogni gesto sarà per noi <br /> un ricordo prezioso che porteremo <br /> in valigia e nel cuore. <br />
                  Grazie per essere parte <br /> di questa nostra avventura!
                </p>
              </div>
            </motion.div>
          </div>
        </section >

        <CardSeparator />

        <section id="foto" className="px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-7">
              <h2 className="text-7xl md:text-5xl text-navy corsivo leading-[3.5rem]">Condividi <br />i tuoi scatti</h2>
              <p className="text-navy tracking-[0.5em] text-xs perpetua">I vostri ricordi con noi</p>
            </div>

            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-navy/70 leading-relaxed font-light">
                Aiutateci a rendere indelebile questo giorno! <br /> Abbiamo creato un album dedicato <br /> per raccogliere i vostri scatti più belli.<br />
                Caricate le vostre foto per condividerle <br /> con noi e con tutti gli ospiti.
              </p>
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/foto')}
                className="relative group inline-flex items-center gap-3 px-8 py-4 bg-navy text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-navy/90 hover:shadow-xl hover:-translate-y-1 transition-all shadow-md"
              >
                <Camera className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform" />
                <span>Carica le tue foto</span>
                <div className="absolute -inset-1 bg-gold/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </motion.button>

            </div>
          </div>
        </section>

        <CardSeparator />

        <section id="faq" className="px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-7">
              <h2 className="text-7xl md:text-5xl text-navy corsivo leading-[3.5rem]">Domande frequenti</h2>
              <p className="text-navy tracking-[0.5em] text-xs perpetua">Tutto quello che c'è da sapere</p>
            </div>
            <FAQAccordion />
          </div>
        </section>

        <CardSeparator />

        {/* RSVP Section */}
        <section id="rsvp" className="pb-20 px-4">
          <div className="max-w-xl mx-auto flex flex-col justify-center items-center">
            <div className="text-center mb-16 space-y-7">
              <h2 className="text-7xl md:text-5xl text-navy corsivo leading-[3.5rem]">Conferma <br /> la tua presenza</h2>
              <p className="text-navy tracking-[0.5em] text-xs perpetua uppercase">Non vediamo l'ora di festeggiare con voi</p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-lg border border-navy/5 shadow-2xl relative overflow-hidden group w-full"
            >



              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-100 p-8 rounded-xl text-center"
                >
                  <PartyPopper className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-serif text-navy mb-2">Grazie mille!</h3>
                  <p className="text-navy-muted">La tua conferma è stata inviata con successo.</p>
                  <button
                    onClick={() => setStatus(null)}
                    className="mt-6 text-xs font-bold text-navy uppercase tracking-widest border-b border-navy/20 pb-1"
                  >
                    Invia un'altra risposta
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleRSVPSubmit}>
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold text-navy uppercase tracking-widest">Inserisci nome e cognome *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Il tuo nome"
                      className="w-full p-4 bg-paper rounded border border-navy/10 focus:border-navy focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold text-navy uppercase tracking-widest">Email (opzionale)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                      className="w-full p-4 bg-paper rounded border border-navy/10 focus:border-navy focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-4 text-left pt-2">
                    <label className="text-xs font-bold text-navy uppercase tracking-widest">Parteciperai? *</label>
                    <div className="flex space-x-8">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="attendance"
                          required
                          value="yes"
                          checked={formData.attendance === 'yes'}
                          onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                          className="w-5 h-5 accent-navy"
                        />
                        <span className="text-navy-muted">Sì, ci sarò</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="attendance"
                          value="no"
                          checked={formData.attendance === 'no'}
                          onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                          className="w-5 h-5 accent-navy"
                        />
                        <span className="text-navy-muted">No, non potrò venire</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold text-navy uppercase tracking-widest">Allergie o intolleranze alimentari</label>
                    <textarea
                      value={formData.dietary_requirements}
                      onChange={(e) => setFormData({ ...formData, dietary_requirements: e.target.value })}
                      placeholder="Esempi: celiachia, allergia alle noci, vegetariano..."
                      rows="3"
                      className="w-full p-4 bg-paper rounded border border-navy/10 focus:border-navy focus:outline-none transition-colors resize-none"
                    ></textarea>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold text-navy uppercase tracking-widest">Messaggio agli sposi</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Lasciate un messaggio per noi..."
                      rows="4"
                      className="w-full p-4 bg-paper rounded border border-navy/10 focus:border-navy focus:outline-none transition-colors resize-none"
                    ></textarea>
                  </div>


                  <div className="space-y-4 pt-4 border-t border-navy/5">
                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          required
                          checked={formData.privacyAccepted}
                          onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                          className="w-5 h-5 accent-navy cursor-pointer"
                        />
                      </div>
                      <span className="text-[11px] text-navy-muted leading-relaxed group-hover:text-navy transition-colors">
                        Dichiaro di aver preso visione dell'
                        <button
                          type="button"
                          onClick={() => setShowPrivacyModal(true)}
                          className="text-navy font-bold underline underline-offset-2 ml-1"
                        >
                          Informativa sulla Privacy
                        </button>
                        &nbsp;e acconsento al trattamento dei miei dati personali per le finalità descritte.
                      </span>
                    </label>
                  </div>

                  <button
                    disabled={isSubmitting || !formData.privacyAccepted}
                    className="relative w-full py-4 bg-navy text-white rounded-2xl hover:bg-navy/90 hover:shadow-xl hover:-translate-y-1 transition-all font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-md group"
                  >
                    <div className="absolute -inset-1 bg-gold/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-gold  group-hover:rotate-12 transition-transform" />}
                      <span>{isSubmitting ? 'Inviando...' : 'Invia conferma'}</span>
                    </div>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>



        <footer className="py-6 px-4 text-center space-y-2 bg-navy text-white/90">
          <div className="space-y-2">
            <h2 className="text-5xl font-kunstler">Federica e Federico</h2>
            <p className="text-white/60 tracking-widest uppercase text-xs perpetua">12 Settembre 2026</p>
          </div>
          <div className="pt-8 grid grid-cols-2 gap-4 max-w-md mx-auto border-t border-white/5">
            <div className="space-y-1">
              <p className="text-[13px] tracking-[0.2em] text-white/40 perpetuaGrassetto">Federica</p>
              <a href="tel:+393892858728" className="text-sm text-white/80 hover:text-white transition-colors tracking-widest">+39 389 285 8728</a>
            </div>
            <div className="space-y-1">
              <p className="text-[13px] tracking-[0.2em] text-white/40 font-bold perpetuaGrassetto">Federico</p>
              <a href="tel:+393332114838" className="text-sm text-white/80 hover:text-white transition-colors tracking-widest">+39 333 211 4838</a>
            </div>
          </div>
          {/* <p className="text-xs text-white/40 pt-8 tracking-[0.2em]">Fatto con amore da LucAi</p> */}
        </footer>



        {/* Privacy Modal */}
        <AnimatePresence>
          {showPrivacyModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacyModal(false)}
              className="fixed inset-0 z-[100] bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] p-10 md:p-16 shadow-2xl relative cursor-default"
              >
                <div className="space-y-6 text-navy-muted leading-relaxed">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif text-navy mb-2">Informativa Privacy</h2>
                    <p className="text-gold text-[10px] uppercase tracking-widest font-bold">Matrimonio Federica & Federico</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-navy font-bold uppercase text-xs tracking-widest border-b border-navy/10 pb-2">1. Responsabile del Trattamento</h4>
                    <p className="text-sm">I dati personali raccolti tramite questo form sono gestiti direttamente dagli sposi (<span className="text-navy font-medium">Federica e Federico</span>), nel rispetto della riservatezza e della privacy degli invitati.</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-navy font-bold uppercase text-xs tracking-widest border-b border-navy/10 pb-2">2. Finalità del Trattamento</h4>
                    <p className="text-sm">I dati (nome, email, presenze, messaggi) vengono utilizzati esclusivamente per scopi legati all'organizzazione del matrimonio, come la gestione delle presenze, dei tavoli e l'eventuale invio di ringraziamenti post-evento.</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-navy font-bold uppercase text-xs tracking-widest border-b border-navy/10 pb-2">3. Dati Sensibili (Allergie)</h4>
                    <p className="text-sm">Le informazioni riguardanti allergie o necessità alimentari sono trattate con estrema cura e verranno comunicate ai responsabili del catering (Villa Valenca) in forma strettamente necessaria per garantire un servizio sicuro, senza diffondere ulteriori dati personali.</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-navy font-bold uppercase text-xs tracking-widest border-b border-navy/10 pb-2">4. Conservazione e Cancellazione</h4>
                    <p className="text-sm">I dati verranno conservati nel database protetto (Supabase) per il tempo strettamente necessario all'organizzazione dell'evento e verranno eliminati una volta concluso il periodo del matrimonio e dei saluti finali.</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-navy font-bold uppercase text-xs tracking-widest border-b border-navy/10 pb-2">5. I tuoi Diritti</h4>
                    <p className="text-sm">Puoi richiedere in qualsiasi momento la modifica o la cancellazione della tua risposta contattandoci direttamente (via telefono o WhatsApp).</p>
                  </div>

                  <div className="pt-8 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setShowPrivacyModal(false)}
                      className="px-10 py-4 bg-navy text-white rounded-full font-bold tracking-widest uppercase text-xs hover:bg-gold transition-colors shadow-lg"
                    >
                      Chiudi
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main >
    </div >
  )
}

// --- Login Component ---

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate('/dashboard')
      }
    }
    checkUser()
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert('Credenziali non valide: ' + error.message)
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-paper bg-eucalyptus flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-navy/5 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif text-navy">Area Riservata</h1>
          <p className="text-navy-muted text-sm mt-2">Accedi per visualizzare le risposte</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-navy uppercase tracking-widest">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-paper rounded-xl border border-navy/10 focus:border-navy focus:outline-none transition-colors"
              placeholder="latua@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-navy uppercase tracking-widest">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-paper rounded-xl border border-navy/10 focus:border-navy focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            disabled={loading}
            className="w-full py-4 bg-navy text-white rounded-xl font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 hover:bg-navy/90 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accedi'}
          </button>
        </form>

        <p className="text-center text-[10px] text-navy-muted mt-8 uppercase tracking-widest">
          Federica & Federico 2026
        </p>
      </motion.div>
    </div>
  )
}

// --- Dedicated Photo Gallery Page ---
function PhotoGallery() {
  const [albumSettings, setAlbumSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('album_settings')
        .select('*')
        .eq('is_visible', true)
        .order('id', { ascending: true })
      if (data) setAlbumSettings(data)
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const iconComponents = {
    Camera,
    Church,
    Cake,
    Music2,
    Music,
    Users,
    Heart,
    GlassWater,
    Gift,
    Sparkles
  }

  return (
    <div className="min-h-screen bg-paper bg-eucalyptus py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => {
            sessionStorage.setItem('envelope-opened', 'true');
            navigate('/');
          }}
          className="mb-12 text-navy-muted hover:text-navy transition-colors flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold"
        >
          ← Torna alla Home
        </button>

        <div className="text-center mb-16 space-y-4">
          <h1 className="text-7xl text-navy corsivo">I vostri ricordi</h1>
          <p className="text-navy/60 max-w-2xl mx-auto font-light leading-relaxed">
            Scegliete la categoria e caricate le vostre foto. Ogni scatto sarà un regalo prezioso per noi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albumSettings.map((cat) => (
            <PhotoCard
              key={cat.id}
              title={cat.display_title}
              icon={iconComponents[cat.icon_name] || iconComponents[cat.category_key] || Camera}
              categoryKey={cat.category_key}
              albumUrl={cat.share_url || '#'}
              albumTitle={cat.google_album_title}
            />
          ))}
          {loading && (
            <div className="col-span-full text-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-gold mx-auto mb-4" />
              <p className="text-navy-muted font-serif">Caricamento gallerie...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Main App Component (Routing) ---
export default function App() {
  const [isOpen, setIsOpen] = useState(() => {
    return sessionStorage.getItem('envelope-opened') === 'true'
  })
  const [isGuestAuthenticated, setIsGuestAuthenticated] = useState(false)
  const [dbGuestPassword, setDbGuestPassword] = useState('')
  const [isCheckingGuestAuth, setIsCheckingGuestAuth] = useState(true)

  useEffect(() => {
    const checkGuestAuth = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'guest_password')
        .maybeSingle()

      const currentPassword = data?.value?.trim() || ''
      setDbGuestPassword(currentPassword)

      const storedHash = localStorage.getItem('guest_auth_hash')
      if (storedHash && currentPassword) {
        const currentHash = await hashPassword(currentPassword)
        if (storedHash === currentHash) {
          setIsGuestAuthenticated(true)
        }
      }
      setIsCheckingGuestAuth(false)
    }
    checkGuestAuth()
  }, [])

  if (isCheckingGuestAuth) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-navy animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Navbar isOpen={isOpen} isAuthenticated={isGuestAuthenticated} />
      <Routes>
        <Route path="/" element={
          <Home
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isAuthenticated={isGuestAuthenticated}
            onAuthenticated={() => setIsGuestAuthenticated(true)}
            dbPassword={dbGuestPassword}
          />
        } />
        <Route path="/foto" element={<PhotoGallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}
