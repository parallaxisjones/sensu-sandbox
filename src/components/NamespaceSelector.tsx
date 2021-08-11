import React from "react";
import { useQuery } from "@apollo/client";
import { Select } from 'antd';
import { GetNamespacesQuery } from "../gql";
import { NamespaceSelectorProps, NamespacesResponse } from "../types";

// Query entities within the given namespace


const { Option } = Select;

const NamespaceSelector: React.FC<NamespaceSelectorProps> = ({ onNamespaceSelect }) => {
    const { loading, error, data } = useQuery<NamespacesResponse>(GetNamespacesQuery);

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
            onChange={onNamespaceSelect}
        >
            {namespaces.map(({ name }) => (
                <Option key={name} value={name}>{name}</Option>
            ))}
        </Select>
    );
}

export default NamespaceSelector;
