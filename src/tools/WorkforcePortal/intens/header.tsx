import React from "react";
import "./style/header.css";

interface HeaderProps {
  setShowUtilities: (value: boolean) => void;
  onOpenSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({
  setShowUtilities,
  onOpenSidebar,
}) => {
  return (
    <header className="wf-header">
      {/* Left */}
      <div className="wf-header-left">
        <button
          className="wf-header-menu-btn"
          onClick={onOpenSidebar}
          aria-label="Abrir menu"
        >
          ☰
        </button>

        <span className="wf-header-title">Ascenda</span>
      </div>

      {/* Right */}
      <div className="wf-header-right">
        <button
          className="wf-header-action"
          onClick={() => setShowUtilities(true)}
        >
          Utilidades
        </button>

        <div className="wf-header-avatar">
          <span>D</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
