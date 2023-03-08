window.addEventListener('click', function (e) {
    console.log("Hello World!!");
});

const form = document.getElementById('form');
const tags = document.getElementById('tags');


form.addEventListener('submit', async function (e) {
    e.preventDefault();

    console.log('INSIDE EDIT');

    let tagArray = tags.value.split(',');
    console.log(tagArray);

    const pathArray = window.location.pathname.split('/');
    const id = pathArray[pathArray.length - 1];

    const formData = new FormData(form);
    console.log(formData);
    formData.delete('tags')
    formData.append('tags', [...tagArray]);
    formData.append('_id', id)

    const resp = await axios.patch('/addArticle', formData, {
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.data)
        .catch(err => console.log(err.message));

    console.log(resp);

    if (!Boolean(resp.success)) {
        document.querySelector('.error').innerHTML += `
        <div class="alert alert-danger" role="alert">
            <strong>Error!</strong> The operation failed. Please try again later.
        </div>
        `
    } else {
        document.querySelector('.error').innerHTML = `
        <div class="alert alert-success" role="alert">
             <strong>Success!</strong> The message was sent successfully.
             <button class="btn btn-primary"><a style="color: white;" href="/blogs/${resp._id}"> View Here </a></button>
        </div>
        `
    }

});