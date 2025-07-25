
//动作弹窗，点击添加动作，然后应该是一个弹窗，而不是之前那样select选择一个动作，然后在原地显示表单

import { useEffect, useState } from "react";
import { Modal, Segmented } from "antd";
import { GoToLink, type GoToLinkConfig } from "./actions/GoToLink";
import { ShowMessage, type ShowMessageConfig } from "./actions/showMessage";
import { CustomJS,type CustomJSConfig } from "./actions/CustomJS";
import type { ActionConfig } from "./ComponentEvent";


//弹窗组件，基于Modal，只需要配置就可以了
//相当于把每个动作的表单显示到一个弹窗上
interface ActionModalProps {
    visible:boolean;//当前该弹窗是否可见
    action?:ActionConfig;//初始化，根据传入的这个值，显示对应的config页面
    handleOk:(config:ActionConfig) => void;//成功
    handleCancel:() => void;//取消
}

export function ActionModal(props:ActionModalProps) {
    const {
        visible,
        action,
        handleOk,
        handleCancel,
    } = props;

    //映射用于显示
    const map = {
        goToLink:'访问链接',
        showMessage:'消息提示',
        customJS:'自定义JS'
    }

    const [ key , setKey ] = useState<string>('访问链接');//默认当前选择的是访问链接的表单
    const [curConfig , setCurConfig] = useState<GoToLinkConfig | ShowMessageConfig| CustomJSConfig | null>(null);

    //如果传入的有action,就根据action初始化
    useEffect(() => {
        if(action?.type){
            setKey(map[action.type]) //打开的时候根据情况展示
        }    
    } , [action])

    return <Modal
        title="事件动作配置"
        width={800}
        open={visible}
        okText={action ? '修改' : '添加'}
        cancelText="取消"
        onOk={() => handleOk(curConfig)}
        onCancel={handleCancel}
    >
        <div className="h-[500px]">
            <Segmented value={key} onChange={setKey} block options={['访问链接' , '消息提示' ,'自定义JS']}/>
            {
                // value这个值只要改变就会渲染，所以用value，如果用defaultvalue,那么就不会回显，只能最一开始初始化
                key === '访问链接' && <GoToLink value={action?.type === 'goToLink' ? action.url : ''} onChange={(config) => {
                    setCurConfig(config)
                }}/>
            }
            {
                key === '消息提示' && <ShowMessage value={action?.type === 'showMessage' ? action.config : undefined} onChange={(config) => {
                    setCurConfig(config)
                }}/>
            }
            {
                key === '自定义JS' && <CustomJS value={action?.type==='customJS' ? action.code : ''} onChange={(config) => {
                    setCurConfig(config)
                }}/>
            }
        </div>
    </Modal>
}