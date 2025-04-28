import Header from '@/components/Header'
import Home from '@/components/Home'
import Question from './components/Question'
import { useEffect, useState } from 'react'
import { lsObj } from '@/components/LocalStorage.js'
import '@/App.css'

function App() {

  // 問題を解くページの番号を格納
  const [pageStutas, setPageStutas] = useState("");

  // 問題を解いている途中のリロード対応
  useEffect(() => {
    if (!lsObj.connect) return;
    const pageData = lsObj.get("section");

    if (!pageData) return;
    setPageStutas(pageData);
  }, [])

  return (
    <>
      <Header />

      <main className='main'>
        {!pageStutas ? <Home stateProp={setPageStutas}/> : <Question sectionNum={pageStutas}/>}
      </main>
    </>
  )
}

export default App
