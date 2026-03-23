import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  MapPin,
  Clock,
  Volume2,
  VolumeX,
  Send,
  GlassWater,
  PartyPopper,
  UtensilsCrossed,
  Music2,
  ChevronDown
} from 'lucide-react'
import { intervalToDuration, format } from 'date-fns'

// --- Components ---

const Countdown = ({ targetDate }) => {
  const [duration, setDuration] = useState(
    intervalToDuration({ start: new Date(), end: targetDate })
  )

  console.log("duration", duration)

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(intervalToDuration({ start: new Date(), end: targetDate }))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const items = [
    { label: duration.months === 1 ? 'MESE' : 'MESI', value: duration.months || 0 },
    { label: duration.days === 1 ? 'GIORNO' : 'GIORNI', value: duration.days || 0 },
    { label: duration.hours === 1 ? 'ORA' : 'ORE', value: duration.hours || 0 },
    { label: duration.minutes === 1 ? 'MINUTO' : 'MINUTI', value: duration.minutes || 0 },
    { label: duration.seconds === 1 ? 'SECONDO' : 'SECONDI', value: duration.seconds || 0 },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-4 max-w-4xl mx-auto my-12">
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

export default function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const targetDate = new Date('2026-05-12T17:00:00')
  console.log(targetDate)

  const handleOpenEnvelope = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);
    setTimeout(() => {
      setIsOpen(true);
    }, 2400); // 1.8s di apertura + 0.6s di dissolvenza rapida
  }

  return (
    <div className="min-h-screen bg-paper overflow-x-hidden pt-0 mt-0">
      {/* --- Splash Screen / Envelope --- */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
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
              <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden drop-shadow-2xl">
                <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="w-full h-full">
                  {/* Aletta Sinistra */}
                  <polygon fill="#f9f7f3" points="0,0 200,150 0,300" stroke="rgba(0,0,0,0.04)" strokeWidth="1" strokeLinejoin="round" />
                  {/* Aletta Destra */}
                  <polygon fill="#f9f7f3" points="400,0 200,150 400,300" stroke="rgba(0,0,0,0.04)" strokeWidth="1" strokeLinejoin="round" />
                  {/* Aletta Inferiore */}
                  <polygon fill="#fdfdfc" points="0,300 200,150 400,300" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeLinejoin="round" className="drop-shadow-sm" />
                </svg>
              </div>

              {/* Aletta Superiore e Sigillo - altezza esattamente 50% */}
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2 z-30 pointer-events-none origin-top rounded-none"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: isOpening ? 180 : 0 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* ViewBox combacia con l'altezza: 150 su una larghezza 400 */}
                <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  <polygon fill="#f8f5f0" points="0,0 200,150 400,0" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeLinejoin="round" className="drop-shadow-xl" />
                </svg>

                {/* Sigillo solidale (top-full significa esattamente al bordo inferiore dell'aletta, cioè al centro perfetto della busta totale) */}
                <div
                  className="absolute left-1/2  pointer-events-auto"
                  style={{ transform: "translate(-50%, -50%) translateZ(1px)" }}
                >
                  <div className="w-[10vw] max-w-[120px] min-w-[80px] aspect-square rounded-full bg-[#f3f0e7] shadow-[0_5px_15px_rgba(0,0,0,0.2)] flex items-center justify-center border-2 border-white/40 group overflow-hidden">
                    <div className="w-[8vw] max-w-[100px] min-w-[65px] aspect-square rounded-full bg-[#f3f0e7] shadow-inner flex items-center justify-center relative">
                      <span className="font-serif text-[#3a5978]/40 font-bold text-3xl italic group-hover:scale-105 transition-transform duration-500">F&F</span>
                    </div>
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

        {/* Countdown Section */}
        <section className="py-20 bg-white/30">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-navy mb-2">Conto alla rovescia</h2>
            <p className="text-navy-muted">Per il giorno più speciale delle nostre vite</p>
          </div>
          <Countdown targetDate={targetDate} />
        </section>

        {/* Quote Section */}
        <section className="py-32 flex flex-col items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-2xl"
          >
            <h3 className="text-3xl md:text-5xl font-script text-navy leading-relaxed">
              "Ven por nuestro amor, ¡quédate por la tarta!"
            </h3>
            <div className="mt-12 flex justify-center">
              <div className="w-24 h-24 border border-navy/10 rounded-full flex items-center justify-center bg-white card-shadow">
                <UtensilsCrossed className="w-8 h-8 text-gold" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Details Section */}
        <section id="detalles" className="py-20 px-4 bg-white/20">
          <div className="max-w-5xl mx-auto space-y-20">
            <div className="text-center">
              <h2 className="text-4xl font-serif text-navy mb-2 font-script">Detalles del día</h2>
              <p className="text-navy-muted">Todo lo que necesitas saber</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Location */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-lg card-shadow text-center space-y-6"
              >
                <div className="w-16 h-16 bg-paper rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-navy" />
                </div>
                <h3 className="text-2xl font-serif text-navy">Localización</h3>
                <div className="space-y-1">
                  <p className="text-lg font-medium text-navy">Finca Biniagual</p>
                  <p className="text-navy-muted text-sm">Camí de Biniagual, Sencelles (Mallorca)</p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-navy-muted">
                  <Clock className="w-4 h-4" />
                  <span>De 17:00h a 01:00h</span>
                </div>
                <button className="w-full py-4 px-6 bg-navy text-white rounded-md hover:bg-navy/90 transition-colors tracking-widest uppercase text-xs font-bold flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Abrir en Google Maps
                </button>
              </motion.div>

              {/* Map Placeholder */}
              <div className="h-full min-h-[400px] bg-navy/5 rounded-lg border border-navy/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  {/* Simulated map lines */}
                  <div className="absolute top-1/4 left-0 w-full h-px bg-navy" />
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-navy" />
                  <div className="absolute top-0 left-1/3 h-full w-px bg-navy" />
                </div>
                <div className="text-center z-10 p-8">
                  <MapPin className="w-12 h-12 text-navy/20 mx-auto mb-4" />
                  <p className="text-navy-muted font-serif italic italic font-light">Interactive Map View Placeholder</p>
                  <button className="mt-6 text-navy underline text-sm tracking-widest font-bold">AÑADIR AL CALENDARIO</button>
                </div>
              </div>
            </div>

            {/* Program / Timeline */}
            <div className="pt-20">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-serif text-navy mb-2 font-script">Programa del día</h2>
                <p className="text-navy-muted">Lo que tenemos preparado para vosotros</p>
              </div>

              <div className="max-w-2xl mx-auto px-4 md:px-0">
                <TimelineItem
                  time="17:00"
                  title="Llegada de invitados"
                  subtitle="Recepción y bienvenida en la finca"
                  icon={PartyPopper}
                />
                <TimelineItem
                  time="17:30"
                  title="Welcome Drink"
                  subtitle="Cóctel de bienvenida mientras esperamos"
                  icon={GlassWater}
                />
                <TimelineItem
                  time="18:00"
                  title="Ceremonia"
                  subtitle="El momento más especial del día"
                  icon={Heart}
                />
                <TimelineItem
                  time="19:00"
                  title="Cóctel"
                  subtitle="Aperitivos y bebidas en los jardines"
                  icon={GlassWater}
                />
                <TimelineItem
                  time="21:00"
                  title="Banquete"
                  subtitle="Cena y celebración"
                  icon={UtensilsCrossed}
                />
                <TimelineItem
                  time="00:00"
                  title="Fiesta"
                  subtitle="¡A bailar hasta el amanecer!"
                  icon={Music2}
                />
                <TimelineItem
                  time="03:00"
                  title="Fin de fiesta"
                  subtitle="Despedida e buenos recuerdos"
                  icon={PartyPopper}
                  isLast
                />
              </div>
            </div>
          </div>
        </section>

        {/* RSVP Section */}
        <section className="py-20 px-4">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 md:p-12 rounded-lg card-shadow border border-navy/5"
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-serif text-navy mb-2 font-script">Confirma tu asistencia</h2>
                <p className="text-navy-muted">Esperamos contar contigo</p>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-navy uppercase tracking-widest">Nombre completo *</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full p-4 bg-paper rounded border border-navy/10 focus:border-navy focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-navy uppercase tracking-widest">Email (opcional)</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full p-4 bg-paper rounded border border-navy/10 focus:border-navy focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-4 text-left pt-2">
                  <label className="text-xs font-bold text-navy uppercase tracking-widest">¿Asistirás? *</label>
                  <div className="flex space-x-8">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="attendance" className="w-5 h-5 accent-navy" />
                      <span className="text-navy-muted">Sí, asistiré</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="attendance" className="w-5 h-5 accent-navy" />
                      <span className="text-navy-muted">No podré asistir</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-navy uppercase tracking-widest">Número de invitados</label>
                  <input
                    type="number"
                    defaultValue="1"
                    min="1"
                    className="w-full p-4 bg-paper rounded border border-navy/10 focus:border-navy focus:outline-none transition-colors"
                  />
                </div>

                <button className="w-full py-4 bg-navy text-white rounded-md hover:bg-navy/90 transition-all font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 mt-8">
                  <Send className="w-4 h-4" />
                  Enviar confirmación
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
          <p className="text-xs text-white/40 pt-8 uppercase tracking-[0.2em]">Fatto con amore da Luca</p>
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
