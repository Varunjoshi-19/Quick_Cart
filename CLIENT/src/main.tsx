import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'
import { GlobalContextProvider } from './context/Context.tsx'

createRoot(document.getElementById('root')!).render(
  <GlobalContextProvider>

    <App />
  </GlobalContextProvider>
)
