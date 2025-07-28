import type { CommonComponentProps } from "../types";
import { useMaterailDrop } from "../../hooks/useMaterialDrop";
import { useDrag } from "react-dnd";
import { useEffect, useRef } from "react";

interface ContainerProps extends CommonComponentProps {
    
}
//写一些可以拖动的材料


const ContainerDev = ({id ,  children ,styles}:ContainerProps) => {
    const divRef = useRef<HTMLDivElement>(null);

    //使用useDrop让该组件可以接收Drag
    const { canDrop , drop } = useMaterailDrop(['Button','Container','Modal','Table'] , id);
    
    const [_ , drag] = useDrag({
        type:'Container',
        item:{
            type:'Container',
            dragType:'move',
            id:id
        }
    });

    //初始化，把drag和dorp都挂载上，必须这样提前导出引用ref
    useEffect(() => {
        drop(divRef);
        drag(divRef);
    } , [])

    return (
        <div 
        data-component-id={id} //每一个json最后渲染出来一个实体的组件，实体组件最后这个布局要有一个ID，方便我们找到他
        ref={divRef}
        className="min-h-[100px] p-[20px]"
        style={{...styles, border:canDrop ? '2px solid blue' : '1px solid #000'}}
        >
            {children}
        </div>
    )
}

export default ContainerDev;