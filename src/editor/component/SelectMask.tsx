import { useEffect, useMemo, useState } from "react";
import { useComponentsStore } from "../stores/components";
import { createPortal } from "react-dom";
import { Popconfirm, Space } from "antd";
import { DeleteOutlined } from '@ant-design/icons';

//选择框的Mask
interface SelectedMaskProps {
    portalWrapperClassName:string; //外层画布
    containerClassName:string; //当前选择的那个div
    componentId:number;
}


export function SelectedMask({ containerClassName , componentId , portalWrapperClassName }:SelectedMaskProps) {
    //核心数据，也就是把Mask渲染到哪儿
    const [position , setPosition] = useState({
        left:0,
        top:0,
        width:0,
        height:0,
        labelTop:0,
        labelLeft:0,
    })

    //接下来就是主要围绕着如何计算这些数据
    const { curComponentId , deleteComponent , setCurComponentId ,curComponent} = useComponentsStore();

    useEffect(() => {
        updatePosition();
    } , [componentId]);

    //核心更新数据的函数
    function updatePosition(){
        if(!componentId) return;
        
        const container = document.querySelector(`.${containerClassName}`)//最外层画布
        if(!container) return;
        //点到的是谁
        const node = document.querySelector(`[data-component-id="${componentId}"]`);
        if(!node) return;

        const { top,left,width,height } = node.getBoundingClientRect();
        const{ top:containerTop , left:containerLeft } = container.getBoundingClientRect();

        let labelTop = top - containerTop + container.scrollTop;
        const labelLeft = left - containerLeft + width;
        
        if(labelTop <= 0) labelTop -= 20;

        setPosition({
            top:top - containerTop + container.scrollTop,
            left:left - containerLeft + container.scrollTop,
            width,
            height,
            labelTop,
            labelLeft
        })
    }

    //获取createPortal的挂载点
    const el:HTMLElement = useMemo(() => {
        return document.querySelector(`.${portalWrapperClassName}`) as HTMLElement;
    } , []);
    
    //用户点击删除组件
    function handleDelete() {
        deleteComponent(componentId);
        setCurComponentId(null);
    }

    return createPortal((<>
        {/* 框框 */}
        <div
            style={{
            position: "absolute",
            left: position.left,
            top: position.top,
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            border: "1px dashed blue",
            pointerEvents: "none",
            width: position.width,
            height: position.height,
            zIndex: 12,
            borderRadius: 4,
            boxSizing: 'border-box',
            }}
         />
        {/* 一些选项 */}
        <div
          style={{
            position: "absolute",
            left: position.labelLeft,
            top: position.labelTop,
            fontSize: "14px",
            zIndex: 13,
            display: (!position.width || position.width < 10) ? "none" : "inline",
            transform: 'translate(-100%, -100%)',
          }}
        >
            {/* 水平布局 */}
            <Space>
                {/* 组件名称 */}
                <div
                style={{
                    padding: '0 8px',
                    backgroundColor: 'blue',
                    borderRadius: 4,
                    color: '#fff',
                    cursor: "pointer",
                    whiteSpace: 'nowrap',
                }}
                >
                {curComponent?.name}
                </div>
                {/* 按钮和下拉框 */}
                {curComponentId !== 1 && (
                <div style={{ padding: '0 8px', backgroundColor: 'blue' }}>
                    <Popconfirm
                    title="确认删除？"
                    okText={'确认'}
                    cancelText={'取消'}
                    onConfirm={handleDelete}
                    >
                    <DeleteOutlined style={{ color: '#fff' }}/>
                    </Popconfirm>
                </div>
                )}
            </Space>
        </div>
    </>) , el)

}