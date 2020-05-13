import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './App.module.scss';

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
        <Modal>
          This is a test
        </Modal>
      )}
      <div className={styles.stickyFooter}>
        Cookies or something you will never read about, but messes up a modal as a direct child
        <button onClick={() => setIsFooterOpen(!isFooterOpen)}>
          Open a modal
        </button>
        {isFooterOpen && (
          <Modal>
            This is rendered 'inside' the sticky footer, and would normally not be allowed to fill the screen.
          </Modal>
        )}
      </div>
    </main>
  );
}

// We will use a hardcoded portal root to make things easier. You have to put a
// dom node in here though, I'm not doing that for you.
const portalRoot = document.querySelector('#portal-root')!;

const Portal: React.FC = ({ children }) => {
  //
  const [targetElem, setTargetElem] = useState(() => (
    document.createElement('div')
  ));
  // This should do portal things
  return (
    <>
      {children}
    </>
  );
};

// This should do modal things (using Portal) and apply styles to the containing div(s)
const Modal: React.FC = ({ children }) => {
  return (
    <div className={styles.modalContainer} >
      <div className={styles.modal} >
        {children}
      </div>
    </div>
  )
};

export default App;
