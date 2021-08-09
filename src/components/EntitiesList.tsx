import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { message, List, Button } from 'antd';

import ListEntity from "./ListEntity";
import { deleteMutation, EntitiesQuery } from "../gql";
import { EntitiesListProps, Namespace, Node } from "../types";


const EntitiesList: React.FC<EntitiesListProps> = ({ namespace, filter, order }) => {

  const variables = { namespace, q: filter, order };

  const { loading, error, data, refetch } = useQuery<{ namespace: Namespace }>(EntitiesQuery, { variables });
  const [deleteEntity] = useMutation(deleteMutation);

  const deleteNode = (id: string) => deleteEntity({ variables: { id } });
  const renderNode = (node: Node, loading: boolean = true) => {
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
    <List
      size="small"
      itemLayout="horizontal"
      bordered
      dataSource={nodes}
      renderItem={node => renderNode(node, loading)}
    />
  );
}

export default EntitiesList;
