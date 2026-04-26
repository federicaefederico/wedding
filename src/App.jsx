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
  ExternalLink
} from 'lucide-react'
import sigillo from './assets/sigillo.png'
import chiesa from './assets/chiesa.jpeg'
import villa from './assets/villa.jpeg'
import { intervalToDuration, format, differenceInDays } from 'date-fns'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { submitRSVP } from './services/rsvpService'
import { supabase } from './lib/supabaseClient'
import Dashboard from './components/Dashboard'

// --- Components ---

const CardSeparator = () => (
  <div className="flex items-center justify-center w-full py-12 px-4 overflow-hidden">
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

const TimelineItem = ({ time, title, subtitle, icon: Icon, isLast }) => (
  <div className="relative pl-12 pb-12 last:pb-0 group">
    {!isLast && <div className="timeline-line" />}
    <div className="absolute left-0 top-0 w-10 h-10 bg-white border border-navy/20 rounded-full flex items-center justify-center z-10 card-shadow group-hover:border-navy transition-colors">
      <Icon className="w-5 h-5 text-navy" />
    </div>
    <div className="timeline-dot" />
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="text-left"
    >
      <div className="inline-block bg-navy text-white text-sm px-3 py-1 rounded-md mb-2 font-medium">
        {time}
      </div>
      <h4 className="text-xl font-serif text-navy mb-1">{title}</h4>
      <p className="text-navy-muted text-sm">{subtitle}</p>
    </motion.div>
  </div>
)

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
      a: "Vi preghiamo di confermare la vostra presenza entro il 12 Luglio 2026 utilizzando il modulo RSVP qui sotto o contattandoci direttamente."
    },
    {
      q: "C'è un dress code particolare?",
      a: "L'abito formale è gradito. Tenete presente che parte del ricevimento si terrà nei giardini della villa, quindi vi consigliamo calzature comode per il prato."
    },
    {
      q: "Cosa devo fare se ho allergie o restrizioni alimentari?",
      a: "Potete indicare qualsiasi allergia o intolleranza direttamente nel modulo RSVP. Avviseremo lo chef per garantirvi un menu dedicato."
    },
    {
      q: "I bambini sono i benvenuti?",
      a: "Certamente! I più piccoli sono i benvenuti e sarà previsto per loro un menù dedicato. Se avete esigenze particolari, saremo felici di fare il possibile per soddisfarle.\n\nTuttavia, desideriamo informarvi che, data l’atmosfera intima della location e il mood della serata, non sono previste aree gioco o servizi di animazione.\n\nVi chiediamo gentilmente di segnalarci in anticipo eventuali necessità specifiche, come la disponibilità di seggioloni o spazi per culle, così da poterci organizzare al meglio."
    },
    {
      q: "È disponibile un parcheggio presso la Villa?",
      a: "Sì, Villa Valenca dispone di un ampio parcheggio privato e gratuito a disposizione di tutti gli ospiti."
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
        <p className="text-xs text-navy-muted font-light leading-relaxed">{desc}</p>
      </div>

      <div className="pt-4 flex flex-col w-full space-y-3">
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
          className="w-full py-3 bg-navy text-white rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-gold transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Caricando {uploadCount.current}/{uploadCount.total}...</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              Carica Foto
            </>
          )}
        </button>

        <a
          href={albumUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-paper text-navy rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-navy/5 transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Vedi Album
        </a>
      </div>
    </motion.div>
  )
}

// --- Home Component (Landing Page) ---

function Home() {
  const [isReady, setIsReady] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [showMonths, setShowMonths] = useState(false)
  const targetDate = new Date('2026-09-12T15:30:00')
  const navigate = useNavigate()

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

  useEffect(() => {
    if (document.readyState === 'complete') {
      setIsReady(true)
    } else {
      window.addEventListener('load', () => setIsReady(true))
      return () => window.removeEventListener('load', () => setIsReady(true))
    }
  }, [])

  const handleOpenEnvelope = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);
    setTimeout(() => {
      setIsOpen(true);
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
          />
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

      <main className={`transition-all duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0 blur-lg pointer-events-none h-screen overflow-hidden'}`}>
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

          {/* Navigation Menu (Z-index 10) */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={isOpen ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 1 }}
            className="w-full relative z-10"
          >
            <ul className="w-full flex justify-between items-center px-4 md:px-20">
              {['Dettagli', 'Programma', 'Regalo', 'Foto', 'FAQ', 'RSVP'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      const element = document.getElementById(item.toLowerCase());
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-navy hover:text-navy/70 transition-colors no-underline cursor-pointer bg-transparent border-none p-0"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 flex flex-col items-center space-y-2"
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

        <section id="countdown" className="py-20 bg-navy">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-paper mb-2">Conto alla rovescia</h2>
            <p className="text-paper/80">Per il giorno più speciale della nostra vita</p>
          </div>
          <Countdown targetDate={targetDate} showMonths={showMonths} />
        </section>

        <CardSeparator />

        <section id="citazione" className="py-32 flex flex-col items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-2xl"
          >
            <h3 className="text-3xl md:text-5xl font-script text-navy leading-relaxed">
              "Vieni per il nostro amore, resta per la torta!"
            </h3>
            <div className="mt-12 flex justify-center">
              <div className="w-24 h-24 border border-navy/10 rounded-full flex items-center justify-center bg-white card-shadow">
                <UtensilsCrossed className="w-8 h-8 text-gold" />
              </div>
            </div>
          </motion.div>
        </section>

        <CardSeparator />

        <section id="dettagli" className="py-24 px-4 bg-navy/[0.03] relative overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <div className="text-center mb-16 space-y-2">
              <h2 className="text-4xl md:text-5xl font-serif text-navy font-script">I Dettagli</h2>
              <p className="text-navy-muted tracking-[0.2em] uppercase text-xs font-bold">Informazioni Utili</p>
              <div className="w-24 h-px bg-gold/30 mx-auto mt-4" />
            </div>

            <div className="flex flex-col items-center gap-0 w-full max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-navy/10 border border-navy/5 flex flex-col w-full max-w-2xl group"
              >
                <div className="w-full relative overflow-hidden flex items-center justify-center p-4 md:p-6 bg-white">
                  <motion.img
                    src={chiesa}
                    alt="Chiesa di San Giuseppe Calasanzio"
                    whileHover={{ scale: 1.02 }}
                    className="w-full h-auto max-h-[500px] object-contain shadow-lg"
                  />
                </div>
                <div className="p-10 flex flex-col items-center text-center space-y-6">
                  <div className="space-y-3">
                    <span className="text-gold font-bold text-[10px] tracking-[0.3em] uppercase">La Cerimonia</span>
                    <h3 className="text-3xl font-serif text-navy font-medium">Chiesa di San Giuseppe Calasanzio</h3>
                    <p className="text-navy-muted font-light text-sm px-4">Via Don Carlo Gnocchi, 16 - Milano</p>
                  </div>
                  <div className="pt-4">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Chiesa+di+San+Giuseppe+Calasanzio+Via+Don+Carlo+Gnocchi+16+20148+Milano"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-3 px-8 py-4 bg-navy text-white rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gold transition-colors shadow-lg"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Apri su Google Maps</span>
                    </a>
                  </div>
                </div>
              </motion.div>

              <CardSeparator />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-navy/10 border border-navy/5 flex flex-col w-full max-w-2xl group"
              >
                <div className="w-full relative overflow-hidden flex items-center justify-center p-4 md:p-6 bg-white">
                  <motion.img
                    src={villa}
                    alt="Villa Valenca"
                    whileHover={{ scale: 1.02 }}
                    className="w-full h-auto max-h-[500px] object-contain shadow-lg"
                  />
                </div>
                <div className="p-10 flex flex-col items-center text-center space-y-6">
                  <div className="space-y-3">
                    <span className="text-gold font-bold text-[10px] tracking-[0.3em] uppercase">Il Ricevimento</span>
                    <h3 className="text-3xl font-serif text-navy font-medium">Villa Valenca</h3>
                    <p className="text-navy-muted font-light text-sm px-4">Via Don Luigi Bersini, 20 - Brescia</p>
                  </div>
                  <div className="pt-4">
                    <a
                      href="https://maps.app.goo.gl/kdcajB4Ycqnvi7K5A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-3 px-8 py-4 bg-navy text-white rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gold transition-colors shadow-lg"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Apri su Google Maps</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            <CardSeparator />

            {/* Gallery Section */}
            <div className="w-full max-w-6xl mx-auto p-0">
              <div
                className="grid gap-3 md:gap-4 w-full aspect-[4/5] md:aspect-video"
                style={{
                  gridTemplateColumns: '3fr 3fr 4fr',
                  gridTemplateRows: '37fr 13fr 50fr'
                }}
              >
                {/* Images X - Top Left area (summing to 60% width of the left part) */}
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

                {/* Image Y1 - Right column top half */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative overflow-hidden shadow-lg border border-navy/5"
                  style={{ gridRow: '1 / span 2', gridColumn: '3' }}
                >
                  <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="" />
                </motion.div>

                {/* Image Z - Bottom Left (60% width, 63% height) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="relative overflow-hidden shadow-2xl border border-navy/5"
                  style={{ gridRow: '2 / span 2', gridColumn: '1 / span 2' }}
                >
                  <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="" />
                </motion.div>

                {/* Image Y2 - Right column bottom half */}
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

            <div id="programma" className="pt-32 w-full max-w-4xl">
              <div className="text-center mb-16 space-y-2">
                <h2 className="text-3xl font-serif text-navy font-script">Il Programma</h2>
                <p className="text-navy-muted tracking-[0.2em] uppercase text-[10px] font-bold">Il Giorno più Bello</p>
              </div>
              <div className="max-w-2xl mx-auto px-4 md:px-0 bg-white/40 p-8 md:p-12 rounded-[2rem] border border-navy/5 flex justify-center">
                <div className="w-full max-w-md">
                  <TimelineItem time="15:00" title="Cerimonia" subtitle="Il momento del nostro sì" icon={Heart} />
                  <TimelineItem time="18:00" title="Aperitivo" subtitle="Nei giardini della villa" icon={GlassWater} />
                  <TimelineItem time="20:30" title="Cena" subtitle="Condivisione e allegria" icon={UtensilsCrossed} />
                  <TimelineItem time="22:15" title="Taglio della torta" subtitle="Il lato dolce della serata" icon={PartyPopper} />
                  <TimelineItem time="23:00" title="Festa" subtitle="Si balla fino alle ore 1:00" icon={Music2} />
                  <TimelineItem time="02:00" title="Fine della festa" subtitle="Saluti e bei ricordi" icon={PartyPopper} isLast />
                </div>
              </div>
            </div>
          </div>
        </section>

        <CardSeparator />

        <section id="regalo" className="py-24 px-4 bg-navy/[0.02]">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-16 space-y-2">
              <h2 className="text-3xl font-serif text-navy font-script">Il Regalo più Grande</h2>
              <p className="text-navy-muted tracking-[0.2em] uppercase text-[10px] font-bold">Un gesto d'amore</p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-md p-10 md:p-16 rounded-[3rem] border border-navy/5 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 text-navy/5 transform translate-x-4 -translate-y-4">
                <Heart className="w-24 h-24 stroke-[1px]" />
              </div>
              <div className="relative z-10 space-y-8">
                <p className="text-navy/70 leading-relaxed max-w-lg mx-auto font-light">
                  Il pensiero più bello che possiate farci è essere con noi nel nostro grande giorno.
                  Ma se desiderate aiutarci a realizzare il nostro sogno di viaggio nel <span className="font-bold text-navy">Sudafrica</span>,
                  qui trovate le coordinate per farlo:
                </p>
                <div className="pt-4 flex flex-col items-center space-y-4">
                  <div className="bg-paper p-6 rounded-2xl border border-navy/5 card-shadow flex flex-col space-y-2 items-center">
                    <span className="text-[10px] text-navy-muted uppercase tracking-[0.3em] font-bold">Codice IBAN</span>
                    <p className="text-navy font-mono text-sm md:text-md tracking-wider select-all">
                      IT00 A 0000 0000 0000 0000 0000 000
                    </p>
                  </div>
                  <p className="text-[10px] text-navy-muted italic lowercase tracking-wider">
                    Intestato a Federica & Federico
                  </p>
                </div>
                <p className="text-navy/70 leading-relaxed max-w-lg mx-auto font-light">
                  Ogni gesto sarà per noi un ricordo prezioso che porteremo in valigia e nel cuore.
                  Grazie di cuore per essere parte di questa nostra avventura!
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <CardSeparator />

        <section id="foto" className="py-24 px-4 bg-paper/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-2">
              <h2 className="text-3xl font-serif text-navy font-script">Condividi i tuoi scatti</h2>
              <p className="text-navy-muted tracking-[0.2em] uppercase text-[10px] font-bold">I vostri ricordi con noi</p>
            </div>

            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-navy/70 leading-relaxed font-light">
                Aiutateci a rendere indelebile questo giorno! Abbiamo creato degli album dedicati su <span className="font-bold text-navy">Google Foto</span> per raccogliere i vostri scatti più belli.
                Scegliete la categoria e caricate le vostre foto per condividerle con noi e con tutti gli ospiti.
              </p>
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/foto')}
                className="group relative px-12 py-6 bg-navy text-white rounded-full font-serif text-xl shadow-2xl hover:bg-navy/90 transition-all flex items-center gap-4"
              >
                <Camera className="w-6 h-6 text-gold group-hover:rotate-12 transition-transform" />
                <span>Carica le tue foto</span>
                <div className="absolute -inset-1 bg-gold/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.button>
            </div>
          </div>
        </section>

        <CardSeparator />

        <section id="faq" className="py-24 px-4 bg-white/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-2">
              <h2 className="text-3xl font-serif text-navy font-script">Domande Frequenti</h2>
              <p className="text-navy-muted tracking-[0.2em] uppercase text-[10px] font-bold">Tutto quello che c'è da sapere</p>
            </div>
            <FAQAccordion />
          </div>
        </section>

        <CardSeparator />

        {/* RSVP Section */}
        <section id="rsvp" className="py-20 px-4">
          <div className="max-w-xl mx-auto flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 md:p-12 rounded-lg card-shadow border border-navy/5"
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-serif text-navy mb-2 font-script">Conferma la tua presenza</h2>
                <p className="text-navy-muted">Non vediamo l'ora di festeggiare con voi</p>
              </div>


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
                        * e acconsento al trattamento dei miei dati personali per le finalità descritte.
                      </span>
                    </label>
                  </div>

                  <button
                    disabled={isSubmitting || !formData.privacyAccepted}
                    className="w-full py-4 bg-navy text-white rounded-md hover:bg-navy/90 transition-all font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isSubmitting ? 'Inviando...' : 'Invia conferma'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>



        <footer className="py-6 px-4 text-center space-y-2 bg-navy text-white/90">
          <Heart className="w-8 h-8 text-white mx-auto fill-white/20" />
          <div className="space-y-2">
            <h2 className="text-4xl font-kunstler">Federica e Federico</h2>
            <p className="text-white/60 tracking-widest uppercase text-sm">12 Settembre 2026</p>
          </div>
          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-sm mx-auto border-t border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Federica</p>
              <a href="tel:+393892858728" className="text-sm text-white/80 hover:text-white transition-colors tracking-widest">+39 389 285 8728</a>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Federico</p>
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
      </main>
    </div>
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

  const iconMap = {
    chiesa: Church,
    ingresso: Camera,
    torta: Cake,
    ballo: Music2,
    fuochi: Sparkles,
    ospiti: Users
  }

  return (
    <div className="min-h-screen bg-paper bg-eucalyptus py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-12 text-navy-muted hover:text-navy transition-colors flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold"
        >
          ← Torna alla Home
        </button>

        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-serif text-navy font-script">I vostri ricordi</h1>
          <p className="text-navy/60 max-w-2xl mx-auto font-light leading-relaxed">
            Scegliete la categoria e caricate le vostre foto. Ogni scatto sarà un regalo prezioso per noi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albumSettings.map((cat) => (
            <PhotoCard
              key={cat.id}
              title={cat.display_title}
              icon={iconMap[cat.category_key] || Camera}
              desc={cat.display_title === 'Insieme a voi' ? 'Selfie e sorrisi condivisi' : 'I momenti più belli'}
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
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/foto" element={<PhotoGallery />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}
