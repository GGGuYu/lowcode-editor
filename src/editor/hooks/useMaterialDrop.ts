import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../stores/component-config";
import { getComponentById, useComponentsStore } from "../stores/components";
import { message } from "antd";

//drop过来的可能是新增，也可能是移动
export interface ItemType {
    type:string;
    dragType:'move' | 'add';
    id:number;
}

//Drop核心目的就是要在正确的位置添加json
export function useMaterailDrop(accept:string[] , id:number) {
    const { components , addComponent ,deleteComponent } = useComponentsStore();//添加一个json
    const { componentConfig } = useComponentConfigStore();//为了找到对应的添加的是什么组件

    //使用useDrop让该组件可以接收Drag
    const [{ canDrop } , drop] = useDrop(() => ({
        accept:accept,
        drop: (item:ItemType , monitor) => {
            if(monitor.didDrop()) return;//在一个最近的drop生效后，其他的不生效了，确保drop只生效一次
            
            console.log(item)
            if(item.dragType === 'move') {
                console.log('进来了')
                //移动哪个id变成我的孩子
                const component = getComponentById(item.id , components)!;//先保存下来
                //drop过来如果是move的话，我应该改变json的结构
                deleteComponent(item.id);
                addComponent(component , id);//在当前位置添加原来的那个，只是相当于把他的父节点id改了
            } else {
                //添加的逻辑
                const props = componentConfig[item.type].defaultProps;
                const desc = componentConfig[item.type].desc;
                addComponent({
                    id:new Date().getTime(),
                    name:item.type,
                    // styles:{
                    //   backgroundColor:'green',  
                    // },
                    desc,
                    props
                } , id);
                message.success(item.type);
            }

            
        },
        collect:(monitor) => ({
            canDrop:monitor.canDrop(),
        }),
    }))
    return { canDrop , drop }
}