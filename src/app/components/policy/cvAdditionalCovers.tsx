import { Grid, FormControl } from '@mui/material'
import { FormInputRadio } from '../common/FormInputs/FormInputRadio'
import { FormInputSelect } from '../common/FormInputs/FormInputSelect'

function CVAdditionalCovers(props: any) {
    let {
        policyData,
        getToggleButtonData,
        coverToggleObj,
        control,
        optionalDetails,
        handleOptionalChange,
        LLOT_PaidDriver,
        vehicleData,
        isSAOD,
        isSATP,
        prevODTenure,
        prevTPTenure,
        TpTenure
    } = props

    function conditionalRender() {
        let jsx = <></>
        if (
            (vehicleData.VehicleType == 'PCV' &&
                LLOT_PaidDriver.length > 6 &&
                !isSAOD) ||
            (vehicleData.VehicleType != 'PCV' &&
                policyData.PolicyDetails.VehClass == 'C' &&
                !isSAOD) ||
            (TpTenure > 0 &&
                policyData.Renew.RENEWAL_TYPE == '1' &&
                vehicleData.VehicleType == 'PCV' &&
                LLOT_PaidDriver.length > 6 &&
                policyData.PolicyDetails.CoverTypeId == 0) ||
            (TpTenure > 0 &&
                policyData.Renew.RENEWAL_TYPE == '1' &&
                vehicleData.VehicleType != 'PCV' &&
                policyData.PolicyDetails.CoverTypeId == 0)
        ) {
            jsx = (
                <>
                    {policyData.PolicyDetails.VehClass == 'C' && (
                        <Grid xs={3} md={3}>
                            <Grid xs={12}>
                                <FormInputRadio
                                    onChangeFn={getToggleButtonData}
                                    list={coverToggleObj}
                                    label="PA Cleaner "
                                    name="IsPACleaner"
                                    control={control}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {optionalDetails.IsPACleaner == 'true' && (
                        <Grid xs={12} md={3}>
                            <div id="divPACleaner">
                                <FormControl fullWidth>
                                    <FormInputSelect
                                        control={control}
                                        name="PACleanerCount"
                                        onChangeFn={handleOptionalChange}
                                        label="PA Cleaner Count"
                                        LIST={LLOT_PaidDriver}
                                        TEXT=""
                                        VALUE=""
                                        className="requiredField"
                                    />
                                </FormControl>
                            </div>
                        </Grid>
                    )}
                    {policyData.PolicyDetails.VehClass == 'C' && (
                        <Grid xs={3} md={3}>
                            <Grid xs={12}>
                                <FormInputRadio
                                    onChangeFn={getToggleButtonData}
                                    list={coverToggleObj}
                                    label="PA Conductor"
                                    name="IsPAConductor"
                                    control={control}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {optionalDetails.IsPAConductor == 'true' && (
                        <Grid xs={12} md={3}>
                            <div id="divPAConductor">
                                <FormControl fullWidth>
                                    <FormInputSelect
                                        control={control}
                                        name="PAConductorCount"
                                        onChangeFn={handleOptionalChange}
                                        label="PA Conductor Count"
                                        LIST={LLOT_PaidDriver}
                                        TEXT=""
                                        VALUE=""
                                        className="requiredField"
                                    />
                                </FormControl>
                            </div>
                        </Grid>
                    )}
                    {policyData.PolicyDetails.VehClass == 'C' && (
                        <Grid xs={3} md={3}>
                            <Grid xs={12}>
                                <FormInputRadio
                                    onChangeFn={getToggleButtonData}
                                    list={coverToggleObj}
                                    label="PA Helper "
                                    name="IsPAHelper"
                                    control={control}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {optionalDetails.IsPAHelper == 'true' && (
                        <Grid xs={12} md={3}>
                            <div id="divPAHelper">
                                <FormControl fullWidth>
                                    <FormInputSelect
                                        control={control}
                                        name="PAHelperCount"
                                        onChangeFn={handleOptionalChange}
                                        label="PA Helper Count"
                                        LIST={LLOT_PaidDriver}
                                        TEXT=""
                                        VALUE=""
                                        className="requiredField"
                                    />
                                </FormControl>
                            </div>
                        </Grid>
                    )}
                    {policyData.PolicyDetails.VehClass == 'C' && (
                        <Grid xs={3} md={3}>
                            <Grid xs={12}>
                                <FormInputRadio
                                    onChangeFn={getToggleButtonData}
                                    list={coverToggleObj}
                                    label="LL Cleaner "
                                    name="IsLLCleaner"
                                    control={control}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {optionalDetails.IsLLCleaner == 'true' && (
                        <Grid xs={12} md={3}>
                            <div id="divLLCleaner">
                                <FormControl fullWidth>
                                    <FormInputSelect
                                        control={control}
                                        name="LLCleanerCount"
                                        onChangeFn={handleOptionalChange}
                                        label="LL Cleaner Count"
                                        LIST={LLOT_PaidDriver}
                                        TEXT=""
                                        VALUE=""
                                        className="requiredField"
                                    />
                                </FormControl>
                            </div>
                        </Grid>
                    )}
                    {policyData.PolicyDetails.VehClass == 'C' && (
                        <Grid xs={3} md={3}>
                            <Grid xs={12}>
                                <FormInputRadio
                                    onChangeFn={getToggleButtonData}
                                    list={coverToggleObj}
                                    label="LL Conductor "
                                    name="IsLLConductor"
                                    control={control}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {optionalDetails.IsLLConductor == 'true' && (
                        <Grid xs={12} md={3}>
                            <div id="divLLConductor">
                                <FormControl fullWidth>
                                    <FormInputSelect
                                        control={control}
                                        name="LLConductorCount"
                                        onChangeFn={handleOptionalChange}
                                        label="LL Conductor Count"
                                        LIST={LLOT_PaidDriver}
                                        TEXT=""
                                        VALUE=""
                                        className="requiredField"
                                    />
                                </FormControl>
                            </div>
                        </Grid>
                    )}
                    {policyData.PolicyDetails.VehClass == 'C' && (
                        <Grid xs={3} md={3}>
                            <Grid xs={12}>
                                <FormInputRadio
                                    onChangeFn={getToggleButtonData}
                                    list={coverToggleObj}
                                    label="LL Helper "
                                    name="IsLLHelper"
                                    control={control}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {optionalDetails.IsLLHelper == 'true' && (
                        <Grid xs={12} md={3}>
                            <div id="divLLHelper">
                                <FormControl fullWidth>
                                    <FormInputSelect
                                        control={control}
                                        name="LLHelperCount"
                                        onChangeFn={handleOptionalChange}
                                        label="LL Helper Count"
                                        LIST={LLOT_PaidDriver}
                                        TEXT=""
                                        VALUE=""
                                        className="requiredField"
                                    />
                                </FormControl>
                            </div>
                        </Grid>
                    )}
                    {vehicleData.VehicleType != 'PCV' && vehicleData.VehicleType != 'MISC-D' &&
                        policyData.PolicyDetails.VehClass == 'C' && (
                            <Grid xs={3} md={3}>
                                <Grid xs={12}>
                                    <FormInputRadio
                                        onChangeFn={getToggleButtonData}
                                        list={coverToggleObj}
                                        label="LL NFPP "
                                        name="IsLLNFPP"
                                        control={control}
                                    />
                                </Grid>
                            </Grid>
                        )}

                    {optionalDetails.IsLLNFPP == 'true' && (
                        <Grid xs={12} md={3}>
                            <div id="divLLNFPP">
                                <FormControl fullWidth>
                                    <FormInputSelect
                                        control={control}
                                        name="LLNFPPCount"
                                        onChangeFn={handleOptionalChange}
                                        label="LL NFPP Count"
                                        LIST={LLOT_PaidDriver}
                                        TEXT=""
                                        VALUE=""
                                        className="requiredField"
                                    />
                                </FormControl>
                            </div>
                        </Grid>
                    )}
                    {vehicleData.VehicleType != 'GCV' && vehicleData.VehicleType != 'PCP'  &&
                        policyData.PolicyDetails.VehClass == 'C' && (
                            <Grid xs={3} md={3}>
                                <Grid xs={12}>
                                    <FormInputRadio
                                        onChangeFn={getToggleButtonData}
                                        list={coverToggleObj}
                                        label="IMT 34"
                                        name="IMT34"
                                        control={control}
                                    />
                                </Grid>
                            </Grid>
                        )}
                </>
            )
        } else jsx = <></>
        return [
            <>
                {((vehicleData.VehicleType == 'MISC-D' &&
                    policyData.PolicyDetails.VehClass == 'C' &&
                    !isSATP) ||
                    (policyData.Renew.RENEWAL_TYPE == '1' &&
                        vehicleData.VehicleType == 'MISC-D' &&
                        policyData.PolicyDetails.CoverTypeId == 0 &&
                        prevODTenure > 0)) && (
                        <Grid xs={3} md={3}>
                            <Grid xs={12}>
                                <FormInputRadio
                                    onChangeFn={getToggleButtonData}
                                    list={coverToggleObj}
                                    label="Overturn Cover"
                                    name="IsOverTurn"
                                    control={control}
                                />
                            </Grid>
                        </Grid>
                    )}
            </>,
            jsx
        ]
    }

    return conditionalRender()
}

export default CVAdditionalCovers
