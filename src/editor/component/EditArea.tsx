import React , { useState } from "react";
import { useComponentConfigStore } from "../stores/component-config";
//json的最小单位，表示一个组件
import { type Component , useComponentsStore } from "../stores/components";
import { type MouseEventHandler } from "react";
import HoverMask from "./HoverMask";
import { SelectedMask } from "./SelectMask";


//画布区我要渲染一下
export function EditArea() {
    //要对json增删改查，然后就是渲染Json
    const { components , curComponentId , setCurComponentId} = useComponentsStore();
    //有哪些材料可以用
    const { componentConfig } = useComponentConfigStore();
    //状态，当前hover的那个组件最外层div的ID
    const [hoverComponentId , setHoverComponentId] = useState<number>();
    
    //MouseEventHandler是React的一个类型， hover在画布上的时候监听在哪个组件上
    //所以e是React的一个合成事件，现在取得原生事件
    //path是事件冒泡路径，指从最内层元素到最外层元素
    //比直接用 e.target 或 e.currentTarget 更精确地追踪事件来源
    const handleMouseOver:MouseEventHandler = (e) => {
        const path = e.nativeEvent.composedPath();
        //循环从0开始，也就是从最内层开始拿，
        //所以我最后可以拿到最内层的存在data-component-id属性的那个div
        for(let i = 0;i < path.length;i++){
            const ele = path[i] as HTMLElement;//事件路径上的每一个元素
            //注意，dom元素的dataset属性是一个对象，包含所有data-开头的属性，因此可以拿到
            //之前种下的data-component-id
            const componentId = ele.dataset?.componentId;
            if(componentId){
                setHoverComponentId(+componentId);
                return;
            }
        }
    }

    //click的时候，监听点击的是哪个
    const handleClick:MouseEventHandler = (e) => {
        const path = e.nativeEvent.composedPath();
        for(let i = 0;i < path.length;i++){
            const ele = path[i] as HTMLElement;
            const componentId = ele.dataset?.componentId;
            if(componentId){
                setCurComponentId(+componentId);//点击以后马上更新id和当前组件是什么
                return;
            }
        }
    }

    //添加了两个json肯定要渲染出来，那么写一个渲染函数
    function renderComponents(components:Component[]):React.ReactNode {
        return components.map((component:Component) => {
            //先通过每一个json造一个config,然后通过config对象造一个element
            const config = componentConfig?.[component.name] //通过名称取出config
            
            if(!config?.component) return null; //如果没有注册过，就为空
            
            //利用component类和props属性，然后最后一个参数是children element
            return React.createElement(
                config.component,
                {
                    key:component.id,
                    id:component.id,
                    name:component.name,
                    ...config.defaultProps,
                    ...component.props
                },
                renderComponents(component.children || [])
            )
        })
    }
    //其实onMouseLeave只对对外层的page有效，因为里面hoverComponentId变了是会重新创建一个HoverMask的
    //但是从画布区移动出来，不会发现新的componentId，因此原来的componentId不会改变，这是个边界条件
    return <div className="h-[100%] edit-area" onClick={handleClick} onMouseOver={handleMouseOver} onMouseLeave={() => setHoverComponentId(undefined)}> 
        {/* <pre>
            {JSON.stringify(components , null , 2)}
        </pre> */}
        { renderComponents(components) }
        {/* //这个div是画布下第一层，相当于和Page同一层，用createPortal挂载一个mask到这里面
        //但mask用绝对定位来显示他的实际位置，这样不会破坏整个组件树的逻辑关系 */}
        <div className="portal-wrapper"></div>
        {/* 如果点击了就没必要显示hover */}
        {hoverComponentId && hoverComponentId !== curComponentId &&
         <HoverMask containerClassName='edit-area' componentId={hoverComponentId} portalWrapperClassName='portal-wrapper' />
        }
        {/* 编辑框 */}
        {
            curComponentId && 
            <SelectedMask containerClassName='edit-area' componentId={curComponentId} portalWrapperClassName='portal-wrapper' />
        }
    </div>
    

}