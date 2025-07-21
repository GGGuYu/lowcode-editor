import { useMemo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getComponentById, useComponentsStore } from "../stores/components";

interface HoverMaskProps {
    containerClassName:string;
    componentId:number;//我要mask到谁的上面
    portalWrapperClassName:string;
}

function HoverMask({containerClassName , componentId , portalWrapperClassName}:HoverMaskProps) {
    //这个状态就是记录我要怎么mask的
    const [position , setPosition] = useState({
        left:0,
        top:0,
        width:0,
        height:0,
        labelTop: 0,
        labelLeft: 0,
    })

    //每次hover的组件改变了，我都要更新mask的核心状态
    useEffect(() => {
        updatePosition();
    } , [componentId]);

    function updatePosition() {
        //如果当前hover的id不存在，不更新
        if(!componentId) return;

        //根据类名先去找到容器
        const container = document.querySelector(`.${containerClassName}`);
        if(!container) return; //找不到就算了
        
        //根据componentId拿到当前hover的节点
        console.log(componentId)
        const node = document.querySelector(`[data-component-id="${componentId}"]`)
        if(!node) return;
        
        const { top,left,width,height } = node.getBoundingClientRect();
        const { top:containerTop , left:containerLeft } = container.getBoundingClientRect();
        //计算一下label显示的位置
        let labelTop = top - containerTop + container.scrollTop;
        if (labelTop <= 0) {
            labelTop -= -20;
        }//因为最外层的page会标签显示到外面去
        const labelLeft = left - containerLeft + width;
        //利用这些数据去更新我们的核心mask边界
        setPosition({
            top:top - containerTop + container.scrollTop,
            left:left - containerLeft + container.scrollTop,
            width:width,
            height:height,
            labelLeft,
            labelTop,
        });
    }

    const { components } = useComponentsStore();
    //当前的component,可以显示更多的关于Component的信息呗，比如当前hover的是一个button
    const curComponent = useMemo(() => {
        return getComponentById(componentId, components);
    }, [componentId]);

    const el:HTMLElement = useMemo(() =>{
       return document.querySelector(`.${portalWrapperClassName}`) as HTMLElement;
    } ,[])


    return createPortal((
        <>
            {/* mask高亮 */}
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
            {/* label信息 */}
            <div
                style={{
                    position: "absolute",
                    left: position.labelLeft,
                    top: position.labelTop,
                    fontSize: "14px",
                    zIndex: 13,
                    display: (!position.width || position.width < 10) ? "none" : "inline",
                    transform: 'translate(-100%, -100%)',//左上方完整的移动一个自身尺寸，不然位置有点奇怪
                }}
                >
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
            </div>
        </>
    ) , el)
}

export default HoverMask;