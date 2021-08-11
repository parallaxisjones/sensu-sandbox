const { createProxyMiddleware } = require("http-proxy-middleware");

// Borrowed from: https://github.com/penx/graphiql-middleware/blob/master/index.js
const graphiqlMiddleware =
  ({ endpointURL }, props = {}) =>
  (req, res) => {
    res.set("Content-Type", "text/html");
    res.send(`<html>
    <head>
      <title>GraphiQL</title>
      <link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
    </head>
    <body style="margin: 0;">
      <div id="graphiql" style="height: 100vh;"></div>
  
      <script
        crossorigin
        src="https://unpkg.com/react/umd/react.production.min.js"
      ></script>
      <script
        crossorigin
        src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
      ></script>
      <script
        crossorigin
        src="https://unpkg.com/graphiql/graphiql.min.js"
      ></script>
  
      <script>
        const props = ${JSON.stringify(props)};
        const graphQLFetcher = (params, opts) => {
          const headers = opts.headers || {};

          return fetch('${encodeURI(endpointURL)}', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify(params),
          })
            .then(response => response.json())
            .catch(() => response.text());
        }

        ReactDOM.render(
          React.createElement(GraphiQL, { fetcher: graphQLFetcher, ...props }),
          document.getElementById('graphiql'),
        );
      </script>
    </body>
  </html>`);
  };

module.exports = function (app) {
  app.use(
    "/graphql",
    createProxyMiddleware({
      //NB: this env var differs from what's in the .env file
      // app won't run without this
      target: process.env.SENSU_API_URL,
      changeOrigin: true,
    })
  );
  app.use(
    "/graphiql",
    graphiqlMiddleware(
      {
        endpointURL: "/graphql",
      },
      {
        headerEditorEnabled: true,
        headers: JSON.stringify({
          //NB: this env var differs from what's in the .env file
          // and what's in the README causing problems loading the gql schema
          authorization: `Key ${process.env.SENSU_API_KEY}`,
        }),
      }
    )
  );
};
