import { useState } from "react";
import { useComponentsStore } from "../../../stores/components";
import TextArea from "antd/es/input/TextArea";

export interface GoToLinkConfig {
    type:'goToLink',
    url:string
}

export interface GoToLinkProps {
    defaultValue?:string,
    onChange?:(config:GoToLinkConfig) => void
}


export function GoToLink(props:GoToLinkProps) {
    const { defaultValue , onChange } = props;

    const { curComponentId } = useComponentsStore();
    const [ value , setValue ] = useState(defaultValue);

    //表单发生变化，就暴露变化的值和我们的信息出去，让弹窗组件处理，弹窗点击添加，就可以写入json
    function urlChange(value:string) {
        if(!curComponentId) return;
        
        setValue(value);

        onChange?.({
            type:'goToLink',
            url:value
        })
        
    }

    return (
        <div className='mt-[10px]'>
            <div className='flex items-center gap-[10px]'>
                <span>🔗url：</span>
                <div>
                    <TextArea
                        style={{height:200,width:500,border:'1px solid #000'}}
                        onChange={(e) => { urlChange(e.target.value) }}
                        value={value || ''} 
                    />
                </div>
            </div>
        </div>
    )
}