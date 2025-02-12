import './App.css';
import Deposit from './Deposit/Deposit';
import { useState, useEffect } from "react";

function App() {
  const size = useWindowSize();

  return (
    <div className="App" style={{
      height: `${size.height}`,
      transform: `${size.transform}`,
      width: `${size.width}`,
    }}>
      <Deposit />
    </div>
  );
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    height: window.innerHeight,
    scaleX: 1,
    scaleY: 1,
    transform: "matrix(1, 0, 0, 1, 0, 0)",
    width: window.innerWidth,
  });

  useEffect(() => {
    const designWidth = 375;
    const designHeight = 650;

    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let scaleX = width / designWidth;
      let scaleY = height / designHeight;

      if (width / height < designWidth / designHeight) {
        scaleY = scaleX;
      } else {
        scaleX = scaleY;
      }
      
      const transformMatrix = `matrix(${scaleX}, 0, 0, ${scaleY}, 0, 0)`;

      setWindowSize({
        height: Math.round(height / scaleX),
        scaleX,
        scaleY,
        transform: transformMatrix,
        width,
      });
    }

    // Добавляем слушатель изменения размера окна
    window.addEventListener("resize", handleResize);

    // Инициализируем состояние
    handleResize();

    // Удаляем слушатель при размонтировании компонента
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export default App;
