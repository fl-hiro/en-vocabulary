import { lsObj } from '@/components/LocalStorage.js';
import { useEffect, useRef, useState } from 'react';

function AppConfig() {
    /* *********************************
        variable
    ********************************* */
    const status = {
        display_type: false,
        voice: false
    }
    const [configStutas, setConfigStutas] = useState(status);
    const lsItemName = "questionConfig";

    const radioStatus = {
        gender: "",
        speed: ""
    }
    const [selected, setSelected] = useState(radioStatus);
    const genderRadio = [
        {
            label: "Male",
            value: "male"
        },
        {
            label: "Female",
            value: "female"
        }
    ];
    const speedRadio = [
        {
            label: "Low",
            value: "low"
        },
        {
            label: "Medium",
            value: "medium"
        },
        {
            label: "High",
            value: "high"
        }
    ];

    const voiceConfigGenderRef = useRef();
    const voiceConfigSpeedRef = useRef();


    /* *********************************
        functions
    ********************************* */
    const changeVoiceDetailConfig = (e) => {
        if (!lsObj.connect()) return;
        let configObj = JSON.parse(lsObj.get(lsItemName));
        const radioValue = e.target.value;
        const lsKey = radioValue === "male" || radioValue === "female" ? "voice_gender" : "voice_speed";
        const setVoiceDetailSelect = {...selected};
        const stateKey = radioValue === "male" || radioValue === "female" ? "gender" : "speed";

        configObj[lsKey] = radioValue;
        setVoiceDetailSelect[stateKey] = radioValue;

        lsObj.set(lsItemName, JSON.stringify(configObj));
        setSelected(setVoiceDetailSelect);
    }

    const setInitialConfigOutline = (configValue) => {
        const questionConfigValue = !configValue || configValue === null ? "type01" : configValue.display_type;
        const voiceConfigValue = !configValue || configValue === null ? "off" : configValue.voice;

        const setConfigObjValue = {...configStutas};
        questionConfigValue === "type01" ? setConfigObjValue.display_type = false : setConfigObjValue.display_type = true;
        voiceConfigValue === "off" ? setConfigObjValue.voice = false : setConfigObjValue.voice = true;
        voiceConfigValue ? showDetailVoiceConfig(true) : "";
        setConfigStutas(setConfigObjValue);
    }

    const setInitialVoiceDetailConfig = (genderValue, speedValue) => {
        const setVoiceDetailValue = {...selected};
        setVoiceDetailValue.gender = genderValue;
        setVoiceDetailValue.speed = speedValue;

        setSelected(setVoiceDetailValue);
    }

    const showDetailVoiceConfig = (isCheck) => {
        if (isCheck) {
            voiceConfigGenderRef.current.classList.add("show");
            voiceConfigSpeedRef.current.classList.add("show");
        } else {
            voiceConfigGenderRef.current.classList.remove("show");
            voiceConfigSpeedRef.current.classList.remove("show");
        }
    }

    const changeVoiceConfig = (e) => {
        if (!lsObj.connect()) return;

        let configObj = JSON.parse(lsObj.get(lsItemName));
        const isCheck = e.target.checked;

        if (!configObj) {
            configObj = {
                voice: isCheck ? "on" : "off",
                voice_gender: "male",
                voice_speed: "medium"
            }
        } else if (!configObj.voice) {
            configObj.voice = isCheck ? "on" : "off",
            configObj.voice_gender = "male",
            configObj.voice_speed = "medium"
        } else {
            configObj.voice = isCheck ? "on" : "off",
            configObj.voice_gender = configObj.voice_gender,
            configObj.voice_speed = configObj.voice_speed  
        }

        lsObj.set(lsItemName, JSON.stringify(configObj));
        const setConfigObjValue = {...configStutas};
        setConfigObjValue.voice = isCheck ? true : false;
        setConfigStutas(setConfigObjValue);
        showDetailVoiceConfig(isCheck);
    }

    const changeQuestionConfig = (e) => {
        if (!lsObj.connect()) return;

        let configObj = JSON.parse(lsObj.get(lsItemName));
        const isCheck = e.target.checked;
        if (!configObj) {
            configObj = {
                display_type: isCheck ? "type02" : "type01"
            }
        } else {
            configObj.display_type = isCheck ? "type02" : "type01"
        }

        lsObj.set(lsItemName, JSON.stringify(configObj));
        const setConfigObjValue = {...configStutas};
        setConfigObjValue.display_type = isCheck ? true : false
        setConfigStutas(setConfigObjValue);
    }

    const blowsBack = () => {
        history.back();
    }

    /* *********************************
        initial
    ********************************* */
    useEffect(() => {
        if (!lsObj.connect()) return;

        const configValue = JSON.parse(lsObj.get(lsItemName));
        setInitialConfigOutline(configValue);
        !configValue || configValue === null ? setInitialVoiceDetailConfig("male", "demale") : setInitialVoiceDetailConfig(configValue.voice_gender, configValue.voice_speed);
    }, []);

    return (
        <>
            <div className="config-info">
                <ul className="config-info__list">
                    <li className="config-info__item">
                        <input id="radio01" type="checkbox" className="config-info__radio" checked={configStutas.display_type} onChange={changeQuestionConfig}/>
                        <label htmlFor="radio01" className="config-info__label">Change displayed type of question</label>
                    </li>
                    <li className="config-info__item">
                        <input id="radio02" type="checkbox" className="config-info__radio" checked={configStutas.voice} onChange={changeVoiceConfig}/>
                        <label htmlFor="radio02" className="config-info__label">Turn on voice function</label>
                    </li>
                    <li className="config-info__item config-info-detail" ref={voiceConfigGenderRef}>
                        {
                            genderRadio.map((item, index) => {
                                return (
                                    <div className="config-info-detail__item config-info-detail__item--col2" key={index}>
                                        <input id={`genderRadio0${index}`} type='radio' name="gender" value={item.value} className="config-info-detail__radio" checked={item.value === selected.gender} onChange={changeVoiceDetailConfig}></input>
                                        <label htmlFor={`genderRadio0${index}`} className="config-info-detail__label">{item.label}</label>
                                    </div>
                                )
                            })
                        }
                    </li>
                    <li className="config-info__item config-info-detail" ref={voiceConfigSpeedRef}>
                    {
                            speedRadio.map((item, index) => {
                                return (
                                    <div className="config-info-detail__item config-info-detail__item--col3" key={index}>
                                        <input id={`speedRadio0${index}`} type='radio' name="speed" value={item.value} className="config-info-detail__radio" checked={item.value === selected.speed} onChange={changeVoiceDetailConfig}></input>
                                        <label htmlFor={`speedRadio0${index}`} className="config-info-detail__label">{item.label}</label>
                                    </div>
                                )
                            })
                        }
                    </li>
                </ul>
                <div className="config-close">
                    <button className="config-close__button" onClick={blowsBack}>Back</button>
                </div>
            </div>
        </>
    )
}

export default AppConfig