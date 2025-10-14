import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.$active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

// 更改过滤组件，使其更具有复用性
function Filter({ filterFiled, options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  //给当前活跃的过滤按钮增加样式
  const currentFilter = searchParams.get(filterFiled) || options.at(0).value;
  function handlerClick(value) {
    setSearchParams({ [filterFiled]: value });
  }
  setSearchParams;
  return (
    <StyledFilter>
      {options.map((option) => (
        <FilterButton
          $active={option.value === currentFilter}
          disabled={option.value === currentFilter}
          key={option.value}
          onClick={() => handlerClick(option.value)}
        >
          {option.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}

export default Filter;
