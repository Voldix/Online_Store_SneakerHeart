export default function addGlobalEventListener(type, selector, callbak) {
    document.addEventListener(type, e => {
        if (e.target.matches(selector)) {
            callbak(e);
        }
    })
}