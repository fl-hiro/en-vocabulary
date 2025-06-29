import { createRef, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { lsObj } from '@/components/LocalStorage.js';
import { getWordData } from "./components/RequestData";

import { readVocaburaly } from './components/speechText';

function Question() {
    const jsonBasePath = location.hostname.indexOf("github") !== -1 ? "/en-vocabulary" : "/public";
    const basePath = location.hostname.indexOf("github") !== -1 ? "/en-vocabulary" : "";
    /* *********************************
        get section number
    ********************************* */
    const locationState = useLocation();
    const sectionNum = locationState.state.section;
    /* *********************************
        local storage
    ********************************* */
   const sectionItemName = sectionNum ? "section" + sectionNum : "";
   const questonConfigItemName = "questionConfig";
   const lsIncorrectItemName = "incorrectItem";
   const progressData =  {
    [sectionItemName]: {
        correctNum: 0,
        completeNum: 0
    }
   };
   const [displayConfig, setDisplayConfig] = useState(false);
   const [voiceConfig, setVoiceConfig] = useState(false);
    // lsにページ番号を保存
    useEffect(() => {
        if (!lsObj.connect()) return;

        // set  display config 
        const configObj = JSON.parse(lsObj.get(questonConfigItemName));
        const configValue = !configObj || configObj === null ? "type01" : configObj.display_type;
        const isVoiceConfig = (!configObj || configObj === null) || configObj.voice === "off" ? false : true;
        setDisplayConfig(configValue);
        setVoiceConfig(isVoiceConfig)

        // set inital incorrect obj
        const lsIncorrect = JSON.parse(lsObj.get(lsIncorrectItemName));
        if (!lsIncorrect || lsIncorrect === null) {
            lsObj.set(lsIncorrectItemName, JSON.stringify([]));
        }
    }, []);

    const saveIncorrectItem = (itemId) => {
        if (!lsObj.connect()) return;

        const itemData = questionList[itemId];
        const inCorrectObj = JSON.parse(lsObj.get(lsIncorrectItemName));

        itemData.display_type = displayConfig;

        const checkDuplicateData = inCorrectObj.length > 0 ? inCorrectObj.some((item) => {
            return item.id === itemData.id;
        }) : "";
        !checkDuplicateData ? inCorrectObj.push(itemData) : "";
        lsObj.set(lsIncorrectItemName, JSON.stringify(inCorrectObj));
    };

    const updateIncorrectData = (itemId) => {
        if (!lsObj.connect()) return;

        const inCorrectObj = JSON.parse(lsObj.get(lsIncorrectItemName));
        const incorrectUpdateData = inCorrectObj.filter((item) => {
            return item.id !== itemId;
        });
        lsObj.set(lsIncorrectItemName, JSON.stringify(incorrectUpdateData));
    };

    const setProgressData = () => {
        if (!lsObj.connect() || menuName === "incorrectList") return;

        const lsEnglishMenuData = JSON.parse(lsObj.get(menuName));
        lsEnglishMenuData[sectionItemName] ? progressData[sectionItemName].completeNum = lsEnglishMenuData[sectionItemName].completeNum : "";

        if (progressData[sectionItemName].correctNum === 20) {
            progressData[sectionItemName].correctNum = 0;
            progressData[sectionItemName].completeNum++;
        }

        if (Object.keys(lsEnglishMenuData).length === 0) {
            // set initial progress data
            lsObj.set(menuName, JSON.stringify(progressData));
        } else if (lsEnglishMenuData[sectionItemName]) {
            // update progress data
            const correctNum = lsEnglishMenuData[sectionItemName].correctNum;
            const completeNum = lsEnglishMenuData[sectionItemName].completeNum;
            const activeCorrectNum = progressData[sectionItemName].correctNum;
            const activeCompleteNum = progressData[sectionItemName].completeNum;

            if (correctNum >= activeCorrectNum && completeNum === activeCompleteNum) return;

            lsEnglishMenuData[sectionItemName] = correctNum < activeCorrectNum || completeNum < activeCompleteNum ? 
                                                progressData[sectionItemName] : 
                                                lsEnglishMenuData[sectionItemName];
            lsObj.set(menuName, JSON.stringify(lsEnglishMenuData));
        } else {
            // add progress data
            lsEnglishMenuData[sectionItemName] = progressData[sectionItemName];
            lsObj.set(menuName, JSON.stringify(lsEnglishMenuData));
        }
    };

    /* *********************************
        get json data
    ********************************* */
    // 単語のデータを格納
    const [questionList, setQuestionList] = useState([]);
    const [menuName, setMenuName] = useState("");

    // 単語のjsonデータを取得
    useEffect(() => {
        const englishMenu = locationState.state.menu;
        setMenuName(englishMenu);
        if (englishMenu === "incorrectList") {
            const incorrectData = locationState.state.data;
            setQuestionList(incorrectData);
        } else {
            getWordData(`${jsonBasePath}/data/${englishMenu}.json`).then((data) => {
                if(!(data && Object.keys(data).length > 0)) return;
                const targetSection = `section${sectionNum}`;
                const sectionData =  data[targetSection];
                setQuestionList(sectionData);
            });
        }
    }, []);

    /* *********************************
        useRef
    ********************************* */
    // 各問題リストのliタグにuseRefを付与
    const questionItemRef = useRef([]);
    const reviewItemRef = useRef([]);
    const closeButtonRef = useRef();
    const modalBgRef = useRef();
    const modalRef = useRef();
    const progressBarRef = useRef();

    questionList.forEach((_, index) => {
        questionItemRef.current[index] = createRef();
        reviewItemRef.current[index] = createRef();
    });

    /* *********************************
        functions
    ********************************* */
    const setCorrectCount = () => {
        const data = progressData[sectionItemName];
        data.correctNum++;
    };

    const shuffleIndex = (arrData) => {
        const roopNum = Math.floor(Math.random() * 5 + 1);
        for (let i = 0; i < roopNum; i++) {
            const firstData = arrData.shift();
            arrData.push(firstData);
        }

        return arrData;
    };

    const slideQuestionItem = (e) => {
        const reviewIndex = Number(e.currentTarget.dataset.num) - 1;
        const moveValue = Number(e.currentTarget.dataset.num) * 100;
        reviewItemRef.current[reviewIndex].current.style.display = "none";
        questionList.forEach((_, index) => {
            questionItemRef.current[index].current.style.transform = `translateX(-${moveValue}%)`;
        });
    };

    const showFinishModal = () => {
        modalBgRef.current.classList.add("finish-modal-bg--show");
        modalRef.current.classList.add("finish-modal--show");
    };

    const showReview = (resultClass, pageNum) => {
        const target = reviewItemRef.current[pageNum].current;
        target.classList.add(resultClass);
        if (pageNum === questionList.length - 1) {
            showFinishModal();
            setProgressData();
        }
    };

    const showProgressBar = (num) => {
        const progressValue = (num / questionList.length) * 100;
        progressBarRef.current.style.width = `${progressValue}%`;
    }

    let pageNum = 0;
    const checkAnswer = (e)=> {
        const answerId = Number(e.currentTarget.dataset.answerId);
        const questionId = Number(questionItemRef.current[pageNum].current.dataset.questionId);

        const resultClass = answerId === questionId ? "correct" : "incorrect";

        resultClass === "incorrect" ? saveIncorrectItem(questionId - 1) : setCorrectCount();
        resultClass === "correct" && menuName === "incorrectList" ? updateIncorrectData(questionId) : "";
        showProgressBar(pageNum + 1);
        showReview(resultClass, pageNum);

        // speechText
        resultClass === "incorrect" || !voiceConfig ? "" : readVocaburaly(e.currentTarget.dataset.word);

        pageNum++;
    }

    const navigate = useNavigate();
    const moveToMenu = () => {
        pageNum < 19 ? setProgressData() : "";

        if (menuName === "incorrectList") {
            return location.href = `${basePath}/`;
        } else {
            return navigate(`${basePath}/Section`, {
                state: {
                    menu: menuName
                }
            });
        }
    };

    /* *********************************
        create html
    ********************************* */
    // create question html
    const listHtml = questionList.map((item, index) => {
        // create title
        const incorrectDisplayType = item.display_type;
        const displayType = incorrectDisplayType ? incorrectDisplayType : displayConfig;
        const questionTitleHtml = !displayType || displayType === "type01" 
        ? 
        <h2 className="question__title">{item.word}</h2>
        :
        <h2 className="question__title">
            <span className="question__title--jp">{item.jp_sentence}</span>
            <span className="question__title--en">{item.sentence02}</span>
        </h2>;

        // create answer list
        const answerIndex = [];
        const randomAmount = questionList.length === 20 ? 20 : questionList.length;
        let beforeNum = "";
        let limitedNum = questionList.length < 4 ? questionList.length : 4;
        for (let i = 0; i < 20; i++) {
            if (i === limitedNum) break;

            const randomNum = Math.floor(Math.random() * randomAmount);
            const checkDuplicateNum = answerIndex.indexOf(randomNum) !== -1;
            if (beforeNum === randomNum || checkDuplicateNum) {
                limitedNum++;
                continue;
            };
            beforeNum = randomNum;

            if (i === limitedNum - 1 && answerIndex.indexOf(index) === -1 ) {
                answerIndex.push(index);
            } else {
                answerIndex.push(randomNum);
            };
        };

        const shuffleAnswerIndex = shuffleIndex(answerIndex);

        // create answer and review
        const answerHtml = shuffleAnswerIndex.map((num, index) => {
            const incorrectDisplayType = item.display_type;
            const displayType = incorrectDisplayType ? incorrectDisplayType : displayConfig;
            return (
                <li className="question__answer-item" key={index}>
                    {!displayType || displayType === "type01"
                        ? 
                        <button 
                            className="question__answer-button" 
                            data-answer-id={questionList[num].id} 
                            data-word={questionList[num].word} 
                            onClick={checkAnswer}>
                                <span className="u-mr-3">{questionList[num].desc01 && questionList[num].desc01}</span>
                                <span>{questionList[num].desc02 && `、${questionList[num].desc02}`}</span>
                        </button> 
                        :
                        <button 
                            className="question__answer-button" 
                            data-answer-id={questionList[num].id} 
                            data-word={questionList[num].word} 
                            onClick={checkAnswer}>
                                {questionList[num].word}
                        </button> 
                    }
                </li>
            )
        });

        // merge html data
        return (
        <li className="question__item" ref={questionItemRef.current[index]} key={item.id} data-question-id={item.id}>
             {questionTitleHtml}
            <ul>
                {answerHtml}
            </ul>
        </li>
        )
    });

    const reviewHtml = questionList.map((item, index) => {
        return (
            <div className="review" key={index} ref={reviewItemRef.current[index]}>
                <div className="review__inner">
                    <h2 className="review__title">{item.word}</h2>
                    <dl className="review__item">
                        <dt className="review__sub-title">Example</dt>
                        <dd className="review__sentence">{item.sentence}</dd>
                        <dd className="review__sentence-jp">{item.jp_sentence}</dd>
                    </dl>
                    <dl className="review__item">
                        <dt className="review__sub-title">Meaning</dt>
                        <dd className="review__desc">{item.category01 && <span className="review__desc-category">{item.category01}</span>}{item.desc01}</dd>
                        <dd className="review__desc">{item.category02 && <span className="review__desc-category">{item.category02}</span>}{item.desc02 && item.desc02}</dd>
                        
                    </dl>
                </div>
                <div className="u-text-center">
                    {
                        index === questionList.length - 1 ? 
                                    "" : 
                                    <button className="review__button" onClick={slideQuestionItem} data-num={index + 1}>Next</button>
                    }
                </div>
            </div>
        )
    })

    return(
        <>
            <div className="main-container">
                <ul className="question__list">
                    {listHtml}
                </ul>
                {reviewHtml}
            </div>
            <div className="progress-bar">
                <div className="progress-bar__bg">
                <div className="progress-bar__line" ref={progressBarRef}></div>
                </div>
            </div>
            <div className="close__button-wrap">
                <button className="close__button" ref={closeButtonRef} onClick={moveToMenu}></button>
            </div>
            <div className="finish-modal-bg" ref={modalBgRef}></div>
            <div className="finish-modal" ref={modalRef}>
                <div className="finish-modal__title">Finish!</div>
                <button className="finish-modal__button" onClick={moveToMenu}>back to menu</button>
            </div>
        </>
    )
}

export default Question