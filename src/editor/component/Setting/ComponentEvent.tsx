import { Button, Collapse , type CollapseProps } from 'antd';
import { useComponentsStore } from '../../stores/components';
import { useComponentConfigStore, type ComponentEvent } from '../../stores/component-config';
import { useState } from 'react';
import { ActionModal } from './ActionModal';
import { type GoToLinkConfig } from './actions/GoToLink';
import type { ShowMessageConfig } from './actions/showMessage';
import { DeleteOutlined } from '@ant-design/icons'
import type { CustomJSConfig } from './actions/CustomJS';

//事件编辑页面
export function ComponentEvent() {

    const { curComponentId , curComponent , updateComponentProps } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();
    const [ actionModalOpen , setActionModalOpen ] = useState<boolean>(false);
    const [ curEvent , setCurEvent ] = useState<ComponentEvent>(); //方便给事件配置弹窗传递当前是哪个事件
    

    if(!curComponent) return null;

    //从哪个事件去删除他的第几个action
    function deleteAction(event:ComponentEvent , index:number){
        if(!curComponent || !curComponentId) return;
        
        //这个事件下面所有的动作
        const actions = curComponent.props[event.name]?.actions;
        //从index开始删除，删一个
        actions.splice(index , 1);

        updateComponentProps(curComponentId , {
            [event.name]:{
                actions:actions //更新为删除过的
            }
        })

    }

    function handleModalOk(config:GoToLinkConfig|ShowMessageConfig|CustomJSConfig|null){
        if(!config || !curEvent || !curComponent || config == null) {
            return;
        }

        if(!curComponentId) return;
        
        updateComponentProps(curComponentId , {
            [curEvent.name]:{
                actions:[
                    ...(curComponent.props[curEvent.name]?.actions || []),
                    config
                ]
            }
        })
        setActionModalOpen(false);
    }
    
    //创造一个Collapse需要的items渲染
    const items: CollapseProps['items'] = (componentConfig[curComponent.name].events || []).map(event => {
        return {
            key:event.name,
            label:<div className='flex justify-between leading-[30px]'>
                {/* 点击那两个字 + 一个按钮显示关于这个事件的弹窗 */}
                <span>{event.label}</span>
                <Button type='primary' onClick={(e) => {
                    e.stopPropagation();//阻止事件冒泡到可以触发展开关闭的div,这样就只能触发button的功能
                    setCurEvent(event);
                    setActionModalOpen(true);
                }}>
                    添加动作
                </Button>
            </div>,
            children:(
                <div>
                    {
                        (curComponent?.props[event.name]?.actions || []).map((item:GoToLinkConfig|ShowMessageConfig|CustomJSConfig , index:number) => {
                            return <div key={item.type + index}>
                                {
                                    item.type === 'goToLink' ? <div className='border border-[#aaa] m-[10px] p-[10px] relative'>
                                        <div className='text-[blue]'>跳转链接</div>
                                        <div>{item.url}</div>
                                        {/* 绝对定位的删除按钮 */}
                                        <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                                        onClick={() => deleteAction(event, index)}
                                    ><DeleteOutlined /></div>
                                    </div> : null
                                }
                                {
                                    item.type === 'showMessage' ? <div className='border border-[#aaa] m-[10px] p-[10px] relative'>
                                        <div className='text-[blue]'>消息弹窗</div>
                                        <div>{item.config.type}</div>
                                        <div>{item.config.text}</div>
                                        {/* 绝对定位的删除按钮 */}
                                        <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                                            onClick={() => deleteAction(event, index)}
                                        ><DeleteOutlined /></div>
                                    </div> : null
                                }
                                {
                                    item.type === 'customJS' ? <div className='border border-[#aaa] m-[10px] p-[10px] relative'>
                                        <div className='text-[blue]'>自定义JS</div>
                                        <div>{item.code}</div>
                                        {/* 绝对定位的删除按钮 */}
                                        <div style={{ position:'absolute' , top:10 , right:10, cursor:'pointer' }}
                                            onClick={() => deleteAction(event , index)}
                                        ><DeleteOutlined/></div>
                                    </div> : null
                                }
                            </div>
                        })
                    }
                </div>
            ),
        }
    })

    return <div className='px-[10px]'>
        {/* defaultActiveKey只有触发最外层那个key:event.name的div才会展开和关闭而不是该域的所有元素，
        只要阻止事件冒泡到那个有key的div,就可以成功让点击添加动作按钮和展开关闭无关 */}
        <Collapse className='mb-[10px]' items={items} defaultActiveKey={componentConfig[curComponent.name].events?.map(item =>item.name)}
/>
        {/* 弹窗，点击事件的添加动作，显示,平常不显示 */}
        <ActionModal visible={actionModalOpen} handleOk={handleModalOk}
            handleCancel={() => {
            setActionModalOpen(false)
        }}/>
    </div>
}
