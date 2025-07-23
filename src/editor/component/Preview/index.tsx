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
                    ...component.props //用户选的属性
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