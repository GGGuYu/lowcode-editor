import { useEffect, useState } from "react";
import { useComponentConfigStore } from "../../../stores/component-config";
import { getComponentById, useComponentsStore, type Component } from "../../../stores/components";
import { Select, TreeSelect } from "antd";



//添加一个这个动作，这个动作的json长什么样子
export interface ComponentMethodConfig {
    type:'componentMethod',
    config:{
        componentId:number,
        method:string
    }
}

export interface ComponentMethodProps {
    value?:ComponentMethodConfig['config'];
    onChange?:(config:ComponentMethodConfig) => void;
}

export function ComponentMethod(props:ComponentMethodProps) {

    const {
        value:val,
        onChange,
    } = props;

    const [ MethodValue , setMethodValue] = useState<ComponentMethodConfig['config'] | undefined>();
    const { components , curComponentId } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();
    //调用实体的方法,方便取得他的其他信息比如name
    const [ selectedComponent , setSelectedComponent ] = useState<Component | null>();

    useEffect(() => {
        console.log(val)
        if(val) {
            setMethodValue(val);
            setSelectedComponent(getComponentById(val.componentId , components))
        } else setMethodValue(undefined);
        
    } , [val])

    //选中的被调者改变
    function componentChange(curId:number){
        if(!curComponentId) return;
        if(MethodValue){
            setMethodValue({
                ...MethodValue,
                componentId:curId,
            })
        } else {
            setMethodValue({
                componentId:curId,
                method:''
            })
        }
        setSelectedComponent(getComponentById(curId , components));
    }

    function methodChange(curMethod:string) {
        // console.log('触发了')
        if(MethodValue){
            setMethodValue({
                ...MethodValue,
                method:curMethod
            })
        }
        if(MethodValue?.componentId){
                onChange?.({
                type:'componentMethod',
                config:{
                    componentId:MethodValue.componentId,
                    method:curMethod
                }
            })
        }
    }

    return <div className="mt-[40px]">
        <div className="flex items-center gap-[10px]">
            <div>组件：</div>
            <TreeSelect
                style={{width:500 , height:50}}
                treeData={components}
                value={MethodValue?.componentId || undefined}
                fieldNames={{
                    label:'name',
                    value:'id'
                }} 
                onChange={(value) => {componentChange(value)}}
            />
        </div>
        {/* 根据当前选择的组件，渲染他配置的可以暴露的方法 */}
        {
            componentConfig[selectedComponent?.name || '']?.methods ? (
                <div className="flex items-center gap-[10px] mt-[20px]">
                    <div>方法</div>
                    <div>
                        <Select
                            style={{ width:500 , height:50 }}
                            options={componentConfig[selectedComponent?.name || ''].methods?.map(
                                method => ({ label:method.label , value:method.name })
                            )} 
                            value={MethodValue?.method || undefined}
                                onChange={(value) => methodChange(value)}
                        />
                    </div>
                </div>
            ) : null
        }
    </div>

}