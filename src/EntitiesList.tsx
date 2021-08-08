import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { message, List, Button } from 'antd';

import NamespaceSelector from "./components/NamespaceSelector";
import ListEntity from "./components/ListEntity";
// See "Response Filtering" for example usage: https://docs.sensu.io/sensu-go/latest/api/#response-filtering
const q = `fieldSelector: entity.class != service`;

// Use documentation tab in GraphiQL for more options
const order = "ID";
const deleteMutation = gql`
  mutation DeleteNode($id: ID!) {
    deleteNode(id: $id) {
      errors {
        code
      },
      snapshot
    }
  }
`;
// Query entities within the given namespace
const query = gql`
  query EntitiesQuery(
    $namespace: String!
    $order: EntityListOrder
    $q: String!
  ) {
    namespace(name: $namespace) {
      entities(orderBy: $order, filters: [$q]) {
        nodes {
          id,
          lastSeen,
          metadata {
            labels {
              key,
              val
            }
          }
        }
      }
    }
  }
`;
export type KeyValue = {
  key: string,
  val: string;
}

export type Node = {
  lastSeen: Date;
  metadata: { labels: KeyValue[] }
  id: string;
  loading?: boolean;
};

type Entity = {
  nodes: Node[]
};
type Namespace = {
  entities: Entity
};

function EntitiesList() {
  const [namespace, changeNamespace] = React.useState("default");

  const variables = { namespace, q, order };
  const { loading, error, data, refetch } = useQuery<{ namespace: Namespace }>(query, { variables });
  const [deleteEntity] = useMutation(deleteMutation);

  const deleteNode = (id: string) => deleteEntity({ variables: { id } });
  const renderNode = (node: Node, loading?: false) => {
    const entity = { ...node, loading };
    const deleteButton = (
      <Button
        type="ghost"
        onClick={async () => {
          const { data } = await deleteNode(node.id);
          if (data.deleteNode.errors && data.deleteNode.errors.length > 0) {
            if (data.deleteNode.errors[0].code === "ERR_NOT_FOUND") {
              message.error("Entity not found");
            }
          }
          refetch();
        }}
        key="entity-delete">
        delete
      </Button>
    );
    return (
      <List.Item
        actions={[deleteButton]}
      >
        <ListEntity entity={entity} />
      </List.Item>
    );
  }
  if (loading) {
    return <p>Loading</p>;
  }

  if (error) {
    return (
      <p>
        Error querying entities: <em>{error.message}</em>
      </p>
    );
  }
  const { namespace: { entities: { nodes } } } = data!;
  return (
    <div>
      <NamespaceSelector
        onNamespaceSelect={(namespace: string) => changeNamespace(namespace)}
      />
      <List
        size="small"
        itemLayout="horizontal"
        bordered
        dataSource={nodes}
        renderItem={node => renderNode(node, loading)}
      />
    </div>
  );
}

export default EntitiesList;
