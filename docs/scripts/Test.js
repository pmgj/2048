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
let del = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve("rejected promise"), 3000);
    });
};
let blog_promise = async () => {
    try {
        let result = await Promise.all([progress(), post(), del()]);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}
blog_promise();