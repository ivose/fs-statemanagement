import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()

  const submit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const input = form.elements.anecdote
    const content = input.value
    if (await add(content) && input.value === content) form.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          <input name="anecdote" aria-label="anecdote" data-testid="new" required />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
