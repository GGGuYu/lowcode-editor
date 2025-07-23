import type { CommonComponentProps } from "../types";
import { useMaterailDrop } from "../../hooks/useMaterialDrop";

interface ContainerProps extends CommonComponentProps {
    
}
//写一些可以拖动的材料


const ContainerDev = ({id ,  children ,styles}:ContainerProps) => {
    //使用useDrop让该组件可以接收Drag
    const { canDrop , drop } = useMaterailDrop(['Button','Container'] , id);
    
    return (
        <div 
        data-component-id={id} //每一个json最后渲染出来一个实体的组件，实体组件最后这个布局要有一个ID，方便我们找到他
        ref={drop}
        className="min-h-[100px] p-[20px]"
        style={{...styles, border:canDrop ? '2px solid blue' : '1px solid #000'}}
        >
            {children}
        </div>
    )
}

export default ContainerDev;