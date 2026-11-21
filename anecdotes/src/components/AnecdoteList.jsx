import { useAnecdotes, useAnecdoteActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, remove } = useAnecdoteActions()

  return (
    <div>
      {anecdotes.map(({ id, content, votes }) => (
        <div key={id}>
          <div>{content}</div>
          <div>
            has {votes} votes{' '}
            <button onClick={() => vote(id)}>vote</button>
            {votes === 0 && <button onClick={() => remove(id)}>delete</button>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
