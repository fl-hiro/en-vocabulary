import { useEffect, useState } from "react";
import { getWordData } from "./RequestData";

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
                <button onClick={() => stateProp(uniqueKey)}>{item}</button>

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
        </>
    )
}

export default Home