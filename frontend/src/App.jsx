import { Route, Routes } from 'react-router-dom';
import LoginPage  from './pages/LoginPage'
import  HomePage  from './pages/HomePage'
import  SignUpPage   from './pages/SignUpPage'
import  TransactionPage  from './pages/TransactionPage'
import  NotFound from './pages/NotFoundPage'
import Header from './components/ui/Header'


function App() {
 const authUser = true;

  return (
    <>
    {authUser && <Header />}
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/transaction/:id" element={<TransactionPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}

export default App
