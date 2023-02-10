import React, { FC } from 'react';


const Skeleton: FC<{
    width: number;
    height: number;
    color?: string;
    rounded?: number
    className?: string
}> = ({ width = 100, height = 100, color = '#f4f4f4' , rounded = 0 , className}) => {
    return (
        <div 
        className={className}
        style={{ width: `${width}px`, height: `${height}px`, backgroundColor: color , borderRadius: `${rounded}%` }}
       ></div>
    );
};

export default Skeleton;
