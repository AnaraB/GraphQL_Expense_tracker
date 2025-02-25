import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage  from './pages/LoginPage'
import  HomePage  from './pages/HomePage'
import  SignUpPage   from './pages/SignUpPage'
import  TransactionPage  from './pages/TransactionPage'
import  NotFound from './pages/NotFoundPage'
import Header from './components/ui/Header'
import  { GET_AUTHENTICATED_USER }  from './graphql/queries/user.query.js'
import { useQuery } from '@apollo/client';
import { Toaster } from 'react-hot-toast';


function App() {
 const { loading, data } = useQuery(GET_AUTHENTICATED_USER)


 if (loading) return null;
  return (
    //if authUser data is not null then show header
    //initiually data authUser is null that's why data?  
    <>
    {data?.authUser && <Header />}
    <Routes>
      <Route path="/" element={data.authUser ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/login" element={!data.authUser ? <LoginPage/> : <Navigate to="/" />} />
      <Route path="/signup" element={!data.authUser ? <SignUpPage/> :  <Navigate to="/" />} />
      <Route path="/transaction/:id" element={data.authUser ?  <TransactionPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Toaster />
    </>
  )
}

export default App
