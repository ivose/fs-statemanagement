import useFeedbackStore from '../store'

const Buttons = () => {
  const addGood = useFeedbackStore((state) => state.addGood)
  const addNeutral = useFeedbackStore((state) => state.addNeutral)
  const addBad = useFeedbackStore((state) => state.addBad)
  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={addGood}>good</button>
      <button onClick={addNeutral}>neutral</button>
      <button onClick={addBad}>bad</button>
    </div>
  )
}

export default Buttons
