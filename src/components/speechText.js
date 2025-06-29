import { lsObj } from '@/components/LocalStorage.js';

const synth =  window.speechSynthesis;
const MALE_VALUE = 0.8;
const FEMALE_VALUE = 1.9;
const LOW_SPEED_VALUE = 0.2;
const MEDIUM_SPEED_VALUE = 0.8;
const HIGH_SPEED_VALUE = 1.2;

const getVoiceConfigObj = () => {
    if (!lsObj.connect()) return;
    const questonConfigItemName = "questionConfig";
    const configObj = JSON.parse(lsObj.get(questonConfigItemName));

    const genderValue = !configObj || configObj === null || !configObj.voice ? 
                        MALE_VALUE : 
                        configObj.voice_gender === "male" ? 
                        MALE_VALUE : 
                        FEMALE_VALUE;
    const speedValue = !configObj || configObj === null || !configObj.voice ? 
                        MEDIUM_SPEED_VALUE : 
                        configObj.voice_speed === "low" ? 
                        LOW_SPEED_VALUE : 
                        configObj.voice_speed === "medium" ? 
                        MEDIUM_SPEED_VALUE : 
                        HIGH_SPEED_VALUE;
    return {
        genderConfig: genderValue,
        speedConfig: speedValue
    }
};

const voiceConfigObj = getVoiceConfigObj();

export const readVocaburaly = (text) => {
    const voices = synth.getVoices();
    const targetLang = "en-US";
    
    const speechText = text ? text : "read sample text";
    const speech = new SpeechSynthesisUtterance(speechText);

    for (const voice of voices) {
        if (voice.lang === targetLang) {
            speech.voice = voice;
            break;
        }
    }

    speech.pitch = !voiceConfigObj ? 0.6 : voiceConfigObj.genderConfig;
    speech.rate = !voiceConfigObj ? 0.8 : voiceConfigObj.speedConfig;

    setTimeout(() => {
        synth.speak(speech);
    }, 500);
}

