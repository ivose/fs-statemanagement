import { useNotification } from '../store'

const Notification = () => {
  const notification = useNotification()
  if (!notification) return null

  return (
    <div
      role="status"
      style={{ border: '1px solid', padding: 10, marginBottom: 10 }}
      data-testid="notification"
    >
      {notification}
    </div>
  )
}

export default Notification
