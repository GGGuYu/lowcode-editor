import { Input } from "antd";
import type { ComponentEvent } from "../../../stores/component-config";
import { useComponentsStore } from "../../../stores/components";





export function GoToLink(props:{ event:ComponentEvent }) {
    const { event } = props;

    const { curComponentId , curComponent , updateComponentProps} = useComponentsStore();

    function urlChange(eventName:string , value:string) {
        if(!curComponentId) return;
        //只是在当前event事件下添加url,其他的event下的不变
        updateComponentProps(curComponentId , {
            [eventName]:{
                ...curComponent?.props?.[eventName],
                url:value,
            }
        })
    }

    return (
        <div className='mt-[10px]'>
            <div className='flex items-center gap-[10px]'>
                <span>🔗url：</span>
                <div>
                    <Input
                        onChange={(e) => {urlChange(event.name,e.target.value)}}
                        value={curComponent?.props?.[event.name]?.url} 
                    />
                </div>
            </div>
        </div>
    )
}