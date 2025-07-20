import { Button as AntdButton} from 'antd';
import { type ButtonType } from 'antd/es/button';
import type { CommonComponentProps } from "../types";
//Button这个材料可以根据参数改变样式
export interface ButtonProps extends CommonComponentProps{
    type:ButtonType,
    text:string
}


const Button = ({type , text}: ButtonProps) => {
    return (
        <AntdButton type={type}>{text}</AntdButton>
    )
}


export default Button;