import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  MapPin,
  Volume2,
  VolumeX,
  Send,
  GlassWater,
  PartyPopper,
  UtensilsCrossed,
  Music2,
  ChevronDown
} from 'lucide-react'
import sigillo from './assets/sigillo.png'
import chiesa from './assets/chiesa.jpeg'
import villa from './assets/villa.jpeg'
import { intervalToDuration, format, differenceInDays } from 'date-fns'

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
          className="bg-white/50 backdrop-blur-sm border border-navy/10 p-6 rounded-lg text-center card-shadow"
        >
          <div className="text-4xl md:text-5xl font-serif text-navy mb-1">{item.value}</div>
          <div className="text-xs tracking-widest text-navy-muted uppercase font-medium">{item.label}</div>
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
          <div className="p-6 pt-0 text-navy-muted text-sm border-t border-navy/5 leading-relaxed">
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
      a: "Certamente! Fateci sapere se avrete bisogno di seggioloni o se volete segnalare menu particolari per i più piccoli."
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


export default function App() {
  const [isReady, setIsReady] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showMonths, setShowMonths] = useState(false) // Toggle tra 5 blocchi (true) e 4 blocchi (false)
  const targetDate = new Date('2026-09-12T17:00:00')

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
    }, 2400); // 1.8s di apertura + 0.6s di dissolvenza rapida
  }

  return (
    <div className="min-h-screen bg-paper overflow-x-hidden pt-0 mt-0">
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
            transition={{ duration: 0.6, delay: 1.8, ease: "easeOut" }} // Ritardo esatto per attendere l'apertura pulita (1.8s), poi svanisce subito
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-[250vw] md:w-[150vw] xl:w-[120vw] aspect-[4/3] cursor-pointer"
              onClick={handleOpenEnvelope}
              initial={{ scale: 1 }}
              animate={isOpening ? { scale: 3 } : { scale: 1 }} // Esclusivamente avvicinamento (zoom esteso) agli occhi
              transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
            >

              {/* Retro della busta */}
              <div className="absolute inset-0 bg-[#fcfbf9] rounded-none z-10 border border-navy/10 overflow-hidden"></div>

              {/* Corpo principale della busta */}
              <div className="absolute inset-0 z-20 pointer-events-none drop-shadow-2xl filter will-change-[filter]">
                <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  {/* Aletta Sinistra */}
                  <polygon fill="#f9f7f3" points="0,0 200,150 0,300" stroke="rgba(0,0,0,0.04)" strokeWidth="1" strokeLinejoin="round" />
                  {/* Aletta Destra */}
                  <polygon fill="#f9f7f3" points="400,0 200,150 400,300" stroke="rgba(0,0,0,0.04)" strokeWidth="1" strokeLinejoin="round" />
                  {/* Aletta Inferiore */}
                  <polygon fill="#fdfdfc" points="0,300 200,150 400,300" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Aletta Superiore e Sigillo - altezza esattamente 50% */}
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2 z-30 pointer-events-none origin-top rounded-none filter drop-shadow-xl will-change-[transform,filter]"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: isOpening ? 180 : 0 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* ViewBox combacia con l'altezza: 150 su una larghezza 400 */}
                <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  <polygon fill="#f8f5f0" points="0,0 200,150 400,0" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeLinejoin="round" />
                </svg>

                {/* Sigillo solidale (top-full significa esattamente al bordo inferiore dell'aletta, cioè al centro perfetto della busta totale) */}
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
      {/* --- Main Content --- */}
      <main className={`transition-all duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0 blur-lg pointer-events-none h-screen overflow-hidden'}`}>

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            {/* Header Decoration */}
            <div className="flex items-center justify-center space-x-4 text-navy-muted mb-8">
              <div className="h-px w-12 bg-navy/20" />
              <Heart className="w-4 h-4" />
              <div className="h-px w-12 bg-navy/20" />
            </div>

            <h1 className="text-6xl md:text-8xl font-serif text-navy">Federica & Federico</h1>
            <p className="text-xl md:text-2xl tracking-[0.3em] font-light text-navy-muted uppercase py-4">
              12 Settembre 2026
            </p>
            <div className="pt-8">
              <p className="font-script text-3xl text-navy/80">Conferma la tua presenza</p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mt-4 text-navy-muted"
              >
                <ChevronDown className="mx-auto" />
              </motion.div>
            </div>
          </motion.div>
        </section>

        <CardSeparator />

        {/* Countdown Section */}
        <section className="py-20 bg-white/30">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-navy mb-2">Conto alla rovescia</h2>
            <p className="text-navy-muted">Per il giorno più speciale della nostra vita</p>
          </div>
          <Countdown targetDate={targetDate} showMonths={showMonths} />
        </section>

        <CardSeparator />

        {/* Quote Section */}
        <section className="py-32 flex flex-col items-center text-center px-4">
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

        {/* Details Section */}
        <section id="detalles" className="py-24 px-4 bg-navy/[0.03] relative overflow-hidden">
          {/* Subtle background pattern/decoration if needed, but keeping it clean for now */}
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <div className="text-center mb-16 space-y-2">
              <h2 className="text-4xl md:text-5xl font-serif text-navy font-script">I Dettagli</h2>
              <p className="text-navy-muted tracking-[0.2em] uppercase text-xs font-bold">Informazioni Utili</p>
              <div className="w-24 h-px bg-gold/30 mx-auto mt-4" />
            </div>

            <div className="flex flex-col items-center gap-0 w-full max-w-4xl mx-auto">
              {/* Cerimonia Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-navy/10 border border-navy/5 flex flex-col w-full max-w-2xl group"
              >
                <div className="h-64 md:h-80 relative overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${chiesa})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-10 flex flex-col items-center text-center space-y-6">
                  <div className="space-y-3">
                    <span className="text-gold font-bold text-[10px] tracking-[0.3em] uppercase">La Cerimonia</span>
                    <h3 className="text-3xl font-serif text-navy font-medium">Chiesa di San Giuseppe Calasanzio</h3>
                    <p className="text-navy-muted font-light italic text-sm px-4">Via Don Carlo Gnocchi, 16, 20148 Milano MI</p>
                  </div>

                  <div className="pt-4">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Chiesa+di+San+Giuseppe+Calasanzio+Via+Don+Carlo+Gnocchi+16+20148+Milano"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-3 px-8 py-4 bg-navy text-white rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gold transition-all duration-300 shadow-lg hover:shadow-gold/20"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Apri su Google Maps</span>
                    </a>
                  </div>
                </div>
              </motion.div>

              <CardSeparator />

              {/* Ricevimento Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-navy/10 border border-navy/5 flex flex-col w-full max-w-2xl group"
              >
                <div className="h-64 md:h-80 relative overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${villa})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-10 flex flex-col items-center text-center space-y-6">
                  <div className="space-y-3">
                    <span className="text-gold font-bold text-[10px] tracking-[0.3em] uppercase">Il Ricevimento</span>
                    <h3 className="text-3xl font-serif text-navy font-medium">Villa Valenca</h3>
                    <p className="text-navy-muted font-light italic text-sm px-4">Via Bersini Don Luigi, 20, 25038 Rovato BS</p>
                  </div>

                  <div className="pt-4">
                    <a
                      href="https://maps.app.goo.gl/kdcajB4Ycqnvi7K5A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-3 px-8 py-4 bg-navy text-white rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gold transition-all duration-300 shadow-lg hover:shadow-gold/20"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Apri su Google Maps</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            <CardSeparator />

            {/* Program / Timeline */}
            <div className="pt-32 w-full max-w-4xl">
              <div className="text-center mb-16 space-y-2">
                <h2 className="text-3xl font-serif text-navy font-script">Il Programma</h2>
                <p className="text-navy-muted tracking-[0.2em] uppercase text-[10px] font-bold">Il Giorno più Bello</p>
              </div>

              <div className="max-w-2xl mx-auto px-4 md:px-0 bg-white/40 p-8 md:p-12 rounded-[2rem] border border-navy/5">
                <TimelineItem time="15:00" title="Cerimonia" subtitle="Il momento del nostro sì" icon={Heart} />
                <TimelineItem time="18:00" title="Aperitivo" subtitle="Nei giardini della villa" icon={GlassWater} />
                <TimelineItem time="20:30" title="Cena" subtitle="Condivisione e allegria" icon={UtensilsCrossed} />
                <TimelineItem time="22:15" title="Taglio della torta" subtitle="Il lato dolce della serata" icon={PartyPopper} />
                <TimelineItem time="23:00" title="Festa" subtitle="Si balla fino alle ore 1:00" icon={Music2} />
                <TimelineItem time="02:00" title="Fine della festa" subtitle="Saluti e bei ricordi" icon={PartyPopper} isLast />
              </div>
            </div>
          </div>
        </section>

        <CardSeparator />

        <section className="py-24 px-4 bg-white/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-2">
              <h2 className="text-3xl font-serif text-navy font-script">Domande Frequenti</h2>
              <p className="text-navy-muted tracking-[0.2em] uppercase text-[10px] font-bold">Tutto quello che c'è da sapere</p>
            </div>

            <FAQAccordion />
          </div>
        </section>

        <CardSeparator />

        {/* Gifts Section */}
        <section className="py-24 px-4 bg-navy/[0.02]">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-16 space-y-2">
              <h2 className="text-3xl font-serif text-navy font-script">Il Regalo più Grande</h2>
              <p className="text-navy-muted tracking-[0.2em] uppercase text-[10px] font-bold">Un gesto d'amore</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-md p-10 md:p-16 rounded-[3rem] border border-navy/5 shadow-2xl shadow-navy/5 relative overflow-hidden group"
            >
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 p-8 text-navy/5 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                <Heart className="w-24 h-24 stroke-[1px]" />
              </div>

              <div className="relative z-10 space-y-8">
                <p className="text-navy/70 leading-relaxed max-w-lg mx-auto font-light">
                  La vostra presenza nel nostro giorno più importante è per noi il dono più prezioso.
                  Tuttavia, se desiderate farci un pensiero, abbiamo scelto di raccogliere il vostro contributo
                  per realizzare il nostro sogno di una <span className="font-bold text-navy">luna di miele indimenticabile</span>.
                </p>

                <div className="pt-4 inline-block">
                  <div className="bg-paper p-6 rounded-2xl border border-navy/5 card-shadow flex flex-col space-y-2 items-center">
                    <span className="text-[10px] text-navy-muted uppercase tracking-[0.3em] font-bold">Codice IBAN</span>
                    <p className="text-navy font-mono text-sm md:text-md tracking-wider select-all">
                      IT00 A 0000 0000 0000 0000 0000 000
                    </p>
                  </div>
                  <p className="mt-4 text-[10px] text-navy-muted italic lowercase tracking-wider">
                    Intestato a Federica & Federico
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <CardSeparator />

        {/* RSVP Section */}
        <section className="py-20 px-4">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 md:p-12 rounded-lg card-shadow border border-navy/5"
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-serif text-navy mb-2 font-script">Conferma la tua presenza</h2>
                <p className="text-navy-muted">Non vediamo l'ora di festeggiare con voi</p>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-navy uppercase tracking-widest">Inserisci nome e cognome *</label>
                  <input
                    type="text"
                    placeholder="Il tuo nome"
                    className="w-full p-4 bg-paper rounded border border-navy/10 focus:border-navy focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-navy uppercase tracking-widest">Email (opzionale)</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full p-4 bg-paper rounded border border-navy/10 focus:border-navy focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-4 text-left pt-2">
                  <label className="text-xs font-bold text-navy uppercase tracking-widest">Parteciperai? *</label>
                  <div className="flex space-x-8">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="attendance" className="w-5 h-5 accent-navy" />
                      <span className="text-navy-muted">Sì, ci sarò</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="attendance" className="w-5 h-5 accent-navy" />
                      <span className="text-navy-muted">No, non potrò venire</span>
                    </label>
                  </div>
                </div>



                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-navy uppercase tracking-widest">Allergie o intolleranze alimentari</label>
                  <textarea
                    placeholder="Esempi: celiachia, allergia alle noci, vegetariano..."
                    rows="3"
                    className="w-full p-4 bg-paper rounded border border-navy/10 focus:border-navy focus:outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-navy uppercase tracking-widest">Messaggio agli sposi</label>
                  <textarea
                    placeholder="Lasciate un messaggio per noi..."
                    rows="4"
                    className="w-full p-4 bg-paper rounded border border-navy/10 focus:border-navy focus:outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <button className="w-full py-4 bg-navy text-white rounded-md hover:bg-navy/90 transition-all font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 mt-8">
                  <Send className="w-4 h-4" />
                  Invia conferma
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 px-4 text-center space-y-8 bg-navy text-white/90">
          <Heart className="w-8 h-8 text-white mx-auto fill-white/20" />
          <div className="space-y-2">
            <h2 className="text-3xl font-serif">Federica & Federico</h2>
            <p className="text-white/60 tracking-widest uppercase text-sm">12 Settembre 2026</p>
          </div>
          <p className="text-xs text-white/40 pt-8 tracking-[0.2em]">Fatto con amore da LucAi</p>
        </footer>

        {/* Floating Controls */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 bg-navy text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </main>
    </div>
  )
}
