import styled, { IStyledComponent, css } from "styled-components";
import { FastOmit } from "styled-components/dist/types";

export const StyledComponent =(styles, tag: string)=> {
  type StyledCType = IStyledComponent<"web", FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>>;

  let stringStile = '';
  for (let style in styles) {
    stringStile += `; ${style}: ${styles[style]}`
  }
  stringStile = stringStile.slice(2);

  const StyledDiv: StyledCType = styled[tag]`${stringStile}`
  return StyledDiv;

};