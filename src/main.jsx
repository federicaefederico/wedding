import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Fonts
import "@fontsource/lora/400.css"
import "@fontsource/lora/500.css"
import "@fontsource/lora/600.css"
import "@fontsource/lora/700.css"
import "@fontsource/alex-brush/400.css"

import { HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
    <HashRouter>
        <App />
    </HashRouter>
)
