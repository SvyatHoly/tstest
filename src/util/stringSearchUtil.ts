/**
 * Boyer Moore Algorithm for Pattern Searching
 * @param prefix
 * @param text
 */
export function findSubString(prefix: string, text: string): number {
    const pr = getPrefix(prefix);
    const len = prefix.length;
    let end = false;
    let countT = len - 1;
    let countP = len - 1;

    let start = false;
    let startPoint = len - 1;

    while (!end) {
        if (start) {
            startPoint = countT;
            if(startPoint>text.length){
                return -1;
            }
            countP = len - 1;
        }
        if (text.charCodeAt(startPoint) === prefix.charCodeAt(countP)) {
            countP--;
            startPoint--;
            if (start) {
                start = false;
            }
            if (countP == -1) {
                end = true
            }
        } else {
            if (pr[text.charCodeAt(startPoint)] > 0) {
                countT += pr[text.charCodeAt(startPoint)];
                start = true;
            } else {
                countT += pr[prefix.charCodeAt(len - 1)];
                start = true;
            }
        }
    }
    return countT;
}


function getPrefix(string: string): Array<number> {
    const arr = new Array(128);
    const index = string.length - 1;
    for (let i = index; i >= 0; i--) {
        const c = string.charCodeAt(i);
        if (c !== string.charCodeAt(index) && arr[c] === undefined) {
            arr[c] = index - i;
        }
    }
    arr[string.charCodeAt(index)] = arr[string.charCodeAt(index)] > 0 ?
        arr[string.charCodeAt(index)] : string.length;

    return arr
}
