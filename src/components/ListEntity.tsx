import { List } from "antd";
import React from "react";
import { Node } from '../types';

const getName = (srn: string): string => {
    const re = /^srn:entities:(?<namespace>.*):(?<name>.*)$/;
    const { name, namespace } = re.exec(srn)?.groups as { name: string, namespace: string };
    return `${name} - ${namespace}`;
}

const ListEntity: React.FC<{ entity: Node }> = ({ entity }) => {
    const labels = entity.metadata.labels || [];

    return (
        <List.Item.Meta
            style={{ width: "100%" }}
            title={getName(entity.id)}
            description={labels.map(label => label.val).join(", ")}

        />
    );
}

export default ListEntity;
