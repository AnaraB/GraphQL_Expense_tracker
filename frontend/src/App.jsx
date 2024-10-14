import { Route, Routes } from 'react-router-dom';

function App() {
 

  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/transaction/:id" element={<TransactionPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  )
}

export default App
