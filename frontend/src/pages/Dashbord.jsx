import WorkspaceLayout from '../components/WorkspaceLayout'
import Dash from '../components/Dash'

export default function Dashboard() {
  const savedUser = localStorage.getItem('user')
  const user = savedUser ? JSON.parse(savedUser) : null
  const userName = user?.full_name?.trim() || user?.email

  return <WorkspaceLayout><Dash userName={userName} /></WorkspaceLayout>
}
