import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../stores/component-config";
import { useComponentsStore } from "../stores/components";
import { message } from "antd";

//Drop核心目的就是要在正确的位置添加json
export function useMaterailDrop(accept:string[] , id:number) {
    const { addComponent } = useComponentsStore();//添加一个json
    const { componentConfig } = useComponentConfigStore();//为了找到对应的添加的是什么组件

    //使用useDrop让该组件可以接收Drag
    const [{ canDrop } , drop] = useDrop(() => ({
        accept:accept,
        drop: (item:{type:string} , monitor) => {
            if(monitor.didDrop()) return;//在一个最近的drop生效后，其他的不生效了，确保drop只生效一次
            const props = componentConfig[item.type].defaultProps;
            addComponent({
                id:new Date().getTime(),
                name:item.type,
                props
            } , id);
            message.success(item.type);
        },
        collect:(monitor) => ({
            canDrop:monitor.canDrop(),
        }),
    }))
    return { canDrop , drop }
}