import React from "react";
import "./App.css";

// TODO: Implement me!
import NamespaceSelector from "./components/NamespaceSelector";
import EntitiesList from "./components/EntitiesList";;

// See "Response Filtering" for example usage: https://docs.sensu.io/sensu-go/latest/api/#response-filtering
const filter = `fieldSelector: entity.class != service`;

// Use documentation tab in GraphiQL for more options
const order = "ID";

function App() {
  const [namespace, changeNamespace] = React.useState("default");
  return (
    <div className="App">
      <div className="App-filters">
        <NamespaceSelector
          onNamespaceSelect={(namespace: string) => changeNamespace(namespace)}
        />
      </div>
      <div className="App-body">
        <EntitiesList
          namespace={namespace}
          filter={filter}
          order={order} />
      </div>
    </div>
  );
}

export default App;
