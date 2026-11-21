import { useEffect } from 'react'
import { useAnecdoteActions, useAnecdoteError, useFilter } from './store'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'

const App = () => {
  const { initialize, setFilter } = useAnecdoteActions()
  const filter = useFilter()
  const error = useAnecdoteError()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <main>
      <h2>Anecdotes</h2>
      <Notification />
      {error && <p role="alert">{error}</p>}
      <label>
        filter{' '}
        <input data-testid="filter" value={filter} onChange={(event) => setFilter(event.target.value)} />
      </label>
      <AnecdoteList />
      <AnecdoteForm />
    </main>
  )
}

export default App
