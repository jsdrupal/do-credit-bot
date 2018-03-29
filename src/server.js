const Koa = require('koa');
const koaBody = require('koa-body');
const request = require('superagent');
const app = new Koa();

app.use(koaBody());

app.use(async ctx => {
  const eventType = ctx.request.headers['x-github-event'];

  if (eventType === 'issues' && ctx.request.body.action === 'closed') {
    issueClosed(ctx.request.body);
  }
  ctx.body = 'Hello World';
});

const issueClosed = async (payload) => {
  const allParticipants = allParticipants(payload.issue);
};

/**
 * Gets all participants of an issue.
 *
 * @param {obbject} issue 
 */
const getIssueParticipants = async (issue) => {
  const comments = (await request(commentsUrl)).body;
  const commentUsers = comments.map(comment => comment.user);
  const allParticipants = Array.from([payload.issue.user].concat(commentUsers).reduce((acc, user) => {
    acc.set(user.id, user);
    return acc;
  }, new Map()).values());

  const drupalOrgParticipants = await Promise.all(allParticipants.map(participantToDrupalOrgAccount));

  return [allParticipants, drupalOrgParticipants];
};

const participantToDrupalOrgAccount = async (user) => {
  // Try to match by username
  const response = await request(`https://www.drupal.org/api-d7/user.json?name=${user.login}`);
  if (response.status === 200 && response.body.list.length > 0) {
    return user.login;
  }

  // We could match by social links, but that is blocked on drupal.org.

  return null;
};

app.listen(6000);
