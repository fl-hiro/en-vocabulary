import { lsObj } from '@/components/LocalStorage.js';
import { useEffect, useState } from 'react';

function AppConfig() {
    const [configStutas, setConfigStutas] = useState(false);
    const lsItemName = "questionConfig";

    useEffect(() => {
        if (!lsObj.connect()) return;

        const questionConfig = JSON.parse(lsObj.get(lsItemName));
        !questionConfig.displayType || questionConfig.displayType === "type01" ? setConfigStutas(false) : setConfigStutas(true);
    }, []);

    const changeQuestionConfig = (e) => {
        if (!lsObj.connect()) return;

        const isCheck = e.target.checked;
        const configValue = {
            displayType: isCheck ? "type02" : "type01"
        }

        lsObj.set(lsItemName, JSON.stringify(configValue));
        setConfigStutas(isCheck);
    }

    return (
        <>
            <div className="config-info">
                <ul className="config-info__list">
                    <li className="config-info__item">
                        <input id="radio01" type="checkbox" className="config-info__radio" checked={configStutas} onChange={changeQuestionConfig}/>
                        <label htmlFor="radio01" className="config-info__label">Change display question</label>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default AppConfig