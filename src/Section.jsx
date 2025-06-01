import Incorrect from '@/components/Incorrect';
import { lsObj } from '@/components/LocalStorage.js';
import { getWordData } from "./components/RequestData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef, createRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Section() {
    const jsonBasePath = location.hostname.indexOf("github") !== -1 ? "/en-vocabulary" : "/public";
    const basePath = location.hostname.indexOf("github") !== -1 ? "/en-vocabulary" : "";
    const locationState = useLocation();
 
    // 単語のjsonデータ（TOEIC）を格納
    const [sectionList, setSectionList] = useState([]);
    const [englishMenu, setEnglishMenu] = useState("");
    const [progressData, setProgressData] = useState("");
    /* *********************************
        local storage
    ********************************* */
    const initialSectionLocal = (lsItemName) => {
        if (!lsObj.connect()) return;

        const getProgressData = JSON.parse(lsObj.get(lsItemName));
        if (!getProgressData || getProgressData === null) {
            lsObj.set(lsItemName, JSON.stringify({}));
        } else {
            const progressData = JSON.parse(lsObj.get(lsItemName));
            setProgressData(progressData);
        }
    };

    /* *********************************
        get json
    ********************************* */
    // jsonデータを取得してstateに格納
    useEffect(() => {
        const menuState = locationState.state.menu;
        setEnglishMenu(menuState);
        getWordData(`${jsonBasePath}/data/${menuState}.json`).then((data) => {
            if(!(data && Object.keys(data).length > 0)) return;
            const sectionData =  Object.keys(data);
            setSectionList(sectionData);
        });
    }, []);

    /* *********************************
        navigation of link
    ********************************* */
    const navigate = useNavigate();
    const moveQuestion = (e) => {
        const sectionNum = e.currentTarget.dataset.sectionNum;
        navigate(`${basePath}/Question`, {
            state: {
                menu: englishMenu,
                section: sectionNum
            }
        });
    };
    const moveHome = () => {
        navigate(`${basePath}/`);
    };
    const moveConfig = () => {
        navigate(`${basePath}/AppConfig`);
    };

    /* *********************************
        create html
    ********************************* */
    const makeProgressValue = (sectionNum) => {
        const completeTime = progressData[sectionNum] ? progressData[sectionNum].completeNum : "0";
        const correctNum = progressData[sectionNum] ? progressData[sectionNum].correctNum : "0";
        const progressPersent = correctNum !== "0" ? (Number(correctNum) / 20) * 100 : "0";

        return {
            time: String(completeTime),
            persent: String(progressPersent)
        }

    }
    const makeListHtml = () => {
        const html = sectionList.map((item, index) => {
            const uniqueKey = item.slice(-2);
            const progressObj = makeProgressValue(item);
            return (
            <li className="main-container__item" key={uniqueKey}>
                <button className="main-container__item-link" data-section-num={uniqueKey} onClick={moveQuestion}>
                    <div className="main-container__item-inner main-container__flex">
                        <div className="main-conainer__flex-left">
                            <h2 className="main-container__item-title">{item}</h2>
                            <div className="main-container__text">Complete<span className="u-ml-3 u-mr-3">{progressObj.time}</span>time</div>
                        </div>
                        <div className="main-container__flex-right">
                            <p className="u-fs-30 u-font-bold" id={`section${uniqueKey}`}>{progressObj.persent}<span className="u-fs-14">%</span></p>
                        </div>
                    </div>
                    <div className="main-container__item-progress" style={{width: progressObj.persent + "%"}}></div>
                </button>
            </li>
            )
        });
        return html;
    };

    /* *********************************
        initial
    ********************************* */
   useEffect(() => {
       const menuState = locationState.state.menu;
       initialSectionLocal(menuState);
   }, []);
    const html = makeListHtml();
    return(
        <>
            <main>
                <div className="main-container">
                    <ul className="main-container__list">
                        {html}
                    </ul>
                </div>
            </main>
            <div className="home">
                <button className="home__button" onClick={moveHome}>
                    <FontAwesomeIcon icon={fas.faHouse} color="#67AE93" className="home__icon"/>
                </button>
            </div>
            <div className="config">
                <button className="config__button" onClick={moveConfig}>
                    <FontAwesomeIcon icon={fas.faGear} color="#fff" className="config__icon"/>
                </button>
            </div>
            <Incorrect />
        </>
    )
}

export default Section