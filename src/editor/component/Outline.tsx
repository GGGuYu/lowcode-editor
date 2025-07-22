import { Tree } from "antd";
import { useComponentsStore } from "../stores/components"


//大纲组件
export function Outline() {
    //显示大纲就是渲染json
    const  { components , setCurComponentId } = useComponentsStore();

    return <Tree 
        fieldNames={{ title:'desc' , key:'id' }}
        treeData={components as any}
        showLine
        defaultExpandAll
        onSelect={([selectedKey]) => {
            setCurComponentId(selectedKey as number)
        }}
    />
}