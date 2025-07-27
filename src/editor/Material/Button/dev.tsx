import { Button as AntdButton} from 'antd';
import { type ButtonType } from 'antd/es/button';
import type { CommonComponentProps } from "../types";
import { useDrag } from 'react-dnd';
//Button这个材料可以根据参数改变样式
export interface ButtonProps extends CommonComponentProps{
    type:ButtonType,
    text:string
}


const ButtonDev = ({id ,type , text , styles}: ButtonProps) => {
    const [_ , drag] = useDrag({
        type:'Button',
        item:{
            type:'Button',
            dragType:'move',
            id:id
        }
    });

    return (
        <AntdButton ref={drag} style={styles} data-component-id={id} type={type}>{text}</AntdButton>
    )
}


export default ButtonDev;