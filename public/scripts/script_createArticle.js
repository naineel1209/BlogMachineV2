window.addEventListener('click', () => {
    console.log("IT WORKSSSS");
});

const form = document.getElementById('form');
const tags = document.querySelector('#tags');
const btn = document.getElementsByClassName('create');

console.log(btn[0].disabled);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn[0].disabled = true;
    const formData = new FormData(form);

    console.log("GOING INNNNN");

    let tagArray = tags.value.split(',');

    formData.delete('tags')
    formData.append('tags', tagArray);

    const error = document.querySelector('.error');
    error.innerHTML = "Sending Data ................ "

    const resp = await axios
        .post('/addBlog', formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.data)
        .catch(err => {
            console.log(err.message)
        });

    error.innerHTML = "";

    console.log(resp);

    if (!resp.success) {
        error.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <strong>Error!</strong> The operation failed. Please try again later.
        </div>
        `
    } else {
        error.innerHTML = `
        <div class="alert alert-success" role="alert">
             <strong>Success!</strong> The message was sent successfully.
             <button class="btn btn-primary"><a style="color: white;" href="/blogs/${resp._id}"> View Here </a></button>
        </div>
        `
    }
    btn[0].disabled = false;
});