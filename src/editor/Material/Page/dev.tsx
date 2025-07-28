import type { CommonComponentProps } from "../types";
import { useMaterailDrop } from "../../hooks/useMaterialDrop";

interface PageProps extends CommonComponentProps {
    
}

function PageDev({id , children , styles}:PageProps) {
    
    //拖拽的组件，我会放到Page上
    const { canDrop , drop } = useMaterailDrop(['Button' , 'Container','Modal','Table'] , id);

    return (
        <div
        data-component-id={id}
        ref={drop}//标记你可以drop而且是用刚刚创建的drop
        className="p-[20px] h-[100%] box-border"
        style={{...styles, border:canDrop ? '2px solid blue' : 'none' }}//能够drop的元素应该显示蓝色边框
        >
            {children}
        </div>
    )
}


export default PageDev;