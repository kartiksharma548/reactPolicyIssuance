import { Grid, Stack } from '@mui/material'
import SideBar from '../sideBar/sideBar'
import Footer from '../sideBarContent/footer'
import TopNavBar from '../sideBarContent/topBar'
import { useAppSelector } from '../../hooks/reduxHooks'
import { AuthModel } from '../../redux/features/auth/authInterface'
import CodeOfConduct from '../../pages/CodeOfConduct'

function LoggedInContainer({ Component }: any) {
    const menuDrawer = useAppSelector<boolean>((state: any) => state.menu)
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )
    return (
        <>
            <Grid container>
                {loginSelector.IS_MISP_DECL_SUBMIT == 1 && (
                    <Grid item xs={0}>
                        <SideBar menuDrawer={menuDrawer} />
                    </Grid>
                )}

                <Grid item xs={menuDrawer ? 12 : 12}>
                    <div id="layoutSidenav_content">
                        <Stack spacing={2}>
                            <TopNavBar />

                            <main>
                                {loginSelector.IS_MISP_DECL_SUBMIT == 0 ? (
                                    <CodeOfConduct />
                                ) : (
                                    <Component />
                                )}
                            </main>
                        </Stack>

                        <Footer />
                    </div>
                </Grid>
            </Grid>
        </>
    )
}

export default LoggedInContainer
