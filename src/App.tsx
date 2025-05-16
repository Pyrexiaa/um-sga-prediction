import React from 'react';
import logo from './logo.svg';
import './App.css';
import {AimodelPage} from './pages/Model'

export default function App() {
  return (
    <div className='bg-black'> 
      <div className="mx-5 p-5 rounded-lg min-h-[calc(100vh-40px)] ">
        <AimodelPage />
      </div>
    </div>
   
  );
}
