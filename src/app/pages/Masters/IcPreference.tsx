import { useEffect, useRef, useState } from 'react'
import { getMasterData } from '../../services/policyServices/policyService'
import { PolicyMastersInput } from '../../models/loginInputModel'
import { useAppSelector } from '../../hooks/reduxHooks'
import { AuthModel } from '../../redux/features/auth/authInterface'
import { Box, Container, Stack } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { Grid, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { BasePath } from '../../constants/baseURL'

function IcPreference() {
    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )

    const Input: PolicyMastersInput = {
        Id: loginSelector.DealerId,
        CoverType: 0,
        PolicyType: '',
        VehicleType: '',
        DealerId: loginSelector.DealerId,
        IsDemoVehicle: 0,
        PolicyNo: '',
        Name: '',
        Mode: ''
    }

    useEffect(() => {
        getIcsList()
    }, [])

    const [ics, setIcs] = useState([])
    const mainICList = useRef([])

    const getIcsList = async () => {
        let masterData = await getMasterData(Input)
        if (masterData != null) {
            const finalresponse = masterData.data
            if (finalresponse.ICList.ICs.length > 0) {
                finalresponse.ICList.ICs.forEach((ic) => {
                    ic.checked = false
                })
            }
            mainICList.current = finalresponse.ICList.ICs

            setIcs(finalresponse.ICList.ICs)
        }
    }

    const handleICSelection = (Ic, index) => {}

    const navigate = useNavigate()
    return (
        <>
            <Container maxWidth="xl" sx={{ mb: 4 }}>
                <div className="box-header with-border">
                    <h1 className="box-title flex items-center my-2">
                        <svg
                            onClick={() => navigate(-1)}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M20 11.0005H6.82998L9.70998 8.12047C10.1 7.73047 10.1 7.10047 9.70998 6.71047C9.31998 6.32047 8.68998 6.32047 8.29998 6.71047L3.70998 11.3005C3.31998 11.6905 3.31998 12.3205 3.70998 12.7105L8.29998 17.3005C8.68998 17.6905 9.31998 17.6905 9.70998 17.3005C10.1 16.9105 10.1 16.2805 9.70998 15.8905L6.82998 13.0005H20C20.55 13.0005 21 12.5505 21 12.0005C21 11.4505 20.55 11.0005 20 11.0005Z"
                                fill="#22334F"
                            />
                        </svg>
                        <span className="ml-2">Preferred Ics</span>
                    </h1>
                </div>

                <Grid container spacing={6}>
                    {ics.map((ic, index) => {
                        return (
                            <>
                                <Grid
                                    item
                                    xs={6}
                                    md={3}
                                    lg={2}
                                    key={ic['ICId']}
                                >
                                    <div className="flex flex-row items-center border border-gray-200 rounded-lg w-100 ICBox PolicyListing">
                                        <div className="checkIC">
                                            <FormGroup>
                                                <FormControlLabel
                                                    onChange={handleICSelection}
                                                    control={
                                                        <Checkbox
                                                            name="checked"
                                                            value={ic['ICId']}
                                                            checked={
                                                                ic['checked']
                                                            }
                                                        />
                                                    }
                                                    label=""
                                                    sx={{ margin: 0 }}
                                                />
                                            </FormGroup>
                                        </div>
                                        <div className="flex flex-col justify-between p-2 mx-auto leading-normal IC">
                                            <h5 className="mb-1 text-2l font-bold tracking-tight text-gray-900 leading-4 text-center dark:text-white ICName">
                                                <span>{ic['ICName']}</span>
                                            </h5>
                                            <div className="border p-2 rounded w-24 icItem">
                                                <img
                                                    src={
                                                        BasePath +
                                                        '/Images/Product/' +
                                                        ic['LogoPath']
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </>
                        )
                    })}
                </Grid>
                <Stack>
                    <Box>No Preferred Ics</Box>
                </Stack>
            </Container>
        </>
    )
}

export default IcPreference
