
//自己实现一个自定义style填写

import { useEffect, useState, type ChangeEvent, type CSSProperties } from "react";
import { type Component } from "../../stores/components"

interface CssEditorProps {
    curComponent:Component,
    cssSetterChangeFlag:boolean,
    onChange:(styles:CSSProperties) => void;
}

//用户写的样式我就变成一个对象，然后把这个对象变成CSS类型，然后更新json中的styles
export default function CssEditor({onChange , cssSetterChangeFlag , curComponent}:CssEditorProps) {
    const [localValue , setLocalValue] = useState<string>();

    //做一下防抖，核心就是，只有在500ms之后没有改变，我才回调进行真正的数据操作
    //所以需要一个定时器容器，真正的回调都依靠这个定时器，如果500ms内发生了改变，那么就清除掉这个定时器
    const [timer , setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    //定时器必须清理
    useEffect(() => {
       return () => {
        if(timer){
            clearTimeout(timer);
        }
       }
    } , []);

    //第一次进来的时候的初始化
    useEffect(() => {
        const textArea = document.querySelector(`.styles-textarea`) as HTMLTextAreaElement;
        const styles = curComponent?.styles;
        if(styles) {
            if(textArea){
                console.log(styles)
                setLocalValue(JSON.stringify(styles , null , 2));//把当前选中的低代码组件的样式先初始化到自定义编辑框
            }
        }else {
            setLocalValue('');
        }
    } , [curComponent,cssSetterChangeFlag])//如果用户通过setter改了，那么我也要重新初始化setter的值


    if(!curComponent) return null;

    //更改以后回写 ， 注意防抖
    const handleTextareaChange = (e:ChangeEvent<HTMLTextAreaElement>) => {
        //textarea里面写的是styles
        const stylesJson = e.target.value;
        setLocalValue(stylesJson);
        //是否真正回调，要防抖
        if(timer) clearTimeout(timer);

        const newTimer = setTimeout(() => {
            //转化stylesJson为CSSProperties
            const styles = JSON.parse(stylesJson) as CSSProperties;
            onChange(styles);//当前的CSSProperties回传给父组件
        } , 500);

        setTimer(newTimer);//为了判断，必须要用一个这个容器

    }

    return (
        <div className="w-[100%] flex items-center justify-center">
            <textarea value={localValue} onChange={handleTextareaChange} className="styles-textarea min-h-[10vw] border-[#000] border-solid border-[1px]"></textarea>
        </div>
    )
}