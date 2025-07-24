
//动作弹窗，点击添加动作，然后应该是一个弹窗，而不是之前那样select选择一个动作，然后在原地显示表单

import { useState } from "react";
import { Modal, Segmented } from "antd";
import { GoToLink, type GoToLinkConfig } from "./actions/GoToLink";
import { ShowMessage, type ShowMessageConfig } from "./actions/showMessage";

//弹窗组件，基于Modal，只需要配置就可以了
//相当于把每个动作的表单显示到一个弹窗上
interface ActionModalProps {
    visible:boolean;//当前该弹窗是否可见
    handleOk:(config:GoToLinkConfig | ShowMessageConfig | null) => void;//成功
    handleCancel:() => void;//取消
}

export function ActionModal(props:ActionModalProps) {
    const {
        visible,
        handleOk,
        handleCancel,
    } = props;

    const [ key , setKey ] = useState<string>('访问链接');//默认当前选择的是访问链接的表单
    const [curConfig , setCurConfig] = useState<GoToLinkConfig | ShowMessageConfig | null>(null);

    return <Modal
        title="事件动作配置"
        width={800}
        open={visible}
        okText="添加"
        cancelText="取消"
        onOk={() => handleOk(curConfig)}
        onCancel={handleCancel}
    >
        <div className="h-[500px]">
            <Segmented value={key} onChange={setKey} block options={['访问链接' , '消息提示' ,'自定义JS']}/>
            {
                key === '访问链接' && <GoToLink onChange={(config) => {
                    setCurConfig(config)
                }}/>
            }
            {
                key === '消息提示' && <ShowMessage onChange={(config) => {
                    setCurConfig(config)
                }}/>
            }
        </div>
    </Modal>
}