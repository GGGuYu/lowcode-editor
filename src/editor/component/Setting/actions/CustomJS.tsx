import { useEffect, useState } from "react";
import { useComponentsStore } from "../../../stores/components";
import TextArea from "antd/es/input/TextArea";

//actions数组里面，自定义事件怎么存配置
export interface CustomJSConfig {
    type:'customJS';
    code:string
}

//参数
export interface CustomJSProps {
    value?:string;//改成受控
    defaultValue?:string;//可以显示一些提示，比如可以用context
    onChange?:(config:CustomJSConfig) => void;//发生变化以后，回调给父组件，让他可以添加
}


export function CustomJS(props:CustomJSProps) {
    const { value:val, defaultValue , onChange } = props;
    //事件的最上层是组件，要有这个按钮才能继续下去
    const { curComponentId } = useComponentsStore();
    //存code
    const [ value , setValue ] = useState<string>(defaultValue || '');

    //只要传进来的参数变了，马上要更新，为了回显
    useEffect(() => {
        if(val) {
            setValue(val);
        }else setValue('')
    } , [val]);

    //发生改变的时候，构造一个config，然后回传
    function codeChange(curValue?:string) {
        if(!curComponentId) return;
        
        setValue(curValue || '');//回显

        onChange?.({
            type:'customJS' , 
            code:curValue || ''
        })
    }

    return <div className="mt-[40px]">
          <div className="flex items-center gap-[20px]">
                <div>自定义JS</div>
                <TextArea 
                    className="width-[600px] height-[400px]"
                    value={value}
                    onChange={(e) => codeChange(e.target.value)}
                />
          </div>
    </div>
}