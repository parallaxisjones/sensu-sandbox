import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";

import App from "./App";

import createApolloClient from "./apollo";

import "./index.css";
import 'antd/dist/antd.css'

const apolloClient = createApolloClient();

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
