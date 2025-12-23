import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import CustomerReviewView from './views/CustomerReviewView.jsx'
import CustomerFillView from './views/CustomerFillView.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/adorable-prototype">
      <Routes>
        {/* Admin routes */}
        <Route path="/" element={<App />} />

        {/* Customer routes */}
        <Route path="/review/:id" element={<CustomerReviewView />} />
        <Route path="/fill/:id" element={<CustomerFillView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
