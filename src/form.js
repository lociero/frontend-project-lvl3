export default () => {
  const formHtml = `
<div class="container d-flex align-items-center mt-2">
  <form class="col" data-testid="form_test">
    <div class="form-row">
      <div class="col-md-10">
        <input type="text" class="form-control" placeholder="RSS link">
      </div>
      <div class="col-md-2">
        <button type="submit" class="btn btn-outline-primary w-100">ADD</button>
      </div>
    </div>
  </form>
</div>`;

  const div = document.createElement('div');
  div.innerHTML = formHtml;

  return div;
};
