import React from "react";
import { Route, Routes } from "react-router-dom";
import "./styles.scss";
import { Canvas } from "../Canvas";

const App: React.FC = () => {
  return <Canvas/>
  //   <Routes>
  //     <Route path="/books" element={<div>Hello, React!</div>} />
  //     <Route path="/Canvas" element={<div>Hello, !</div>} />
  //     <Route path="/" element={<Canvas/>} />
  //   </Routes>
  // </>;
};

export { App };