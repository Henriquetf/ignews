import { useState, useEffect } from 'react';

export function Async() {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isButtonInvisible, setIsButtonInvisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true);
      setIsButtonInvisible(true);
    }, 200);
  }, []);

  return (
    <div>
      <div>world Hello</div>

      {isButtonVisible && <button type="button">Button</button>}
      {!isButtonInvisible && <button type="button">Invisible</button>}
    </div>
  );
}
