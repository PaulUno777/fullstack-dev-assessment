import { AppProviders } from './providers/AppProviders'
import { CandidatesPage } from './pages/CandidatesPage'

function App() {
  return (
    <AppProviders>
      <CandidatesPage />
    </AppProviders>
  )
}

export default App
