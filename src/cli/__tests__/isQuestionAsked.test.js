const isQuestionAsked = require('../isQuestionAsked');

test('with appId undefined should ask', () => {
  expect(
    isQuestionAsked({
      question: { name: 'appId', validate: input => Boolean(input) },
      args: { appId: undefined },
    })
  ).toBe(false);
});

test('with appId defined should not ask', () => {
  expect(
    isQuestionAsked({
      question: { name: 'appId', validate: input => Boolean(input) },
      args: { appId: 'APP_ID' },
    })
  ).toBe(true);
});

test('with unvalid template should ask', () => {
  expect(
    isQuestionAsked({
      question: {
        name: 'template',
        validate: () => false,
      },
      args: { template: 'Unvalid' },
    })
  ).toBe(false);
});

test('with valid template should not ask', () => {
  expect(
    isQuestionAsked({
      question: {
        name: 'template',
        validate: () => true,
      },
      args: { template: 'InstantSearch.js' },
    })
  ).toBe(true);
});

test('with indexName should ask attributesToDisplay', () => {
  expect(
    isQuestionAsked({
      question: {
        name: 'attributesToDisplay',
      },
      args: { indexName: 'INDEX_NAME' },
    })
  ).toBe(false);
});
