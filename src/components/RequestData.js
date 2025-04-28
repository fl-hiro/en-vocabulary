export const getWordData = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url).then((res) => {
            if(!res.ok) {
                reject();
            }
            const jsonData = res.json();
            resolve(jsonData);
        })
    })
}