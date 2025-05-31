import '@/App.css'
import Incorrect from '@/components/Incorrect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'

function Home() {

  const navigate = useNavigate();
  const moveTlevel1 = () => {
    navigate("/Section", {
        state: {
            menu: "toeic1"
        }
    })
  }
  const moveTlevel2 = () => {
    navigate("/Section", {
        state: {
            menu: "toeic2"
        }
    })
  }
  const moveConfig = () => {
    navigate("/AppConfig");
  }

  return (
    <>

      <main className='main'>
        {/* {!pageStutas ? <Home stateProp={setPageStutas}/> : pageStutas === "config" ? <AppConfig /> : <Question sectionNum={pageStutas}/>} */}
        <div className="main-container">
            <ul className="main-container__list">
              <li className="main-container__item">
                  <button className="main-container__item-link" onClick={moveTlevel1}>
                      <div className="main-container__item-inner">
                          <div className="main-conainer__flex-left">
                              <h2 className="main-container__item-title">TOEIC1</h2>
                          </div>
                      </div>
                  </button>
              </li>
              <li className="main-container__item">
                  <button className="main-container__item-link" onClick={moveTlevel2}>
                      <div className="main-container__item-inner">
                          <div className="main-conainer__flex-left">
                              <h2 className="main-container__item-title">TOEIC2</h2>
                          </div>
                      </div>
                  </button>
              </li>
            </ul>
        </div>
      </main>
      <div className="config">
          <button className="config__button" onClick={moveConfig}>
              <FontAwesomeIcon icon={fas.faGear} color="#fff" className="config__icon"/>
          </button>
      </div>
      <Incorrect />
    </>
  )
}

export default Home
