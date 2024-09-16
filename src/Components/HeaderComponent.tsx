

import React from 'react'
import logo from '../assets/sonnen-logo.svg'

const HeaderComponent : React.FC = () => {

   return <div className='navbar navbar-expand-lg'>
      <div>
         <img src={logo} className='logo'/>
      </div>
      <p className='title'>Battery Charging State</p>
      <div>
         <a href='https://sonnen.de/ueber-uns/' target="_blank" className="btn btn-primary"> About Sonnen </a>
      </div>
   </div>
 
}
export default HeaderComponent
