import type { CommonComponentProps } from "../types";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal as AntdModal } from 'antd';



//弹窗组件要暴露API给别人控制
export interface ModalRef {
    open: () => void;
    close: () => void;
}

export interface ModalProdProps extends CommonComponentProps{
    title?:string;
    onOk?:() => void;
    onCancel?:() => void;
}

//申明该组件会暴露Ref出来，ref的类型和普通参数的类型
//这是一个可以drop可以控制API的弹窗物料，这是他的prod也就是预览的时候真实渲染的
const ModalProd = forwardRef<ModalRef , ModalProdProps>(({ children ,title ,onOk , onCancel, styles} , ref) => {
    const [open , setOpen] = useState<boolean>(false);
    
    //自定义暴露的ref
    useImperativeHandle(ref , () => {
        return {
            open:() => setOpen(true),
            close:() => setOpen(false),
        }
    } , []);

    return (
        <AntdModal
            title={title}
            style={styles}
            open={open}
            onCancel={() => {
                if(onCancel) onCancel();
                else setOpen(false);
            }}
            onOk={() => {
                if(onOk) onOk();
                else setOpen(true);
            }}
        >
            { children }
        </AntdModal>
    )
})

export default ModalProd;