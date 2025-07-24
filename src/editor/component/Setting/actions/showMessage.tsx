import { Select } from "antd";
import type { ComponentEvent } from "../../../stores/component-config";
import { useComponentsStore } from "../../../stores/components";
import Input from "antd/es/input/Input";



//渲染需要填写动作为showMessage的时候的表单组件，提供修改该动作的属性的方式
export function ShowMessage(props:{ event:ComponentEvent }) {
    const { event } = props;
    
    const { curComponentId , curComponent , updateComponentProps } = useComponentsStore();
    //在哪一个事件下添加message的type是多少
    function messageTypeChange(eventName:string , value:string) {
        if(!curComponentId) return;

        updateComponentProps(curComponentId , {
            [eventName]:{
                ...curComponent?.props?.[eventName],
                //message这个动作需要一个config,这个函数改type
                config:{
                    ...curComponent?.props?.[eventName]?.config,
                    type:value,
                }
            }
        })
    }
    //在哪一个事件下添加message的Text是多少
    function messageTextChange(eventName:string , value:string) {
        if(!curComponentId) return;

        updateComponentProps(curComponentId , {
            [eventName]:{
                ...curComponent?.props?.[eventName],
                //message这个动作需要一个config,这个函数改text
                config:{
                    ...curComponent?.props?.[eventName]?.config,
                    text:value,
                }
            }
        })
    }

    return (
        <div className="mt-[20px]">
            <div className="flex items-center gap-[10px]">
                <div>类型：</div>
                <div>
                    <Select
                        style={{ width:160 }}
                        options={[
                            {label: '成功' , value:'success'},
                            {label: '失败' , value:'error'}
                        ]} 
                        onChange={(value) => { messageTypeChange(event.name , value) }}
                        value={curComponent?.props?.[event.name]?.config?.type}
                    />
                </div>
            </div>
            <div className="flex items-center gap-[10px] mt-[10px]">
                <div>文本：</div>
                <div>
                    <Input 
                        onChange={(e) => { messageTextChange(event.name , e.target.value) }}
                        value={curComponent?.props?.[event.name]?.config?.text}
                    />
                </div>
            </div>
        </div>
    )

}