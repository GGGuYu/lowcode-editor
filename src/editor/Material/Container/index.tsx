import type { CommonComponentProps } from "../types";
import { useMaterailDrop } from "../../hooks/useMaterialDrop";

interface ContainerProps extends CommonComponentProps {
    
}
//写一些可以拖动的材料


export const Container = ({id ,  children }:ContainerProps) => {
    //使用useDrop让该组件可以接收Drag
    const { canDrop , drop } = useMaterailDrop(['Button','Container'] , id);

    return (
        <div 
        ref={drop}
        className="min-h-[100px] p-[20px]"
        style={{ border:canDrop ? '2px solid blue' : '1px solid #000' }}
        >
            {children}
        </div>
    )
}