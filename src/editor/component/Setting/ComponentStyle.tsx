import { Form, Input, InputNumber, Select } from "antd"
import { useComponentsStore, type Component } from "../../stores/components";
import { useComponentConfigStore, type ComponentConfig, type ComponentSetter } from "../../stores/component-config";
import { useEffect } from "react";


export function ComponentStyle() {
    const [form] = Form.useForm();

    const { curComponentId , curComponent , updateComponentStyles} = useComponentsStore();

    const { componentConfig } = useComponentConfigStore();

    //根据json中的style往form填东西,一开始的时候
    useEffect(() => {
        const data = form.getFieldsValue();
        const styles = curComponent?.styles;
        if(styles) {
            form.setFieldsValue({...data , ...styles});
        }
    } , [curComponent]);

    if (!curComponentId || !curComponent) return null;

    //渲染用户编辑区，根据设置器stylesSetter,渲染单个
    function renderSetterItem(setter:ComponentSetter) {
        const {type , options} = setter;
        
        if(type === 'select') {
            return <Select options={options} />;
        } else if(type === 'input'){
            return <Input />;
        } else if(type === 'inputNumber') {
            return <InputNumber />
        }
    }

    //改了表单就及时调用更新
    function onChange(changeValues:Component['styles']){
        if(curComponentId && changeValues){
            updateComponentStyles(curComponentId , changeValues);
        }
    }

    return (
    <Form
        form={form}
        onValuesChange={onChange}
        labelCol={{ span:8 }}
        wrapperCol={{ span:14 }}
    >
        {
            componentConfig[curComponent.name]?.stylesSetter?.map(setter => (
                <Form.Item key={setter.name} name={setter.name} label={setter.label}>
                    { renderSetterItem(setter) }
                </Form.Item>
            )) 
        }
    </Form>
    )
}