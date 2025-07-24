import { Collapse , Select , type CollapseProps } from 'antd';
import { useComponentsStore } from '../../stores/components';
import { useComponentConfigStore } from '../../stores/component-config';
import { GoToLink } from './actions/GoToLink';
import { ShowMessage } from './actions/showMessage';


//事件编辑页面
export function ComponentEvent() {

    const { curComponentId , curComponent , updateComponentProps } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();

    if(!curComponent) return null;

    const selectAcition = (eventName:string , value:string) => {
        if(!curComponentId) return;

        updateComponentProps(curComponentId , { [eventName] : {type:value} })
    }


    
    //创造一个Collapse需要的items渲染
    const items: CollapseProps['items'] = (componentConfig[curComponent.name].events || []).map(event => {
        return {
            key:event.name,
            label:event.label,
            children:(
                <div>
                    <div className='flex items-center'>
                        <div>动作：</div>
                        <Select
                            className='w-[160px]'
                            options={[
                                {label:'显示提示' , value:'showMessage'},
                                {label:'跳转连接' , value:'goToLink'},
                            ]} 
                            onChange={(value) => selectAcition(event.name , value)}
                            value={curComponent?.props?.[event.name]?.type}
                        />
                    </div>
                    {/* 点开动作之后让你选，选了以后跳出更进一步的相关属性，比如选择跳连接，那就让填url */}
                    {
                        //当前事件name的当前选择的动作
                        curComponent?.props?.[event.name]?.type === 'goToLink' && <GoToLink event={event}/>
                    }
                    {
                        curComponent?.props?.[event.name]?.type === 'showMessage' && <ShowMessage event={event}/>
                    }
                </div>
            ),
        }
    })

    return <div className='px-[10px]'>
        <Collapse className='mb-[10px]' items={items} />
    </div>
}
