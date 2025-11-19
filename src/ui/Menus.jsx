import { createContext, useContext, useEffect, useState } from "react";
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
  z-index: 1000;
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
    e.stopPropagation(); // 阻止事件冒泡

    const rect = e.target.closest("button").getBoundingClientRect();

    // 直接使用视口坐标（fixed定位）
    // 直接使用视口坐标（fixed定位）
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
    openId === "" || openId !== id ? open(id) : close();
  }
  return (
    <StyledToggle onClick={(e) => handlerClick(e)} data-menu-id={id}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }) {
  // 如果openId===id显示List
  const { openId, position } = useContext(MenusContext);
  const [currentPosition, setCurrentPosition] = useState(position);
  useEffect(() => {
    if (openId !== id) return;
    const updatePosition = () => {
      const toggleButton = document.querySelector(`[data-menu-id='${id}']`);
      if (!toggleButton) return;

      const rect = toggleButton.getBoundingClientRect();
      setCurrentPosition({
        x: window.innerWidth - rect.width - rect.x,
        y: rect.y + rect.height + 8,
      });
    };
    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
  }, [openId, id, position]);

  if (openId !== id) return null;
  return createPortal(
    <StyledList $position={currentPosition}>{children}</StyledList>,
    document.body
  );
}

function Button({ children, onClick, icon }) {
  const { close } = useContext(MenusContext);
  function handlerClick() {
    onClick?.();
    close();
  }
  return (
    <li>
      <StyledButton onClick={handlerClick}>
        {" "}
        <span>{icon}</span>
        {children}
      </StyledButton>
    </li>
  );
}

Menus.Toggle = Toggle;
Menus.List = List;
Menus.Menu = Menu;
Menus.Button = Button;

export default Menus;
