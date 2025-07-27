import { useMaterailDrop } from "../../hooks/useMaterialDrop";
import type { CommonComponentProps } from "../types";


export interface ModalDevProps extends CommonComponentProps{
    title?:string;
}


//因为dev的时候点击不用触发事件，但是要处理drop 所以和prod有区别
//关键是渲染出样式，然后呢渲染出儿子有哪些，从而在编辑页面展示出来结构
function ModalDev({id , children , title , styles}:ModalDevProps){

    //让这个dev的组件渲染出来可以处理drop函数
    const {canDrop , drop} = useMaterailDrop(['Button' , 'Container'] , id); //不能在弹窗再放弹窗
    
    return (
        <div
            ref={drop}
            style={styles}
            data-component-id={id}
            className={`min-h-[100px] p-[20px] ${ canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}`}
        >
            <div>{title}</div>
            <div>
                { children }
            </div>            
        </div>
    )
    
}

export default ModalDev;


