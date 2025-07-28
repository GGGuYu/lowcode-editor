import { Button, Collapse , type CollapseProps } from 'antd';
import { useComponentsStore } from '../../stores/components';
import { useComponentConfigStore, type ComponentEvent } from '../../stores/component-config';
import { useState } from 'react';
import { ActionModal } from './ActionModal';
import { type GoToLinkConfig } from './actions/GoToLink';
import type { ShowMessageConfig } from './actions/showMessage';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { CustomJSConfig } from './actions/CustomJS';
import type { ComponentMethodConfig } from './actions/ComponentMethod';

export type ActionConfig = GoToLinkConfig | ShowMessageConfig | CustomJSConfig | ComponentMethodConfig | null

//事件编辑页面
export function ComponentEvent() {

    const { curComponentId , curComponent , updateComponentProps } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();
    const [ actionModalOpen , setActionModalOpen ] = useState<boolean>(false);
    const [ curEvent , setCurEvent ] = useState<ComponentEvent>(); //方便给事件配置弹窗传递当前是哪个事件
    const [curAction  , setCurAction] = useState<ActionConfig>();
    const [curActionIndex  , setCurActionIndex] = useState<number>();

    if(!curComponent) return null;

    //原内容，修改到哪个index元素
    function editAction(event:ComponentEvent ,config:ActionConfig , index:number){
        if(!curComponent) return;
        setCurEvent(event);
        setCurActionIndex(index);
        // console.log(config);
        setCurAction(config);//设置弹窗要显示的config,方便传给弹窗
        setActionModalOpen(true);
    }

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

    function handleModalOk(config:ActionConfig){
        if(!config || !curEvent || !curComponent || config == null) {
            return;
        }

        if(!curComponentId) return;

        //判断是修改还是新增
        if(curAction){
            // console.log(curEvent.name);
            updateComponentProps(curComponentId , {
                [curEvent.name]:{
                    actions:curComponent.props[curEvent.name].actions.map((item:ActionConfig , index:number) => {
                        return index === curActionIndex ? config : item
                    })
                }
            })
        } else {
            //新增
            updateComponentProps(curComponentId , {
                [curEvent.name]:{
                    actions:[
                        ...(curComponent.props[curEvent.name]?.actions || []),
                        config
                    ]
                }
            })
        }
        //下次进入弹窗应该不是修改，除非点击修改
        setCurAction(undefined);//之后就是新增了

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
                    setCurAction(undefined);
                    setCurEvent(event);
                    setActionModalOpen(true);
                }}>
                    添加动作
                </Button>
            </div>,
            children:(
                <div>
                    {
                        (curComponent?.props[event.name]?.actions || []).map((item:GoToLinkConfig|ShowMessageConfig|CustomJSConfig|ComponentMethodConfig , index:number) => {
                            return <div key={item.type + index}>
                                {
                                    item.type === 'goToLink' ? <div className='border border-[#aaa] m-[10px] p-[10px] relative'>
                                        <div className='text-[blue]'>跳转链接</div>
                                        <div>{item.url}</div>
                                        {/* 绝对定位的修改按钮 */}
                                        <div style={{position:'absolute' , top:10 , right:30 , cursor:'pointer'}}
                                            onClick={() => editAction(event , item , index)} //点击修改主要是要弹出来窗口,显示这个动作的属性，方便修改
                                        ><EditOutlined/></div>
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
                                        {/* 绝对定位的修改按钮 */}
                                        <div style={{position:'absolute' , top:10 , right:30 , cursor:'pointer'}}
                                            onClick={() => editAction(event ,item , index)} //点击修改主要是要弹出来窗口,显示这个动作的属性，方便修改
                                        ><EditOutlined/></div>
                                        {/* 绝对定位的删除按钮 */}
                                        <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                                            onClick={() => deleteAction(event, index)}
                                        ><DeleteOutlined /></div>
                                    </div> : null
                                }
                                {
                                    item.type === 'componentMethod' ? <div className='border border-[#aaa] m-[10px] p-[10px] relative'>
                                        <div className='text-[blue]'>组件方法</div>
                                        <div>{item.config.componentId}</div>
                                        <div>{item.config.method}</div>
                                        {/* 绝对定位的修改按钮 */}
                                        <div style={{position:'absolute' , top:10 , right:30 , cursor:'pointer'}}
                                            onClick={() => editAction(event , item , index)} //点击修改主要是要弹出来窗口,显示这个动作的属性，方便修改
                                        ><EditOutlined/></div>
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
                                        {/* 绝对定位的修改按钮 */}
                                        <div style={{position:'absolute' , top:10 , right:30 , cursor:'pointer'}}
                                            onClick={() => editAction(event , item ,index)} //点击修改主要是要弹出来窗口,显示这个动作的属性，方便修改
                                        ><EditOutlined/></div>
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
        <ActionModal visible={actionModalOpen} handleOk={handleModalOk} action={curAction}
            handleCancel={() => {
                setCurAction(undefined);//下次进入弹窗应该不是修改，除非点击修改
                setActionModalOpen(false)
        }}/>
    </div>
}
