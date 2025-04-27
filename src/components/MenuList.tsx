import React from 'react';

interface MenuListProps {
  children: React.ReactNode;
}

const MenuList = ({ children }: MenuListProps) => {
  const childArray = React.Children.toArray(children);

  const childrenWithSeparators = childArray.flatMap((child, index) => {
    const elements = [child];
    if (index < childArray.length - 1) {
      elements.push(
        <hr
          key={`separator-${index}`}
          style={{
            border: 'none',
            height: '1px',
            backgroundColor: 'white',
            marginLeft: 10,
            marginRight: 10,
            marginTop: 0,
            marginBottom: 0,
          }}
        />
      );
    }
    return elements;
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 4px)',
        right: 0,
        background: '#85a312',
        color: 'black',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 1001,
        minWidth: '150px',
      }}
    >
      {childrenWithSeparators}
    </div>
  );
};

export default MenuList;
