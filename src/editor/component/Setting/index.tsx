import { Segmented } from "antd";
import { useComponentsStore } from "../../stores/components";
import { useState } from "react";
import { ComponentAttr } from "./ComponentAttr";
import { ComponentStyle } from "./ComponentStyle";
import { ComponentEvent } from "./ComponentEvent";

export function Setting() {

    //当前选中的是哪个组件，我们方便渲染他的可操作项
    const { curComponentId } = useComponentsStore();

    //有属性、样式、事件，三个可以给用户调节的key
    const [key , setKey] = useState<string>('属性')
    
    if(!curComponentId) return null; //什么都不渲染
    

    return <div>
        {/* antd提供的，可以自己去setkey*/}
        <Segmented value={key} onChange={setKey} block options={['属性' , '样式' ,'事件']}/>
        <div className="pt-[20px]">
            {
                key === '属性' && <ComponentAttr />
            }
            {
                key === '样式' && <ComponentStyle />
            }
            {
                key === '事件' && <ComponentEvent />
            }
        </div>
    </div>
}
