import { Select } from "antd";
import { useComponentsStore } from "../../../stores/components";
import Input from "antd/es/input/Input";
import { useState } from "react";

//动作showMessage的json会长这个样子
export interface ShowMessageConfig {
    type:'showMessage',
    config :{
        type:'success' | 'error',
        text:string
    }
}

export interface ShowMessageProps {
    value?:ShowMessageConfig['config'];//有两个值初始化，type和text
    onChange?:(config:ShowMessageConfig) => void;//改变以后回调给父组件
}


//渲染需要填写动作为showMessage的时候的表单组件，提供修改该动作的属性的方式
export function ShowMessage(props:ShowMessageProps) {
    const {
        value,
        onChange,
    } = props;
    
    const { curComponentId } = useComponentsStore();

    const [type , setType] = useState<'success' | 'error'>(value?.type || 'success');
    const [text , setText] = useState<string>(value?.text || '');

    //在哪一个事件下添加message的type是多少
    function messageTypeChange(value:'success' | 'error') {
        if(!curComponentId) return;

        setType(value);

        onChange?.({
            type:'showMessage',
            config:{
                type:value,
                text
            }
        })
    }
    //在哪一个事件下添加message的Text是多少
    function messageTextChange(value:string) {
        if(!curComponentId) return;

        setText(value);
        
        onChange?.({
            type:'showMessage',
            config :{
                type,
                text:value
            }
        })

    }

    return (
        <div className="mt-[20px]">
            <div className="flex items-center gap-[10px]">
                <div>类型：</div>
                <div>
                    <Select
                        style={{ width:500 , height:50 }}
                        options={[
                            {label: '成功' , value:'success'},
                            {label: '失败' , value:'error'}
                        ]} 
                        onChange={(value) => { messageTypeChange(value) }}
                        value={type}
                    />
                </div>
            </div>
            <div className="flex items-center gap-[10px] mt-[10px]">
                <div>文本：</div>
                <div>
                    <Input 
                        style={{ width:500 , height:50 }}
                        onChange={(e) => { messageTextChange(e.target.value) }}
                        value={text}
                    />
                </div>
            </div>
        </div>
    )

}