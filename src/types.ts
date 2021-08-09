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

export type Entity = {
    nodes: Node[]
};
export type Namespace = {
    entities: Entity
};

export type EntitiesListProps = {
    namespace: string;
    filter: string;
    order: string;
}

export type NamespacesResponse = { viewer: { namespaces: { name: string }[] } };
export type NamespaceSelectorProps = {
    onNamespaceSelect: (namespace: string) => void,
};