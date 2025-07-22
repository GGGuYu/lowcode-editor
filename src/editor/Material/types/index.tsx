import { PropsWithChildren, type CSSProperties } from "react";

export interface CommonComponentProps extends PropsWithChildren{
    id: number;
    name: string;
    styles?:CSSProperties;
    [key: string]: any //其他属性任意
}//最后创建实体的时候我们所有的材料都要传入一个id和name,也就是实体要对应json结构的id和name