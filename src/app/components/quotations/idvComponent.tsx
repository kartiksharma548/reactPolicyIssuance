import { Box, Slider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetProposalDetailsMutation } from "../../redux/rtkQuerySlice/details/proposalDetailsEndPoint";
import { IProposal } from "../../models/IProposal";
import { IProposalModel } from "../../models/IProposalModel";


function IDVComponent({ proposalData }: { proposalData: IProposalModel }) {

    const MAX = 100;
    const MIN = 0;

    const [val, setVal] = useState<number>(proposalData?.IDV || 0);
    const handleChange = (_: Event, newValue: number | number[]) => {
        setVal(newValue as number);
    };




    useEffect(() => {
        setVal(proposalData?.IDV || 0);
    }, [proposalData])

    // if (!isLoading) {
    //     setVal(proposalModel?.IDV || 0);
    // }

    return (<>
        <Stack alignItems={"center"}>
            <Box width={100}>
                <TextField value={val} color="primary" focused />
            </Box>
            <Box sx={{ width: 250 }}>
                <Slider

                    step={1}
                    value={val}
                    valueLabelDisplay="auto"
                    min={MIN}
                    max={MAX}
                    onChange={handleChange}

                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>


                    <Stack alignItems={"center"}>
                        <Typography sx={{ fontWeight: 150, fontSize: '15px' }}>
                            {MIN}
                        </Typography>
                        <Typography sx={{ fontWeight: 100, fontSize: '10px' }}>
                            Minimum Cover
                        </Typography>

                    </Stack>



                    <Stack alignItems={"center"}>
                        <Typography sx={{ fontWeight: 150, fontSize: '15px' }}>
                            {MAX}
                        </Typography>
                        <Typography sx={{ fontWeight: 100, fontSize: '10px' }}>
                            Maximum Cover
                        </Typography>


                    </Stack>


                </Box>
            </Box>
        </Stack>

    </>);
}

export default IDVComponent;