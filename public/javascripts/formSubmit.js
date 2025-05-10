// Form submission
const form = document.getElementById('new-article-form');
form.addEventListener('submit', async function (e) {
  const submitButton = document.getElementById('btn-publish');
  e.preventDefault();
  submitButton.disabled = true;
  submitButton.innerHTML = 'Publishing...';
  const formData = new FormData(form);
  formData.set('tags', tagsArray);
  const post = {
    title: formData.get('title'),
    category: formData.get('category'),
    author: formData.get('author'),
    summary: formData.get('summary'),
    body: DOMPurify.sanitize(formData.get('content')), //prevent xss atack
    tags: formData.get('tags'),
    image: formData.get('image'),
  };
  console.log(post);
  try {
    const response = await axios.post('/new-article', post, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const { slug } = response.data;
    if (slug) {
      window.location.href = `/articles/${slug}`;
    } else {
      throw new Error('Error creating article');
    }
  } catch (error) {
    showError('Error creating article');
    submitButton.disabled = false;
    submitButton.innerHTML = 'Publish Article';
  }
});
