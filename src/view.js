/* eslint-disable no-param-reassign */
const render = (state, elements) => {
  const {
    input, infoText, feeds, posts, modalTitle, modalContent, modalLink,
  } = elements;
  input.classList.remove('is-invalid');
  elements.feedsTitle.textContent = state.text.feeds;
  elements.postsTitle.textContent = state.text.posts;
  elements.addButton.textContent = state.text.add;
  elements.exampleText.textContent = state.text.example;
  if (state.error) {
    if (state.error.type === 'url') {
      input.classList.add('is-invalid');
    }
    infoText.textContent = state.error.message;
    infoText.classList.remove('text-success');
    infoText.classList.add('text-danger');
    infoText.classList.remove('d-none');
    return;
  }
  if (state.isSuccess) {
    infoText.textContent = state.text.success;
    infoText.classList.remove('text-danger');
    infoText.classList.add('text-success');
    infoText.classList.remove('d-none');
  }

  // infoText.classList.add('text-danger');
  // elements.successText.classList.remove('d-none');
  // elements.successText.textContent = state.text.success;

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
      li.classList.add('list-group-item', 'list-group-item-dark', 'd-flex', 'justify-content-between');
      const a = document.createElement('a');
      a.textContent = post.title;
      a.setAttribute('href', post.link);
      a.classList.add(state.readIds.has(post.guid) ? 'fw-normal' : 'fw-bold');
      li.append(a);
      const showButton = document.createElement('button');
      showButton.classList.add('btn', 'btn-primary', 'btn-sm');
      showButton.dataset.bsToggle = 'modal';
      showButton.dataset.bsTarget = '#modal';
      showButton.textContent = state.text.preview;
      showButton.id = `show_${post.guid}`;
      showButton.addEventListener('click', () => {
        state.modal.title = post.title;
        state.modal.content = post.description;
        state.modal.link = post.link;
        state.readIds.add(post.guid);
      });
      li.append(showButton);
      posts.append(li);
    });
  } else {
    container.classList.add('d-none');
  }

  modalTitle.textContent = state.modal.title;
  modalContent.textContent = state.modal.content;
  modalLink.setAttribute('href', state.modal.link);
//   <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal">
//   Launch demo modal
// </button>
  // alert(state.error);
};

export default render;
