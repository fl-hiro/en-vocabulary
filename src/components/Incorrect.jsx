import '@/App.css'
import { lsObj } from '@/components/LocalStorage.js';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Incorrect() {
    const basePath = location.hostname.indexOf("github") !== -1 ? "/en-vocabulary" : "";
    /* move link */
    const navigate = useNavigate();
    const moveQuestion = () => {
        navigate(`${basePath}/Question`, {
            state: {
                menu: "incorrectList",
                section: "",
                data: incorrectData
            }
        });
    }

    /* function */
    const showIncorrectNav = (data) => {
        const dataAmount = data.length;
        incorrectCountRef.current.innerText = dataAmount;
        incorrectNavRef.current.classList.add("block");
    }

    /* initial */
    const [incorrectData, setIncorrectData] = useState([]);
    
    const lsIncorrectItemName = "incorrectItem";
    useEffect(() => {
        if (!lsObj.connect()) return;

        const incorrectList = JSON.parse(lsObj.get(lsIncorrectItemName));

        if (!incorrectList || incorrectList === null || incorrectList.length === 0) return

        setIncorrectData(...incorrectData, incorrectList);
        showIncorrectNav(incorrectList);
    }, []);

    const incorrectNavRef = useRef();
    const incorrectCountRef = useRef();
    return (
        <>
            <div className='incorrect-nav' ref={incorrectNavRef}>
                <button className='incorrect-nav__button' onClick={moveQuestion}>Incorrect list</button>
                <span className='incorrect-nav__count' ref={incorrectCountRef}></span>
            </div>
        </>
    )
}

export default Incorrect