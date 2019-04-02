/**
 * returns value, if the value is undefined - returns empty string
 * @param path - array of strings
 * @param object - object
 * @returns {*}
 */
const get = (path, object) =>
    path.reduce((xs, x) =>
        (xs && xs[x]) ? xs[x] : '', object);

export default get;