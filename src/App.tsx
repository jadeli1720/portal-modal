import React, { useState, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./App.module.scss";

const App = () => {
  const [isNormalOpen, setIsNormalOpen] = useState(false);
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  return (
    <main className={styles.main}>
      {/* This one works just fine */}
      <button onClick={() => setIsNormalOpen(!isNormalOpen)}>
        Open a modal
      </button>
        {isNormalOpen && (
          <Modal onClose={() => setIsNormalOpen(false)}>
            This is a test
          </Modal>
        )}
      <div className={styles.stickyFooter} >
        Cookies or something you will never read about, but messes up a modal as
        a direct child
        <button onClick={() => setIsFooterOpen(!isFooterOpen)}>
          Open a modal
        </button>
        {isFooterOpen && (
          <Modal onClose={() => setIsFooterOpen(false)}>
            This is rendered 'inside' the sticky footer, and would normally not
            be allowed to fill the screen.
          </Modal>
        )}
      </div>
    </main>
  );
};

// We will use a hardcoded portal root to make things easier. You have to put a
// dom node in here though, I'm not doing that for you.
const portalRoot = document.querySelector("#portal-root")!;

const Portal: React.FC = ({ children }) => {
  //Lazy Intialization => special mode where we give useState a function instead of a value. On mount, only when it needs to get the initial value of the useState, will it evaluate this function to get the value inside of it. This will allow for the document.createElement to only render once on the first render only. HACK!!! not recommended to use often
  const [targetElem] = useState(() =>
    document.createElement("div")
  );
  //useEffect clean up function that will remove the targetElem from the portalRoot when the component un-mounts. We used clean-up functions in the Timer project.
  useEffect(() => {
    portalRoot.appendChild(targetElem);
    return () => {
      portalRoot.removeChild(targetElem);
    };
  }, [targetElem]);

  return (
  createPortal(
    children, 
    targetElem
    )
  );
};

type ModalProps = {
  onClose: () => void;
};

const Modal: React.FC <ModalProps> = ({ children, onClose }) => {
  useScrollLock();

  const handleContainerClick = (e: React.MouseEvent) => {
    if(e.currentTarget === e.target){
      onClose();
    }
  };
  
  return (
    <Portal>
      <div className={styles.modalContainer} onClick={handleContainerClick}>
        <div className={styles.modal}>
          {children}
        </div>
      </div>
    </Portal>
  );
};

//making a custom hook that uses a useEffect hook
const useScrollLock = () => {
  useLayoutEffect(() => {
    const scrollY = window.scrollY;
    const position = document.body.style.position;
    const top = document.body.style.top;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.style.position = position;
      document.body.style.top= top;
      window.scrollTo(0, scrollY);
    }
  }, []);
};

export default App;
