
import {
  Navigate,
  Route,
  Routes,
} from 'react-router'

import PortfolioPage from './pages/PortfolioPage'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <Routes>

      {/* Main Portfolio Page */}
      <Route
        path="/"
        element={<PortfolioPage />}
      />

      {/* AI Chat Page */}
      <Route
        path="/chat"
        element={<ChatPage />}
      />

      {/* Redirect unknown URLs */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  )
}

export default App
