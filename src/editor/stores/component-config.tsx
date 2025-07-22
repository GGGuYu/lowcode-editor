//因为每一个材料都要对应一个实体
//还是用zustand来存配置 
//引入zustand和我的材料
import { create } from "zustand";
import { Container } from "../Material/Container";
import Button from "../Material/Button";
import Page from "../Material/Page";

// 设置器，用户可以通过渲染的设置器设置一些props属性，name是真实属性名，label是name的描述，
// type是这个表单类型，也就是对应渲染一个什么表单让用户去改,用户可以去改变
export interface ComponentSetter {
    name:string; 
    label:string;
    type:string;
    [key:string] :any; 
}

//材料都会有一个配置说明，配置说明的类型
export interface ComponentConfig {
    name:string;
    defaultProps:Record<string , any>;
    desc:string;
    setter?:ComponentSetter[];//设置器，渲染选中该组件的时候，右边的属性setting
    stylesSetter?:ComponentSetter[];
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
    //定义State中的属性,默认属性，因为是配置嘛
    componentConfig:{
        Container:{
            name:'Container',
            defaultProps:{},
            desc:'容器',
            component:Container
        },
        Button:{
            name:'Button',
            defaultProps:{
              type:'primary',
              text:'按钮'  
            },
            desc:'按钮',
            //设置器，用来渲染setting的,用户的操作都被这里定义了
            setter:[
                {
                    name:'type',
                    label:'按钮类型',
                    type:'select',
                    options:[
                        {label:'主按钮' , value: 'primary'},
                        {label:'次按钮' , value:'default'},
                    ]
                },
                {
                  name:'text',
                  label:'文本',
                  type:'input',
                },
            ],
            stylesSetter: [
              {
                name:'width',//字段名
                label:'宽度',//实际展示的表单名
                type:'inputNumber',//渲染类型,用什么html
              },
              {
                name:'height',
                label:'高度',
                type:'inputNumber',
              },
            ],
            component:Button
        },
        Page:{
          name:'Page',
          defaultProps:{},
          desc:'页面',
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