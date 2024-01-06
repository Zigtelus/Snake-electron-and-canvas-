import { StyledComponent } from "./types/StyledComponent";

const dynamicWidth = '300px'; // Переменная для демонстрации

const StyledDiv = StyledComponent({
  color: "red",
  "font-size": "20px",
  width: `${dynamicWidth}`,
  height: "20px",
  background: "red",
  display: "block"
}, 'span');

export const ExcampleStyledComponent = ()=> {

  return <>
    <StyledDiv></StyledDiv>
  </>
}