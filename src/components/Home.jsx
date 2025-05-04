import { useEffect, useState } from "react";
import { getWordData } from "./RequestData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

function Home({stateProp}) {

    // 単語のjsonデータ（TOEIC）を格納
    const [toeicList, setToeicList] = useState([]);

    // jsonデータを取得してstateに格納
    useEffect(() => {
        const basePath = location.hostname.indexOf("github") !== -1 ? "/en-vocabulary" : "/public";
        getWordData(`${basePath}/data/toeic.json`).then((data) => {
            if(!(data && Object.keys(data).length > 0)) return;
            const sectionData =  Object.keys(data);
            setToeicList(sectionData);
        });
    }, [])

    // 問題のカテゴリー一覧を作成
    const makeListHtml = () => {
        const html = toeicList.map((item) => {
            const uniqueKey = item.slice(-2);
            return (
            <li className="main-container__item" key={uniqueKey}>
                <button className="main-container__item-link" onClick={() => stateProp(uniqueKey)}>
                    <div className="main-container__item-inner main-container__flex">
                        <div className="main-conainer__flex-left">
                            <h2 className="main-container__item-title">{item}</h2>
                            <div className="main-container__text">Complete<span className="u-ml-3 u-mr-3">0</span>time</div>
                        </div>
                        <div className="main-container__flex-right">
                            <p className="u-fs-30 u-font-bold" id={`section${uniqueKey}`}>0<span className="u-fs-14">%</span></p>
                        </div>
                    </div>
                    <div className="main-container__item-progress"></div>
                </button>

            </li>
            )
        });

        return html;
    }

    const html = makeListHtml();

    return(
        <>
            <div className="main-container">
                <ul className="main-container__list">
                    {html}
                </ul>
            </div>
            <div className="config">
                <button className="config__button" onClick={() => stateProp("config")}>
                    <FontAwesomeIcon icon={fas.faGear} color="#fff" className="config__icon"/>
                </button>
            </div>
        </>
    )
}

export default Home