import { RouterProvider } from 'react-router-dom'
import router from './router/index'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'sonner'

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
    </AuthProvider>
  )
}

export default App