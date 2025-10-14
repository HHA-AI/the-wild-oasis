import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.$position.x}px;
  top: ${(props) => props.$position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenusContext = createContext();

function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState({});
  const close = () => setOpenId("");
  const open = setOpenId;
  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}
function Toggle({ id }) {
  const { openId, close, open, setPosition } = useContext(MenusContext);

  function handlerClick(e) {
    // positon 1)获取点击的button的位置
    const rect = e.target.closest("button").getBoundingClientRect();
    const x = window.innerWidth - rect.width - rect.x;
    const y = rect.y + rect.height + 8;
    setPosition({ x, y });
    // 如果目前没有打开窗口，或者打开的不是本窗口，就打开点击按钮对应的List窗口
    // 如果打开的已经是目前的窗口了，点击后关闭
    rect.openId === "" || openId !== id ? open(id) : close();
  }
  return (
    <StyledToggle onClick={(e) => handlerClick(e)}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }) {
  // 如果openId===id显示List
  const { openId, position } = useContext(MenusContext);

  if (openId !== id) return null;
  return createPortal(
    <StyledList $position={position}>{children}</StyledList>,
    document.body
  );
}

function Button({ children, onClick }) {
  const { close } = useContext(MenusContext);
  function handlerClick() {
    onClick?.();
    close();
  }
  return (
    <li>
      <StyledButton onClick={handlerClick}>{children}</StyledButton>
    </li>
  );
}

Menus.Toggle = Toggle;
Menus.List = List;
Menus.Menu = Menu;
Menus.Button = Button;

export default Menus;
