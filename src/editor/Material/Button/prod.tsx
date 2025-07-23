import { Button as AntdButton } from 'antd';
import { type CommonComponentProps } from '../types';

//pord不需要种data-component-id 
const ButtonProd = ({id, type, text, styles}: CommonComponentProps) => {
  return (
    <AntdButton type={type} style={styles}>{text}</AntdButton>
  )
}

export default ButtonProd;

