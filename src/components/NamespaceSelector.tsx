import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Select } from 'antd';

// Query entities within the given namespace
const query = gql`
  query GetNamespaces {
    viewer {
        namespaces {
            name
        }
    }
  }
`;
type NamespacesResponse = { viewer: { namespaces: { name: string }[] } };
type NamespaceSelectorProps = {
    onNamespaceSelect: (namespace: string) => void,
};
const { Option } = Select;
function onSearch(val: string) {
    console.log('search:', val);
}

const NamespaceSelector: React.FC<NamespaceSelectorProps> = ({ onNamespaceSelect }) => {
    const { loading, error, data } = useQuery<NamespacesResponse>(query);

    if (loading) {
        return <p>Loading</p>;
    }

    if (error) {
        return (
            <p>
                Error getting namespaces: <em>{error.message}</em>
            </p>
        );
    }
    const { viewer } = data!;
    const namespaces = viewer.namespaces;

    return (
        <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a Namespace"
            optionFilterProp="children"
            onSearch={onSearch}
            onChange={onNamespaceSelect}
        >
            {namespaces.map(({ name }) => (
                <Option key={name} value={name}>{name}</Option>
            ))}
        </Select>
    );
}

export default NamespaceSelector;
