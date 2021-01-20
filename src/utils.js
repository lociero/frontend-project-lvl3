class RSSError extends Error {
  constructor(message) {
    super();
    this.type = 'rss';
    this.name = 'ParsingError';
    this.message = message;
  }
}

// eslint-disable-next-line import/prefer-default-export
export const parseRSS = (xmltext) => {
  const doc = new DOMParser().parseFromString(xmltext, 'application/xml');
  if (doc.querySelector('parsererror')) {
    throw new RSSError();
  }
  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;

  const items = [...doc.querySelectorAll('item')].map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const itemDescription = item.querySelector('description').textContent;
    const guid = item.querySelector('guid').textContent;

    return {
      guid,
      title: itemTitle,
      link,
      description: itemDescription,
    };
  });

  return { title, description, items };
};
