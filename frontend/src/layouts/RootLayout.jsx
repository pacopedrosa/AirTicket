import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const RootLayout = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  )
}

export default RootLayout