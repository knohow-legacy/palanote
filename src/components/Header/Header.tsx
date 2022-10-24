import React from 'react';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({backBtn, name, icon, children} : {backBtn?: boolean, name : any, icon?: any, children? : any}) {
  const navigate = useNavigate();
  
  return (
    <div className="header">
        {backBtn && <button><ArrowBack onClick={() => navigate(-1)} /></button>}
        {icon && <h2>{icon}</h2>}
        <h2>{name}</h2>
        {children}
    </div>
  );
}

export default Header;
