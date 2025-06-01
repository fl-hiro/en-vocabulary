import Header from '@/components/Header'
import { lsObj } from '@/components/LocalStorage.js'
import '@/App.css'
import Home from '@/Home';
import Section from '@/Section';
import Question from '@/Question';
import AppConfig from '@/AppConfig';

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const basePath = location.hostname.indexOf("github") !== -1 ? "/en-vocabulary" : "";
  return (
    <>
      <Header />
      <BrowserRouter>
      <Routes>
        <Route path={`${basePath}/`} element={<Home />} />
        <Route path={`${basePath}/Section`} element={<Section />} />
        <Route path={`${basePath}/Question`} element={<Question />} />
        <Route path={`${basePath}/AppConfig`} element={<AppConfig />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
