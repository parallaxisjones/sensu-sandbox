import { gql } from "@apollo/client";

export const deleteMutation = gql`
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
export const EntitiesQuery = gql`
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

export const GetNamespacesQuery = gql`
  query GetNamespaces {
    viewer {
        namespaces {
            name
        }
    }
  }
`;
