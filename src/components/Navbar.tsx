import logo from '../assets/logo.png';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import type { JSX } from 'react';
import { NavLink } from 'react-router-dom';
import type { NavLinkProps } from 'react-router-dom';

function Navbar (): JSX.Element {

    const activeStyle: NavLinkProps['className'] = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link';

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "var(--primary-color)" }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
               <div className='nav-div' style={{ display: "flex", alignItems: "center"}}>
                    <img src={logo} alt="Logo" style={{ height: "40px", marginRight: "10px"}} />
                    <span>FindJobs</span>
                </div>
              
                    <div className='nav-div'>
                        <NavLink to="/" className={activeStyle}>Home</NavLink>
                        <NavLink to="/jobs" className={activeStyle}>Jobs</NavLink>
                        <NavLink to="/add-job" className={activeStyle}>Add Job</NavLink>
                        <NavLink to="/about" className={activeStyle}>About</NavLink>
                    </div>
          
            </Toolbar>
        </AppBar>
        </Box>
    )
};
export default Navbar;