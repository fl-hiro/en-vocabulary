import { createRef, useEffect, useRef, useState } from "react";
import { lsObj } from '@/components/LocalStorage.js';
import { getWordData } from "./RequestData";

function Question({sectionNum}) {
    /* *********************************
        local storage
    ********************************* */
   const keyName = "section";
    // lsにページ番号を保存
    useEffect(() => {
        if (!lsObj.connect) return;

        lsObj.set(keyName, sectionNum);
    }, [])

    // ページに遷移したらURL書き換えと履歴を追加
    history.pushState("", "", "question");

    const rootPath = location.hostname.indexOf("github") !== -1 ? "/en-vocabulary" : "/";
    // ブラウザの戻るボタン押下時のイベント
    window.addEventListener("popstate", () => {
        history.back();
        location.href = rootPath;
        
        lsObj.delete(keyName);
    })

    // ×ボタン押下時のイベント
    const deletePageLog = () => {
        lsObj.delete(keyName);
        location.href = rootPath;
    }

    /* *********************************
        get json data
    ********************************* */
    // ページのセクション番号
    const targetSection = `section${sectionNum}`;
    // 単語のデータを格納
    const [questionList, setQuestionList] = useState([]);

    // 単語のjsonデータを取得
    useEffect(() => {
        const basePath = location.hostname.indexOf("github") !== -1 ? "/en-vocabulary" : "/public";
        getWordData(`${basePath}/data/toeic.json`).then((data) => {
            if(!(data && Object.keys(data).length > 0)) return;
            const sectionData =  data[targetSection];
            setQuestionList(sectionData);
        });
    }, []);

    /* *********************************
        useRef
    ********************************* */
    // 各問題リストのliタグにuseRefを付与
    const questionItemRef = useRef([]);
    const reviewItemRef = useRef([]);
    const closeButtonRef = useRef();

    questionList.forEach((_, index) => {
        questionItemRef.current[index] = createRef();
        reviewItemRef.current[index] = createRef();
    })

    /* *********************************
        functions
    ********************************* */
    const slideQuestionItem = (e) => {
        const reviewIndex = Number(e.currentTarget.dataset.id) - 1;
        const moveValue = Number(e.currentTarget.dataset.id) * 100;
        reviewItemRef.current[reviewIndex].current.style.display = "none";
        questionList.forEach((_, index) => {
            questionItemRef.current[index].current.style.transform = `translateX(-${moveValue}%)`;
        });
    }

    const showReview = (resultClass, pageNum) => {
        const target = reviewItemRef.current[pageNum].current;
        target.classList.add(resultClass);
    }

    let pageNum = 0;
    const checkAnswer = (e)=> {
        const answerId = e.currentTarget.dataset.answerId;
        const questionId = questionItemRef.current[pageNum].current.dataset.questionId;

        const resultClass = answerId === questionId ? "correct" : "incorrect";

        showReview(resultClass, pageNum);

        pageNum++;
    } 

    /* *********************************
        create html
    ********************************* */
    // 問題のhtml作成
    const listHtml = questionList.map((item, index) => {
        // 答えのリストを作成
        const answerIndex = [];
        let beforeNum = 0;
        let limitedNum = 4;
        for (let i = 0, l = questionList.length; i < l; i++) {
            if (i === limitedNum) break;

            const randomNum = Math.floor(Math.random() * 20);
            if (beforeNum === randomNum) {
                limitedNum++;
                continue;
            }
            beforeNum = randomNum;

            if (i === limitedNum - 1 && answerIndex.indexOf(index) === -1 ) {
                answerIndex.push(index);
            } else {
                answerIndex.push(randomNum);
            }
        }

        // 解答のhtml
        const answerHtml = answerIndex.map((num, index) => {
            return (
                <li className="question__answer-item" key={index}>
                    <button 
                        className="question__answer-button" 
                        data-answer-id={questionList[num].id} 
                        onClick={checkAnswer}>
                            <span className="u-mr-3">{questionList[num].desc01 && questionList[num].desc01}</span>
                            <span>{questionList[num].desc02 && questionList[num].desc02}</span>
                    </button>
                </li>
            )
        });

        // 全体のhtmlを作成
        return (
        <li className="question__item" ref={questionItemRef.current[index]} key={item.id} data-question-id={item.id}>
             <h2 className="question__title">{item.word}</h2>
            <ul>
                {answerHtml}
            </ul>
        </li>
        )
    });

    const reviewHtml = questionList.map((item, index) => {
        return (
            <div className="review" ref={reviewItemRef.current[index]}>
                <div className="review__inner">
                    <h2 className="review__title">{item.word}</h2>
                    <dl className="review__item">
                        <dt className="review__sub-title">Example</dt>
                        <dd className="review__sentence">{item.sentence}</dd>
                        <dd className="review__sentence-jp">{item.jp_sentence}</dd>
                    </dl>
                    <dl className="review__item">
                        <dt className="review__sub-title">Meaning</dt>
                        <dd className="review__desc"><span className="review__desc-category">{item.category01}</span>{item.desc01}</dd>
                        <dd className="review__desc"><span>{item.category02 && item.category02}</span>{item.desc02 && item.desc02}</dd>
                        
                    </dl>
                </div>
                <div className="u-text-center">
                    <button className="review__button" onClick={slideQuestionItem} data-id={item.id}>Next</button>
                </div>
            </div>
        )
    })

    return(
        <>
            <div className="main-container">
                <div className="question__title"></div>
                <ul className="question__list">
                    {listHtml}
                </ul>
                {reviewHtml}
            </div>
            <div className="close__button-wrap">
                <button className="close__button" ref={closeButtonRef} onClick={deletePageLog}></button>
            </div>
        </>
    )
}

export default Question