import { Form, Input, InputNumber, Select } from "antd"
import { useComponentsStore, type Component } from "../../stores/components";
import { useComponentConfigStore, type ComponentConfig, type ComponentSetter } from "../../stores/component-config";
import { useEffect, useState, type CSSProperties } from "react";
import CssEditor from "./CssEditor";

export function ComponentStyle() {
    const [form] = Form.useForm();

    const { curComponentId , curComponent , updateComponentStyles} = useComponentsStore();
    
    const { componentConfig } = useComponentConfigStore();
    const [cssEditorChangeFlag , setCssEditorChangeFlag] = useState<boolean>(false);
    const [cssSetterChangeFlag , setCssSetterChangeFlag] = useState<boolean>(false);

    //根据json中的style往form填东西,一开始的时候
    useEffect(() => {
        const data = form.getFieldsValue();
        const styles = curComponent?.styles;
        // console.log('我进来了，我是新的')
        if(styles) {
            form.setFieldsValue({...data , ...styles});
        }else {
            form.resetFields();
        }
    } , [curComponent , cssEditorChangeFlag]); //如果自定义css变了，马上更新

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
            setCssSetterChangeFlag(!cssSetterChangeFlag);//通过setter选择器改了，马上通知自定义编辑区也要更新了
        }
    }

    //处理自定义css组件的回调，如果用户改了自定义css,马上让我知道，我好重新渲染
    function handleCssEditorChange(styles:CSSProperties){
        if(curComponentId && styles){
            updateComponentStyles(curComponentId , styles);
            setCssEditorChangeFlag(!cssEditorChangeFlag);
        }
    }

    return (
        <>
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

            {<CssEditor onChange={handleCssEditorChange} cssSetterChangeFlag={cssSetterChangeFlag} curComponent={curComponent} />}
        </>
    )
}