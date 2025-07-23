import React from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { useComponentsStore, type Component } from "../../stores/components";

//这个比画布简单，因为画布要hover高亮，还要click出编辑框，更新当前选中啥的，这个只需要渲染给用户看效果
//预览组件，当切换到预览的时候，显示当前用户构建的页面，让用户试用
export function Preview() {
    //拿到json , 方便渲染
    const { components } = useComponentsStore();
    //配置类，才能知道要渲染哪个具体的组件，渲染prod而不是dev
    const { componentConfig } = useComponentConfigStore();

    //添加事件函数，渲染的时候给每个组件都尝试添加一个事件
    function handleEvent(component:Component) {
        const props:Record<string,any> = {};

        //这个组件可能定义了很多可能的事件,确定实体component中的事件是config允许的
        //我去找，json里面事件参数，你现在有没有呀，如果有的话，我们就把事件弄成一个props传给渲染的组件
        componentConfig[component.name].events?.forEach((event) => {
           const eventConfig = component.props[event.name];//尝试拿到当前的实体事件
           //如果当前的实体的事件真的被注册了，就能找到config,不然是空
           if(eventConfig) {
                const { type } = eventConfig;//事件触发后的动作
                //整一个在props里面,把事件定义成一个函数塞进去，onClick = () => {}
                props[event.name] = () => {
                    if(type === 'goToLink' && eventConfig.url) {
                        console.log(`发现跳转动作，onClick：() => 跳转到url上：${eventConfig.url}`)
                        window.location.href = eventConfig.url;
                    }   
                }
           }
        });
        //定义完事件以后，存了一堆函数的props就做好了
        return props;
    }

    //渲染函数，根据json和实体类，渲染出来
    function renderComponents(components:Component[]):React.ReactNode {
        return components.map((component:Component) => {
            const config = componentConfig?.[component.name];//通过name找到对应的配置

            if(!config?.prod) return null;

            return React.createElement(
                //第一个参数，组件静态类
                config.prod,
                //第二个参数，给组件传参
                {
                    key:component.id,
                    id:component.id,
                    name:component.name,
                    styles:component.styles,
                    ...config.defaultProps, //默认的属性
                    ...component.props, //用户选的属性
                    //把函数通过参数的方式传递给组件，预览组件只要处理好自己config定义的函数就行了
                    ...handleEvent(component),//把这些函数全部展开到这里，比如 onClick：() => {} 
                },
                //第三个参数，孩子，递归渲染它的孩子
                renderComponents(component.children || [])
            )
        })
    }

    return <div>
        {renderComponents(components)}
    </div>

}