import { Button as AntdButton } from 'antd';
import { type CommonComponentProps } from '../types';

//pord不需要种data-component-id 
const ButtonProd = ({id, type, text, styles ,...props}: CommonComponentProps) => {
  return (
    //无脑处理所有的额外参数，把他们都放到AntdButton，因为这个antd是可以接受onclick之类的，别人组件有
    <AntdButton type={type} style={styles} {...props} >{text}</AntdButton>
  )
}

export default ButtonProd;

