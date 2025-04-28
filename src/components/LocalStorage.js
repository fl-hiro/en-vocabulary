export const lsObj = {
    connect: () => {
        try {
            return localStorage.length >= 0;
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    get: (key) => {
        try {
            return localStorage.getItem(key) || "";
        } catch(e) {
            console.log(e);
            return false;
        }
    },
    set: (key, data) => {
        try {
            localStorage.setItem(key, data);
            return true
        } catch(e) {
            console.log(e);
            return false
        }
    },
    delete: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}