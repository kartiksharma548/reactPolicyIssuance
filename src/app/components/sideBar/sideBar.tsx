import { ReactNode, useEffect, useRef, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks'
import { AuthModel } from '../../redux/features/auth/authInterface'
import { getModules } from '../../services/moduleService'
import { BaseAppURL, BaseURL } from '../../constants/baseURL'
import { Link, useNavigate, createSearchParams } from 'react-router-dom'
import {
    Button,
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material'
import { update } from '../../redux/features/menu/menuSlice'
import Collapse from '@mui/material/Collapse'
import InboxIcon from '@mui/icons-material/Inbox'
import MailIcon from '@mui/icons-material/Mail'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import HomeIcon from '@mui/icons-material/Home'
import SearchIcon from '@mui/icons-material/Search'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import SettingsIcon from '@mui/icons-material/Settings'
import common from '../../utils/common'

function SideBar(menuDrawer) {
    const dispatch = useAppDispatch()
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )

    const navigate = useNavigate()
    const menuDrawer1 = useAppSelector<boolean>((state: any) => state.menu)
    const [modules, setModules] = useState([])
    const modulesRef = useRef([])

    useEffect(() => {
        getModulesFn()
    }, [])

    const getModulesFn = async () => {
        let obj = {
            ModuleId: loginSelector.RoleId,
            UserId: loginSelector.UserId
        }
        let modulesArr = await getModules(obj)
        modulesRef.current = modulesArr
        setModules(modulesArr)
    }

    function handleUrlNavigation(moduleObj: any) {
    if (
        common.isNotNullOrEmpty(moduleObj['ModuleURL']) &&
        (moduleObj['IS_FOR_REACT'].toUpperCase() == 'NO' ||
         moduleObj['IS_FOR_REACT'] == '')
    ) {
        if (moduleObj['ModuleName'] == 'Redirect to H2H') {
            window.open(BaseAppURL + moduleObj['ModuleURL'], ''); 
        } else {
            window.open(BaseAppURL + moduleObj['ModuleURL'], '_self'); 
        }
    } else if (
        moduleObj['IS_FOR_REACT'] == 'YES' &&
        common.isNotNullOrEmpty(moduleObj['ModuleReactURL'])
    ) {
        dispatch(update(false))
        navigate(moduleObj['ModuleReactURL'], { state: Math.random() });
    }
}


    const handleToggle = (module: any, index: number) => {
        const tempModules = [...modules]
        module['Toggle'] = !module['Toggle']
        tempModules[index] = module
        setModules(tempModules)
        handleUrlNavigation(module)
    }

    const [searchText, setSearchText] = useState('')

    const handleSearchChange = (event: any) => {
        if (event.target.value == '') {
            setModules(modulesRef.current)
            setSearchText('')
        } else {
            setSearchText(event.target.value.toString())
            let filtered = modulesRef.current.filter(
                (arr) =>
                    arr['ModuleName']
                        .toString()
                        .toUpperCase()
                        .indexOf(event.target.value.toUpperCase()) > -1 &&
                    arr['GroupModuleId'] == 2 &&
                    arr['IsDisplayMenu'] == 'Y'
            )

            setModules(filtered)
        }
    }

    return (
        <>
            {menuDrawer1 && (
                <div
                    id="view"
                    className="h-full flex flex-row"
                    x-data="{ sidenav: true }"
                >
                    <div
                        onClick={() => dispatch(update(false))}
                        aria-hidden
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.2)', 
                            zIndex: 1200
                        }}
                    />
                    <div
                        id="sidebar"
                        style={{ position: 'fixed', zIndex: 1300 }}
                        className="bg-white h-screen md:block shadow-xl px-3 w-30 md:w-60 lg:w-60 overflow-x-hidden transition-transform duration-300 ease-in-out"
                        x-show="sidenav"
                    >
                        <div className="space-y-1 md:space-y-4 my-3">
                            <Button
                                variant="contained"
                                sx={{ minWidth: 'auto', borderRadius: '.5rem' }}
                                onClick={() => {
                                    dispatch(update(!menuDrawer1))
                                }}
                            >
                                X
                            </Button>
                            <hr />
                            <Paper
                                component="form"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    boxShadow: '0px 0px 0px',
                                    border: '1px solid #339',
                                    borderRadius: '.5rem'
                                }}
                            >
                                <InputBase
                                    sx={{ ml: 3, flex: 1 }}
                                    placeholder="Search"
                                    inputProps={{ 'aria-label': 'search' }}
                                    value={searchText}
                                    onChange={handleSearchChange}
                                />
                                <Button
                                    variant="contained"
                                    type="button"
                                    sx={{
                                        p: '5px 10px',
                                        minWidth: 'auto',
                                        borderRadius: '.5rem',
                                        borderTopLeftRadius: '0',
                                        borderBottomLeftRadius: '0'
                                    }}
                                    aria-label="search"
                                >
                                    <SearchIcon />
                                </Button>
                            </Paper>
                            {/* <p className="text-xs text-gray-500 px-2">Main</p> */}
                            <Box id="menu" className="my-3 flex flex-col mt-0">
                                {/* Adjust the loop based on the number of
                                dropdowns */}
                                <div>
                                    <Link to={'/dashboard'}>
                                        <a className="flex items-center justify-between cursor-pointer mb-2 text-sm font-medium no-underline text-gray-500 py-2 px-2 hover:bg-indigo-800 hover:text-white hover:rounded-lg">
                                            <span>
                                                <HomeIcon
                                                    sx={{
                                                        marginRight: '.6rem'
                                                    }}
                                                />
                                                <span>Dashboard</span>
                                            </span>
                                        </a>
                                    </Link>
                                    {modules.map((x, index) => {
                                        if (
                                            x['ParentModuleId'] == 0 ||
                                            searchText != ''
                                        ) {
                                            return (
                                                <>
                                                    <a
                                                        key={x['ModuleId']}
                                                        className="flex items-center justify-between cursor-pointer mb-2 text-sm font-medium no-underline text-gray-500 py-2 px-2 hover:bg-indigo-800 hover:text-white hover:rounded-lg"
                                                        onClick={() =>
                                                            handleToggle(
                                                                x,
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <span>
                                                            <TextSnippetIcon
                                                                sx={{
                                                                    marginRight:
                                                                        '.6rem'
                                                                }}
                                                            />
                                                            <span className="">
                                                                {
                                                                    x[
                                                                        'ModuleName'
                                                                    ]
                                                                }
                                                            </span>
                                                        </span>
                                                        {x['GroupModuleId'] !=
                                                            2 &&
                                                            (!common.isNotNullOrEmpty(
                                                                x['ModuleURL']
                                                            ) && x['Toggle'] ? (
                                                                <ExpandLess />
                                                            ) : (
                                                                <ExpandMore />
                                                            ))}
                                                    </a>
                                                    <Collapse
                                                        in={x['Toggle']}
                                                        timeout="auto"
                                                        unmountOnExit
                                                        sx={{
                                                            paddingLeft: '1rem'
                                                        }}
                                                    >
                                                        <List component="div">
                                                            {modules.map(
                                                                (
                                                                    x2,
                                                                    index2
                                                                ) => {
                                                                    if (
                                                                        x[
                                                                            'ModuleId'
                                                                        ] ==
                                                                            x2[
                                                                                'ParentModuleId'
                                                                            ] &&
                                                                        x2[
                                                                            'GroupModuleId'
                                                                        ] ==
                                                                            1 &&
                                                                        x2[
                                                                            'IsDisplayMenu'
                                                                        ] == 'Y'
                                                                    ) {
                                                                        return (
                                                                            <>
                                                                                <a
                                                                                    key={
                                                                                        x2[
                                                                                            'ModuleId'
                                                                                        ]
                                                                                    }
                                                                                    className="flex items-center justify-between cursor-pointer mb-2 text-sm font-medium no-underline text-gray-500 py-2 px-2 hover:bg-indigo-800 hover:text-white hover:rounded-lg"
                                                                                    onClick={() =>
                                                                                        handleToggle(
                                                                                            x2,
                                                                                            index2
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <span>
                                                                                        {/* <SettingsIcon
                                                                                            sx={{
                                                                                                marginRight:
                                                                                                    '.6rem',
                                                                                            }}
                                                                                        /> */}
                                                                                        <span className="">
                                                                                            {
                                                                                                x2[
                                                                                                    'ModuleName'
                                                                                                ]
                                                                                            }
                                                                                        </span>
                                                                                    </span>
                                                                                    {!common.isNotNullOrEmpty(
                                                                                        x2[
                                                                                            'ModuleURL'
                                                                                        ]
                                                                                    ) &&
                                                                                    x2[
                                                                                        'Toggle'
                                                                                    ] ? (
                                                                                        <ExpandLess />
                                                                                    ) : (
                                                                                        <ExpandMore />
                                                                                    )}
                                                                                </a>
                                                                                <Collapse
                                                                                    in={
                                                                                        x2[
                                                                                            'Toggle'
                                                                                        ]
                                                                                    }
                                                                                    timeout="auto"
                                                                                    unmountOnExit
                                                                                    sx={{
                                                                                        paddingLeft:
                                                                                            '1rem'
                                                                                    }}
                                                                                >
                                                                                    <List component="div">
                                                                                        {modules.map(
                                                                                            (
                                                                                                x3,
                                                                                                index3
                                                                                            ) => {
                                                                                                if (
                                                                                                    x2[
                                                                                                        'ModuleId'
                                                                                                    ] ==
                                                                                                        x3[
                                                                                                            'ParentModuleId'
                                                                                                        ] &&
                                                                                                    x3[
                                                                                                        'GroupModuleId'
                                                                                                    ] ==
                                                                                                        2 &&
                                                                                                    x3[
                                                                                                        'IsDisplayMenu'
                                                                                                    ] ==
                                                                                                        'Y'
                                                                                                ) {
                                                                                                    return (
                                                                                                        <>
                                                                                                            <a
                                                                                                                key={
                                                                                                                    x3[
                                                                                                                        'ModuleId'
                                                                                                                    ]
                                                                                                                }
                                                                                                                className="flex items-center justify-between cursor-pointer  mb-2 text-sm font-medium no-underline text-gray-500 py-2 px-2 hover:bg-indigo-800 hover:text-white hover:rounded-lg"
                                                                                                                onClick={() =>
                                                                                                                    handleToggle(
                                                                                                                        x3,
                                                                                                                        index3
                                                                                                                    )
                                                                                                                }
                                                                                                            >
                                                                                                                <span>
                                                                                                                    <span className="">
                                                                                                                        {
                                                                                                                            x3[
                                                                                                                                'ModuleName'
                                                                                                                            ]
                                                                                                                        }
                                                                                                                    </span>
                                                                                                                </span>
                                                                                                                {/* {x3[
                                                                                                                        'Toggle'
                                                                                                                    ] ? (
                                                                                                                        <ExpandLess />
                                                                                                                    ) : (
                                                                                                                        <ExpandMore />
                                                                                                                    )} */}
                                                                                                            </a>
                                                                                                        </>
                                                                                                    )
                                                                                                }
                                                                                            }
                                                                                        )}
                                                                                    </List>
                                                                                </Collapse>
                                                                            </>
                                                                        )
                                                                    }
                                                                }
                                                            )}
                                                        </List>
                                                    </Collapse>
                                                </>
                                            )
                                        }
                                    })}
                                </div>
                            </Box>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SideBar
