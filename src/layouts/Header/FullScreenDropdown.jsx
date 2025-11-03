import React, { useState } from 'react';

function FullScreenDropdown() {
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);

  const toggleFullscreen = () => {
    const elem = document.documentElement; 

    if (!document.fullscreenElement) {
      elem.requestFullscreen()
        .then(() => setIsFullScreenMode(true))
        .catch((err) => console.error("Error al entrar en pantalla completa:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullScreenMode(false))
        .catch((err) => console.error("Error al salir de pantalla completa:", err));
    }
  };

  return (
    <div className="ms-1 header-item d-none d-sm-flex">
      <button
        onClick={toggleFullscreen}
        type="button"
        className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
      >
        <i
          className={
            isFullScreenMode
              ? 'bx bx-exit-fullscreen fs-22'
              : 'bx bx-fullscreen fs-22'
          }
        ></i>
      </button>
    </div>
  );
}

export default FullScreenDropdown;
