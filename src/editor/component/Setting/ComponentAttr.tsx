import { Form, Input, Select } from "antd"
import { useComponentsStore, type Component } from "../../stores/components";
import { useComponentConfigStore, type ComponentSetter } from "../../stores/component-config";
import { useEffect } from "react";



export function ComponentAttr() {
    //因为要渲染一些表单，让用户填,form对象
    const [form] = Form.useForm();
    //拿到现在json树里面的选定的组件，根据当前属性去渲染
    const { curComponentId , curComponent , updateComponentProps } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore(); //拿静态类和默认属性
    
    //每次切换选定目标，把当前他的属性，塞到表单里面
    useEffect(() => {
        const data = form.getFieldsValue();
        form.setFieldsValue({...data, ...curComponent?.props});
        //塞进去的就是{type: "primary", text: "按钮"}展开
        //也就是把props中的参数展开放进去
        //一开始初始化是setter里面默认的
        //name={setter.name} label={setter.label}根据name,可以把当前json中的props放进去显示
        // console.log('我初始化塞进去的参数')
        // console.log(curComponent?.props)
    } , [curComponent]);

    if(!curComponentId || !curComponent) return null;
    
    //渲染函数,传入某个属性，渲染某一个属性
    function renderFormElement(setting:ComponentSetter){
        const { type , options } = setting;
        if(type === 'select'){
            //如果select,一定有options
            return <Select options={options} />
        } else if (type === 'input') {
            return <Input />
        }
    }

    //去真的改变json树中的实体的参数
    function valueChange(changeValues:Component["props"]) {
        if(curComponentId) {
            updateComponentProps(curComponentId , changeValues);
            // { type: "default" }穿进去的就是改变的，就传了当前改变的
            //然后函数里面component.props = {...component.props , ...props};
            //直接展开放进去了，你改的就是name={setter.name} label={setter.label}根据name
            //我就可以有changevalue：{ name: "value" }，然后改掉json中的props，从而改变渲染
            //所以呢，changeValue不需要是ComponentConfig类型，他就是一个对象,应该是props
            // console.log('changheValues的值')
            // console.log(changeValues)
        }
    }

    return (
        <Form
            form={form}
            onValuesChange={valueChange}
            labelCol={{ span:8 }}
            wrapperCol={{ span:14 }}
        >
            {/* 不可见的必要属性，不能改 */}
            <Form.Item label='组件id'>
                <Input value={curComponent.id} disabled />
            </Form.Item>

            <Form.Item label='组件名称'>
                <Input value={curComponent.name} disabled />
            </Form.Item>
            <Form.Item label='组件描述'>
                <Input value={curComponent.desc} disabled />
            </Form.Item>
            {
                // 可以改的按照setter定义渲染
                componentConfig[curComponent.name]?.setter?.map(setter => (
                    <Form.Item key={setter.name} name={setter.name} label={setter.label}>
                        {renderFormElement(setter)}
                    </Form.Item>
                ))
            }
        </Form>
    )
}