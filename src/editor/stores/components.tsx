import { create  } from "zustand";

//用zustand存json组件信息

//组件对象
export interface Component {
    id:number;//唯一标识
    name:string;//组件类型名字之类的
    props:any;//组件的一些参数属性吧
    children?:Component[];//组件的儿子
    parentId?:number;//组件的父母，方便回去找
}

//真正zustand存的对象类型
interface State {
    components:Component[]; //就是第一层,没有根，直接就是第一层组件
}
//setter的定义
interface Action {
    addComponent: (component:Component,parentId?:number) => void;//把谁插入到哪儿
    deleteComponent: (componentId:number) => void;
    updateComponent: (componentId:number , props:any) => void;
}

//上面基本的数据结构有了，真正的实现zustand
export const useComponentsStore = create<State & Action>(
    (set , get) =>({
       components: [
        {
            id:1,
            name:'Page',
            props:{},
            desc:'页面',
        }, //初始化
       ] ,
       //给state中的数组加一个组件
       addComponent: (component , parentId) => {
        //调用set可以改    
        set((state) => {
            //因为有可能不存在，那就插入第一层，不然按照uo需要的地方插入
            if(parentId) {
                //如果当前插入的这个节点有children就插入，不然创建
                const parentComponent = getComponentById(parentId, state.components);
                if(parentComponent && parentComponent.children){
                    parentComponent.children.push(component);
                }else if(parentComponent && !parentComponent.children){
                    parentComponent.children = [component];
                }
                component.parentId = parentId;
                //记得return出去的state对象才是真正拿去替换的
                return {components:[...state.components]};
            }else{
                //没有插入位置，比如在第一层新增
                return {components:[...state.components , component]};
            }
        })
       },
       deleteComponent:(componentId) => {
            if(!componentId) return;
            //get()就是直接获取到state
            const component = getComponentById(componentId , get().components);
            //关键是他在第一层，还是在某个父母的children属性中
            if(component?.parentId){
                const parentComponent = getComponentById(component.parentId,get().components);
                if(parentComponent){
                    parentComponent.children = parentComponent.children?.filter(
                        (item) => item.id !== +componentId
                    );
                }
                set({components:[...get().components]})
            }else{
                //如果没有父母，则存在在第一层
                get().components = get().components.filter((item) => item.id !== +componentId);
                set({components:[...get().components]})
            }
            
       },
       updateComponent:(componentId , props) => {
            set((state) => {
                const component = getComponentById(componentId , state.components);
                if(component){
                    component.props = {...component.props , ...props};//覆盖
                    return {components:[...state.components]}
                }
                //不存在就原封不动还回去
                return {components:[...state.components]}
            })
       }
    }) 
);

//通过id在一个树中拿到，需递归
export function getComponentById(
    id:number | null , 
    components:Component[]
): Component | null {
    if(!id) return null;
    for(const component of components){
        if(component.id == id) return component;
        if(component.children && component.children.length > 0){
            const res = getComponentById(id , component.children);
            if(res !== null) return res;
        }
    }
    return null;
}