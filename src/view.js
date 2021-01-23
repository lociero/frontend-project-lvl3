const render = (state, elements) => {
  console.log('rerender');
  const {
    input, errorText, feeds, posts,
  } = elements;
  input.classList.remove('is-invalid');
  errorText.classList.add('d-none');
  if (state.error) {
    if (state.error.type === 'url') {
      input.classList.add('is-invalid');
    }
    errorText.textContent = state.error.message;
    errorText.classList.remove('d-none');
    return;
  }
  const container = document.querySelector('#main_container');
  if (state.feeds.length > 0) {
    container.classList.remove('d-none');
    feeds.innerHTML = '';
    state.feeds.forEach((feed) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'list-group-item-dark');
      const h3 = document.createElement('h3');
      h3.textContent = feed.title;
      const p = document.createElement('p');
      p.textContent = feed.description;
      li.append(h3, p);
      feeds.append(li);
    });

    posts.innerHTML = '';
    state.posts.forEach((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'list-group-item-dark');
      const a = document.createElement('a');
      a.textContent = post.title;
      a.setAttribute('href', post.link);
      li.append(a);
      posts.append(li);
    });
  } else {
    container.classList.add('d-none');
  }
  // alert(state.error);
};

export default render;
