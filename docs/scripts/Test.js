let post2 = new Promise((resolve, reject) => {
    resolve("blog posted");
});
let post = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve("blog posted"), 1000);
    });
};
let progress = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve("blog in progress"), 2000);
    })
};
let progress2 = new Promise((resolve, reject) => {
    resolve("blog in progress");
})
let del = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve("rejected promise"), 3000);
    });
};
let del2 = new Promise((resolve, reject) => {
    resolve("rejected promise");
});
let blog_promise = async () => {
    try {
        let result = await Promise.all([progress(), post(), del()]);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}
let blog_promise2 = async () => {
    try {
        let result = await Promise.all([progress2, post2, del2]);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

blog_promise2();