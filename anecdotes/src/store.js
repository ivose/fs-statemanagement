import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const apiUrl = 'http://localhost:3001/anecdotes'

const request = async (path = '', method = 'GET', data) => {
  const options = { method }
  if (data !== undefined) {
    options.headers = { 'Content-Type': 'application/json' }
    options.body = JSON.stringify(data)
  }

  const response = await fetch(apiUrl + path, options)
  if (!response.ok) throw new Error(`Anecdote request failed (${response.status})`)
  if (method !== 'DELETE') return response.json()
}

const useAnecdoteStore = create((set, get) => {
  let pendingChange = Promise.resolve()
  let notificationTimeout

  // Read the current vote count only after any earlier changes have been saved.
  const save = (change) => {
    pendingChange = pendingChange.then(async () => {
      try {
        const result = await change()
        set({ error: '' })
        return result
      } catch (error) {
        set({ error: error.message })
        return false
      }
    })
    return pendingChange
  }

  return {
    anecdotes: [],
    filter: '',
    notification: '',
    error: '',
    actions: {
      initialize: () => save(async () => {
        set({ anecdotes: await request() })
      }),
      setFilter: (filter) => set({ filter }),
      add: (value) => save(async () => {
        const content = value.trim()
        if (!content) return false

        const created = await request('', 'POST', { content, votes: 0 })
        set((state) => ({ anecdotes: [...state.anecdotes, created] }))
        return true
      }),
      vote: (id) => save(async () => {
        const anecdote = get().anecdotes.find((item) => item.id === id)
        if (!anecdote) return

        const updated = await request(`/${encodeURIComponent(id)}`, 'PATCH', {
          votes: anecdote.votes + 1,
        })
        clearTimeout(notificationTimeout)
        set((state) => ({
          anecdotes: state.anecdotes.map((item) => item.id === id ? updated : item),
          notification: `you voted '${anecdote.content}'`,
        }))
        notificationTimeout = setTimeout(() => set({ notification: '' }), 5000)
      }),
      remove: (id) => save(async () => {
        const anecdote = get().anecdotes.find((item) => item.id === id)
        if (!anecdote || anecdote.votes !== 0) return

        await request(`/${encodeURIComponent(id)}`, 'DELETE')
        set((state) => ({ anecdotes: state.anecdotes.filter((item) => item.id !== id) }))
      }),
    },
  }
})

export const useAnecdotes = () => useAnecdoteStore(useShallow(({ anecdotes, filter }) => {
  const query = filter.toLowerCase()
  return anecdotes
    .filter(({ content }) => content.toLowerCase().includes(query))
    .sort((first, second) => second.votes - first.votes)
}))
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useNotification = () => useAnecdoteStore((state) => state.notification)
export const useAnecdoteError = () => useAnecdoteStore((state) => state.error)
