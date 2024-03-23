// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

console.log("This prints to the console of the page (injected only if the page url matched)")

let startTime = new Date().getTime();
let endTime = new Date().getTime();
let data = {};
let html = `
<div class="time-blocks">
    
    <div class="time-block">
        <div class="time-start">Start time: ${new Date(startTime).toLocaleTimeString()}</div>
        <div class="time-end">End time: ${new Date(endTime).toLocaleTimeString()}</div>
        <div class="selected-text">Selected text: </div>
    </div>
</div>
`

let formatMs = (ms) => {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes}:${seconds}`;
}

const cleanSelectedText = () => {
    let text = window.getSelection().toString();
    text = text.replace(/ +/g, ' ').replace(/\t+/g, '\t').replace(/\n+/g, '\n');
    if (text.length > 256) {
        text = text.slice(0, 256) + '...';
    }
    if (text.match(/\n/g).length > 5) {
        text = text.split('\n').slice(0, 5).join('\n') + '...';
    }
    return text;
}
    

let lasSelectedText = {}
function doSomethingWithSelectedText() {
    var selectedText = copySelectionObj();
    if (!compareObjectEquality(selectedText, lasSelectedText)) {
        // selection changed
        lasSelectedText = selectedText;
    }
}



document.addEventListener("mouseup", doSomethingWithSelectedText);
document.addEventListener("keyup", doSomethingWithSelectedText);


function copySelectionObj() {
    return copyPropsFromObject(
        window.getSelection(),
        ['anchorNode', 'anchorOffset', 'focusNode', 'focusOffset', 'isCollapsed', 'rangeCount', 'type']
    );
}

function compareObjectEquality (obj1, obj2) {
    for (let key in obj1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    for (let key in obj2) {
        if (obj2[key] !== obj1[key]) {
            return false;
        }
    }
    return true;
}

function copyPropsFromObject (obj, propsAllowed) {
    let newObj = {};
    for (let key in obj) {
        if (propsAllowed.includes(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}