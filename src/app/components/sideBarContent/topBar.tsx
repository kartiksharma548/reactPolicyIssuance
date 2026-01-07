import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../../Tata-Logo.png'
import localService from '../../utils/localStorage'
import { deepPurple } from '@mui/material/colors'
import { AppBar, Avatar, Button, Box, Toolbar, Typography } from '@mui/material'
import Common from '../../utils/common'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { update } from '../../redux/features/menu/menuSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { AuthModel } from '../../redux/features/auth/authInterface'
import { BaseAppURL } from '../../constants/baseURL'
import TickerBar from "../../components/Ticker/TickerBar";

function TopNavBar() {
    //let loginData = JSON.parse(localService.get('loginData') || '{}')
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const menuDrawer = useAppSelector<boolean>((state: any) => state.menu)
    //const [menuToggle, setMenuToggle] = useState(menuDrawer);

    // useEffect(() => {
    //     dispatch(update(menuToggle));
    // }, [menuToggle]);
    const [auth, setAuth] = React.useState(true)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked)
    }

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = (action: string) => {
        if (action == 'LOGOUT') navigate('/logout')
        if (action == 'CHANGE_PASS') {
            setAnchorEl(null)
            window.location.href = BaseAppURL + '/Login/ChangePassword' 
            return
        }
        setAnchorEl(null)
    }
    return (
        <>
        <AppBar
            position="static"
            sx={{
                paddingTop: '0px',
                background: '#fff',
                margin: '0 1rem',
                boxShadow: '0 0 0',
                borderBottom: '1px solid #ddd'
            }}
        >
            <Toolbar className="flex-grow justify-between items-center " sx={{ px: 7}} disableGutters>
                <div className="flex items-center">
                    <IconButton
                        size="large"
                        edge="start"
                        color="primary"
                        aria-label="menu"
                        sx={{ mr: 3, color: '#fff', ml: 1 }}
                        className="ToggleBtn logoBtn"
                        onClick={() => {
                            dispatch(update(!menuDrawer))
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <span>
                        <Link to={'/dashboard'}>
                            <img src={logo} alt="logo" className="TataLogo" />
                        </Link>
                    </span>
                    
                    <div className="flex items-center ">
                        {/* <Button
                                variant="contained"
                                color="primary"
                                sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 3, ml:5 }}
                            >
                                News
                    </Button> */}


                        <Button
                            variant="contained"
                            sx={{
                                borderRadius: '8px 0 0 8px', 
                                fontWeight: 600,
                                textTransform: 'none',
                                px: 3,
                                ml: 5,
                                backgroundColor: '#2979ff',
                                color: '#fff',
                                position: 'relative',
                                overflow: 'visible',
                                '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                right: -5,
                                transform: 'translateY(-50%)',
                                width: 0,
                                height: 0,
                                borderTop: '14px solid transparent',
                                borderBottom: '14px solid transparent',
                                borderLeft: '12px solid #2979ff',
                                },
                                '&:hover': {
                                backgroundColor: '#1565c0',
                                '&::after': {
                                    borderLeftColor: '#1565c0',
                                }
                                }
                            }}
                            >
                            NEWS
                            </Button>

                    <TickerBar />
                </div>

                </div>
                
                
                <div className="flex items-center gap-2">
                    {/* <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="primary"
                        sx={{backgroundColor:'#ECF0F4', color:'#22334F',}}
                    >
                        <AccountCircle />
                    </IconButton> */}
                            
                    
                    <Typography
                        className="text-gray-500 hidden md:block"
                        sx={{
                            ml: 3,                 
                            fontSize: '13px',     
                            lineHeight: '14px',
                            color: '#6b7280'      
                        }}
                    >
                        {loginSelector.Name}
                    </Typography>
                    
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                    >

                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                width="28"
                                height="28"
                                rx="14"
                                fill="#ECF0F4"
                            />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M14 6.5C12.8949 6.5 11.8351 6.93899 11.0537 7.72039C10.2723 8.50179 9.83333 9.5616 9.83333 10.6667C9.83333 11.7717 10.2723 12.8315 11.0537 13.6129C11.1087 13.6679 11.165 13.7212 11.2227 13.7727C10.5089 14.0998 9.8518 14.5534 9.28595 15.1193C8.03571 16.3695 7.33333 18.0652 7.33333 19.8333V20.6667C7.33333 21.1269 7.70642 21.5 8.16666 21.5C8.6269 21.5 8.99999 21.1269 8.99999 20.6667V19.8333C8.99999 18.5073 9.52678 17.2355 10.4645 16.2978C11.4021 15.3601 12.6739 14.8333 14 14.8333C15.3261 14.8333 16.5978 15.3601 17.5355 16.2978C18.4732 17.2355 19 18.5073 19 19.8333V20.6667C19 21.1269 19.3731 21.5 19.8333 21.5C20.2936 21.5 20.6667 21.1269 20.6667 20.6667V19.8333C20.6667 18.0652 19.9643 16.3695 18.714 15.1193C18.1482 14.5534 17.4911 14.0998 16.7773 13.7727C16.835 13.7212 16.8913 13.6679 16.9463 13.6129C17.7277 12.8315 18.1667 11.7717 18.1667 10.6667C18.1667 9.5616 17.7277 8.50179 16.9463 7.72039C16.1649 6.93899 15.1051 6.5 14 6.5ZM12.2322 8.8989C12.7011 8.43006 13.337 8.16667 14 8.16667C14.663 8.16667 15.2989 8.43006 15.7678 8.8989C16.2366 9.36774 16.5 10.0036 16.5 10.6667C16.5 11.3297 16.2366 11.9656 15.7678 12.4344C15.2989 12.9033 14.663 13.1667 14 13.1667C13.337 13.1667 12.7011 12.9033 12.2322 12.4344C11.7634 11.9656 11.5 11.3297 11.5 10.6667C11.5 10.0036 11.7634 9.36774 12.2322 8.8989Z"
                                fill="#22334F"
                            />
                        </svg>
                    </IconButton>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        open={Boolean(anchorEl)}
                        onClose={() => handleClose('')}
                    >
                        {/* <MenuItem>
                        {loginSelector.Name}
                        </MenuItem> */}
                        <MenuItem onClick={() => handleClose('CHANGE_PASS')}>
                            Change Password
                        </MenuItem>
                        <MenuItem onClick={() => handleClose('LOGOUT')}>
                            Logout
                        </MenuItem>
                    </Menu>
                    {/* <Avatar sx={{ bgcolor: deepPurple[500] }}>{Common.isNotNullOrEmpty(loginData["DealerName"]) ? loginData["DealerName"].substr(0, 1) : ""}</Avatar> */}
                    {/* <ul className="ml-1 navbar-nav mr-0 mr-md-3 my-2 my-md-0" style={{ marginLeft: "0px !important" }}>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" id="userDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fas fa-user fa-fw"></i></a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                                <a className="dropdown-item" href="http://localhost:64871/Login/ChangePassword">Change Password</a>
                                <div className="dropdown-divider"></div>
                                <Link className="dropdown-item" to="/logout">Logout</Link>
                            </div>
                        </li>
                    </ul> */}
                </div>
            </Toolbar>
            
        </AppBar>

    
    </>
    )
}

export function CustomerQuotationNavBar() {
    //let loginData = JSON.parse(localService.get('loginData') || '{}')
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const menuDrawer = useAppSelector<boolean>((state: any) => state.menu)
    //const [menuToggle, setMenuToggle] = useState(menuDrawer);

    // useEffect(() => {
    //     dispatch(update(menuToggle));
    // }, [menuToggle]);
    const [auth, setAuth] = React.useState(true)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked)
    }

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = (action: string) => {
        if (action == 'LOGOUT') navigate('/logout')

        setAnchorEl(null)
    }
    return (
        <AppBar
        className='preview-headerdisabled'
            position="static"
            sx={{
                paddingTop: '0px',
                background: '#fff',
                boxShadow: '0 0 0',
                borderBottom: '1px solid #ddd'
            }}
        >
            <Toolbar className="flex-grow justify-between items-center">
                <div className="flex items-center">
                    <span>
                        <img
                            src={logo}
                            alt="logo"
                            className="TataLogo w-[90%] md:w-[100%]"
                        />
                    </span>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default TopNavBar
