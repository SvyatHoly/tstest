const get = (path, object) =>
    path.reduce((xs, x) =>
        (xs && xs[x]) ? xs[x] : '', object);

export default get;