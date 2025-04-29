import { useEffect, useState } from "react";
import { lsObj } from '@/components/LocalStorage.js';
import { getWordData } from "./RequestData";

function Question({sectionNum}) {
    const keyName = "section";

    // lsにページ番号を保存
    useEffect(() => {
        if (!lsObj.connect) return;

        lsObj.set(keyName, sectionNum);
    }, [])

    // ページに遷移したらURL書き換えと履歴を追加
    history.pushState("", "", "question");

    // ブラウザの戻るボタン押下時のイベント
    window.addEventListener("popstate", () => {
        history.back();
        location.href = "/";
        
        lsObj.delete(keyName);
    })

    // ページのセクション番号
    const targetSection = `section${sectionNum}`;
    
    // 単語のデータを格納
    const [questionList, setQuestionList] = useState([]);

    // 単語のjsonデータを取得
    useEffect(() => {
        getWordData("/public/data/toeic.json").then((data) => {
            if(!(data && Object.keys(data).length > 0)) return;
            const sectionData =  data[targetSection];
            setQuestionList(sectionData);
        });
    }, [])

    // 問題のhtml作成
    const listHtml = questionList.map((item) => {
        return <li key={item.id}>{item.word}</li>
    });

    return(
        <>
            <ul>
                {listHtml}
            </ul>
        </>
    )
}

export default Question