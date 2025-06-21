const synth =  window.speechSynthesis;

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

    speech.rate = 0.8;

    setTimeout(() => {
        synth.speak(speech);
    }, 500);
}

