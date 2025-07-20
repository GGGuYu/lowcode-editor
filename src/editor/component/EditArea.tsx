import React , { useEffect } from "react";
import { useComponentConfigStore } from "../stores/component-config";
//json的最小单位，表示一个组件
import { type Component , useComponentsStore } from "../stores/components";




//画布区我要渲染一下
export function EditArea() {
    //要对json增删改查，然后就是渲染Json
    const { components , addComponent } = useComponentsStore();
    //有哪些材料可以用
    const { componentConfig } = useComponentConfigStore();

    // //写一个钩子初始化一些json吧,测试
    // useEffect(() => {
    //     //开始的时候添加一些json
    //     addComponent({
    //         id:222,
    //         name:'Container',
    //         props:{},
    //         children:[],
    //     } , 1);
        
    //     addComponent({
    //         id:333,
    //         name:'Button',
    //         props:{
    //             text:'无敌'
    //         },
    //         children:[],
    //     } , 222)
    // } , []);

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

    return <div className="h-[100%]">
        {/* <pre>
            {JSON.stringify(components , null , 2)}
        </pre> */}
        { renderComponents(components) }
    </div>
    

}