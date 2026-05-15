module.exports = {
  baseUrl: process.env.SERVICE_SOPORTE,
  pathPrefix: '/api',
  pathTransform: (apiPath) => {
    const path = apiPath.replace(/^\/soporte/, '');
    if (path.startsWith('/faqs')) return `/support/api${path}`;
    return path;
  }
};