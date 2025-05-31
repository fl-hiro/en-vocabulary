import Header from '@/components/Header'
import { lsObj } from '@/components/LocalStorage.js'
import '@/App.css'
import Home from '@/Home';
import Section from '@/Section';
import Question from '@/Question';
import AppConfig from '@/AppConfig';

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
      <Routes>
        <Route path={`/`} element={<Home />} />
        <Route path={`/Section`} element={<Section />} />
        <Route path={`/Question`} element={<Question />} />
        <Route path={`/AppConfig`} element={<AppConfig />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
