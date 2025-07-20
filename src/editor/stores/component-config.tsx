//因为每一个材料都要对应一个实体
//还是用zustand来存配置 
//引入zustand和我的材料
import { create } from "zustand";
import { Container } from "../Material/Container";
import Button from "../Material/Button";
import Page from "../Material/Page";

//材料都会有一个配置说明，配置说明的类型
export interface ComponentConfig {
    name:string;
    defaultProps:Record<string , any>;
    component:any;//对应一个组件
}


// 存组件和配置说明对应的那个store
//说白了就是注册一个ConfigMap，存一些实体Config,component是对应的材料
interface State {
    componentConfig : {[key:string] : ComponentConfig};//这个应该可以用Record定义吧？
};//定义State就是存的数据类型
interface Action {
    registerComponent:(name:string , componentConfig:ComponentConfig) => void;
}; //增删概查方法的定义

//开始用State和Action写一个具体的zustand的store吧
export const useComponentConfigStore = create<State & Action>((set) => ({
    //定义State中的属性
    componentConfig:{
        Container:{
            name:'Container',
            defaultProps:{},
            component:Container
        },
        Button:{
            name:'Button',
            defaultProps:{
              type:'primary',
              text:'按钮'  
            },
            component:Button
        },
        Page:{
          name:'Page',
          defaultProps:{},
          component:Page,
        },
    },
    //定义Action中的方法
    registerComponent:(name , componentConfig) => {
        set((state) => {
            return {
                ...state,//这个应该无所谓，因为我们只有一个component变量，只需要更新他
                componentConfig:{
                    ...state.componentConfig,
                    [name]:componentConfig, //必须用[name] ,直接写name是字符串
                }
            }
        })
    }
}));