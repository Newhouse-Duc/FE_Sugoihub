import { useState } from 'react'
import AppRoutes from './routers/appRoutes'
import { BrowserRouter } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

function App() {

  return (

    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>

  )
}

export default App
