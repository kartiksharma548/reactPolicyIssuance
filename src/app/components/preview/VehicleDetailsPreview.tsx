import { Checkbox, Typography } from '@mui/material'
import '../../../assets/styles/ProposalPreview.css'
import common from '../../utils/common'
import dayjs from 'dayjs'
import { Stack } from '@mui/material'
function VehicleDetailsPreview({ data, type, state, dispatch }: any) {
    const [proposalDtls] = data['Table']
    const [vehicleDtls] = data['Table6']
    const addOns = data['Table2']

    const isOldVehicle = proposalDtls?.IsValidVehicleAge === true
    return (
        <>
            <table
                border={0}
                cellPadding="0"
                cellSpacing="0"
                width="100%"
                className="premiumCalc"
            >
                <tbody>
                    <tr>
                        <td align="center" valign="middle">
                            <strong>Vehicle Details</strong>
                        </td>
                    </tr>
                    <tr>
                        <td className="p-0">
                            <table
                                border={0}
                                cellPadding="0"
                                cellSpacing="0"
                                width="100%"
                                className="VehicleDetail1"
                            >
                                <tbody>
                                    <tr
                                        style={{
                                            backgroundColor: '#ddd'
                                        }}
                                    >
                                        <td
                                            width="16%"
                                            align="center"
                                            valign="middle"
                                        >
                                            <strong>Make</strong>
                                        </td>
                                        <td
                                            width="18%"
                                            align="center"
                                            valign="middle"
                                        >
                                            <strong>Model</strong>
                                        </td>
                                        <td
                                            width="22%"
                                            align="center"
                                            valign="middle"
                                        >
                                            <strong>Sub Model</strong>
                                        </td>

                                        {proposalDtls['IS_ELECTRIC'] == '1' ? (
                                            <td
                                                width="22%"
                                                align="center"
                                                valign="middle"
                                            >
                                                <strong>Kilo Watt</strong>
                                            </td>
                                        ) : (
                                            <td
                                                width="22%"
                                                align="center"
                                                valign="middle"
                                            >
                                                <strong>Cubic Capacity</strong>
                                            </td>
                                        )}

                                        <td
                                            width="22%"
                                            align="center"
                                            valign="middle"
                                        >
                                            <strong>Manufacturing Year</strong>
                                        </td>
                                        <td
                                            width="22%"
                                            align="center"
                                            valign="middle"
                                        >
                                            <strong>Seating Capacity</strong>
                                        </td>
                                          <td align="center" valign="middle">
                                            <strong>VIN (Chassis No)</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" valign="middle">
                                            <span>
                                                {proposalDtls['MAKE_NAME']}
                                            </span>
                                        </td>
                                        <td align="center" valign="middle">
                                            <span>
                                                {proposalDtls['MODEL_CODE']}
                                            </span>
                                        </td>
                                        <td align="center" valign="middle">
                                            <span>
                                                {proposalDtls[
                                                    'VARIANT_CODE'
                                                ].toUpperCase()}
                                            </span>
                                        </td>

                                        {proposalDtls[
                                            'IS_ELECTRIC'
                                        ].toString() == '1' ? (
                                            <td align="center" valign="middle">
                                                <span>
                                                    {' '}
                                                    {proposalDtls['KILOWATT']}
                                                </span>
                                            </td>
                                        ) : (
                                            <td align="center" valign="middle">
                                                <span>
                                                    {' '}
                                                    {
                                                        proposalDtls[
                                                            'CUBIC_CAPACITY'
                                                        ]
                                                    }
                                                </span>
                                            </td>
                                        )}

                                        <td align="center" valign="middle">
                                            <span>
                                                {proposalDtls['MFG_YEAR']}
                                            </span>
                                        </td>
                                        <td align="center" valign="middle">
                                            <span>
                                                {' '}
                                                {
                                                    proposalDtls[
                                                        'SEATING_CAPACITY'
                                                    ]
                                                }
                                            </span>
                                        </td>
                                        <td align="center" valign="middle">
                                            <span>
                                                {' '}
                                                {proposalDtls['CHASSIS_NO']
                                                    .toString()
                                                    .toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr
                                        style={{
                                            backgroundColor: '#ddd'
                                        }}
                                    >
                                        {/* {proposalDtls['POLICY_TYPE'] == 'N' ? (
                                            <td align="center" valign="middle">
                                                <strong>Invoice Date</strong>
                                            </td>
                                        ) : (
                                            <td align="center" valign="middle">
                                                <strong>
                                                    Registration Date
                                                </strong>
                                            </td>
                                        )} */}
                                        <td align="center" valign="middle">
                                                <strong>Invoice Date</strong>
                                            </td>
<td align="center" valign="middle">
                                                <strong>
                                                    Registration Date
                                                </strong>
                                            </td>
                                        <td align="center" valign="middle">
                                            <strong>Registration No.</strong>
                                        </td>
                                        <td align="center" valign="middle">
                                            <strong>RTO</strong>
                                        </td>
                                        <td align="center" valign="middle">
                                            <strong>
                                                Hypothecation/Lease*
                                            </strong>
                                        </td>
                                        <td align="center" valign="middle">
                                            <strong>Engine No.</strong>
                                        </td>
                                      <td align="center" valign="middle">                                        
                                             <strong>
                                                {isOldVehicle ? "Invoice Value/Previous IDV" : 'Invoice Value'}
                                            </strong>
                                        </td>
                                    </tr>

                                    <tr>
                                        {/* {proposalDtls[
                                            'POLICY_TYPE'
                                        ].toString() == 'N' ? (
                                            <td align="center" valign="middle">
                                                <span>
                                                    {' '}
                                                    {proposalDtls[
                                                        'INVOICE_DATE'
                                                    ]
                                                        .toString()
                                                        .toUpperCase()}
                                                </span>
                                            </td>
                                        ) : (
                                            <td align="center" valign="middle">
                                                <span>
                                                    {' '}
                                                    {proposalDtls[
                                                        'REGISTRATION_DATE_FORMATED'
                                                    ]
                                                        .toString()
                                                        .toUpperCase()}
                                                </span>
                                            </td>
                                        )} */}
 <td align="center" valign="middle">
                                                <span>
                                                    {' '}
                                                    {proposalDtls[
                                                        'INVOICE_DATE'
                                                    ]
                                                        .toString()
                                                        .toUpperCase()}
                                                </span>
                                            </td>
                                             <td align="center" valign="middle">
                                                <span>
                                                    {' '}
                                                    {proposalDtls[
                                                        'REGISTRATION_DATE_FORMATED'
                                                    ]
                                                        .toString()
                                                        .toUpperCase()}
                                                </span>
                                            </td>
                                        <td align="center" valign="middle">
                                            <span>
                                                {' '}
                                                {proposalDtls['VEH_REGIST_NO']
                                                    .toString()
                                                    .toUpperCase()}
                                            </span>
                                        </td>
                                        <td align="center" valign="middle">
                                            <span>
                                                {proposalDtls['RTO_NAME']
                                                    .toString()
                                                    .toUpperCase()}
                                            </span>
                                        </td>
                                        <td align="center" valign="middle">
                                            <span>
                                                {' '}
                                                {proposalDtls[
                                                    'AGGREMENT_TYPE_NAME'
                                                ]
                                                    .toString()
                                                    .toUpperCase()}{' '}
                                            </span>
                                        </td>
                                        <td align="center" valign="middle">
                                            <span>
                                                {proposalDtls['ENGINE_NO']
                                                    .toString()
                                                    .toUpperCase()}{' '}
                                            </span>
                                        </td>
                                        <td align="center" valign="middle">
                                            <span>
                                                {' '}
                                                {proposalDtls[
                                                    'EXSHOWROOM_PRICE'
                                                ].toString()}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr
                                        style={{
                                            backgroundColor: '#ddd'
                                        }}
                                    >
                                        
                                        <td align="center" valign="middle">
                                            <strong>Vehicle IDV</strong>
                                        </td>
                                        <td align="center" valign="middle">
                                            <strong>
                                                Elec. Accessories IDV
                                            </strong>
                                        </td>
                                        <td align="center" valign="middle">
                                            <strong>
                                                Non-Elec. Accessories IDV
                                            </strong>
                                        </td>
                                        <td align="center" valign="middle">
                                            <strong>Bi-Fuel Kit IDV</strong>
                                        </td>
                                        <td align="center" valign="middle">
                                            <strong>Total IDV</strong>
                                        </td>
                                          <td align="center" valign="middle">
                                            <strong>-</strong>
                                        </td>
                                          <td align="center" valign="middle">
                                            <strong>-</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        
                                        <td align="center" valign="middle">
                                            <span>
                                                {' '}
                                                {vehicleDtls[
                                                    'VEH_IDV'
                                                ].toString()}
                                            </span>
                                        </td>
                                        <td align="center" valign="middle">
                                            <span>
                                                {' '}
                                                {vehicleDtls[
                                                    'ELEC_ACC_IDV'
                                                ].toString()}
                                            </span>
                                        </td>
                                        <td align="center" valign="middle">
                                            <span>
                                                {' '}
                                                {vehicleDtls[
                                                    'NONELEC_ACC_IDV'
                                                ].toString()}
                                            </span>
                                        </td>
                                        <td align="center" valign="middle">
                                            <span>
                                                {vehicleDtls[
                                                    'BIFUELKIT_IDV'
                                                ].toString()}
                                            </span>
                                        </td>
                                        <td align="center" valign="middle">
                                            <span>
                                                {' '}
                                                {vehicleDtls[
                                                    'TOTAL_IDV'
                                                ].toString()}
                                            </span>
                                        </td>
                                          <td align="center" valign="middle">
                                            <strong>-</strong>
                                        </td>
                                          <td align="center" valign="middle">
                                            <strong>-</strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    {proposalDtls['AGGREMENT_TYPE'].toString() != '' &&
                        proposalDtls['AGGREMENT_TYPE'].toString() != '0' && (
                            <>
                                <tr>
                                    <td align="center" valign="middle">
                                        <strong>Other Details</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-0">
                                        <table
                                            border={0}
                                            cellPadding="0"
                                            cellSpacing="0"
                                            width="100%"
                                            className="VehicleDetail1"
                                        >
                                            <tbody>
                                                <tr
                                                    style={{
                                                        backgroundColor: '#ddd'
                                                    }}
                                                >
                                                    <td
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <strong>
                                                            HP/Lease/Hire Pur.
                                                            Agreement with
                                                        </strong>
                                                    </td>
                                                    <td
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <strong>
                                                            Branch/Office of
                                                            HP/Lease/Hire
                                                            Purchaser
                                                        </strong>
                                                    </td>
                                                    <td
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <strong>
                                                            Agreement Type
                                                        </strong>
                                                    </td>
                                                    <td
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <strong>
                                                            Loan
                                                            Account/Contract No.
                                                        </strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <span>
                                                            {' '}
                                                            {proposalDtls[
                                                                'FINANCER_NAME'
                                                            ].toString()}
                                                        </span>
                                                    </td>
                                                    <td
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <span>
                                                            {' '}
                                                            {proposalDtls[
                                                                'FIN_BRANCH'
                                                            ].toString()}
                                                            {'-'}
                                                            {proposalDtls[
                                                                'FIN_SUB_BRANCH'
                                                            ].toString()}
                                                        </span>
                                                    </td>
                                                    <td
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <span>
                                                            {proposalDtls[
                                                                'AGGREMENT_TYPE'
                                                            ].toString()}
                                                        </span>
                                                    </td>
                                                    <td
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <span>
                                                            {' '}
                                                            {proposalDtls[
                                                                'FIN_LOANACCOUNTNO'
                                                            ].toString()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </>
                        )}
                    <tr>
                        <td>
                            <p className="text-center">
                                {' '}
                                <strong>
                                    Schedule of Premium (Amount in ₹
                                </strong>
                                )
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table
                border={0}
                cellPadding="0"
                cellSpacing="0"
                width="100%"
                className="premiumCalc premiumCalc1 VehicleDetail1"
            >
                <tbody>
                    <tr>
                        <td
                            width="34%"
                            align="left"
                            valign="middle"
                            style={{
                                backgroundColor: '#ddd'
                            }}
                        >
                            <p>
                                {' '}
                                <strong>Own Damage Premium (A)</strong>
                            </p>
                        </td>
                        <td
                            width="14%"
                            className="text-right"
                            valign="middle"
                            style={{
                                backgroundColor: '#ddd'
                            }}
                        >
                            <strong>Amount</strong>
                        </td>
                        <td
                            width="40%"
                            style={{
                                backgroundColor: '#ddd'
                            }}
                        >
                            <p>
                                {' '}
                                <strong>Liability Premium (B)</strong>
                            </p>
                        </td>
                        <td
                            width="12%"
                            className="text-right"
                            valign="middle"
                            style={{
                                backgroundColor: '#ddd'
                            }}
                        >
                            <strong>Amount</strong>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-center" colSpan={2}>
                            <strong>Basic Own Damage Premium</strong>
                        </td>

                        <td>
                            <p>Basic Third Party Liability</p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span id="lblBasicThirdPartyLiability">
                                    <p className="text-right">
                                        {vehicleDtls['TPPD_LIAB_PREM']}
                                    </p>
                                </span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Vehicle</p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span>{vehicleDtls['BASIC_PREM_VEHICLE']}</span>
                            </p>
                        </td>
                        <td>
                            <p>Bi-Fuel Kit</p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span>{vehicleDtls['BIFUEL_TP_PREMIUM']}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Non-Elec. Accessories (IMT-24)</p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span>
                                    {vehicleDtls['BASIC_PREM_NONELECT_ACC']}
                                </span>
                            </p>
                        </td>
                        <td>
                            <p>Geographical Area Extension (IMT-1)</p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span>
                                    {vehicleDtls['GEOAREAEXT_TP_PREMIUM']}
                                </span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Elec. Accessories (IMT-24)</p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span>
                                    {vehicleDtls[
                                        'BASIC_PREM_ELECT_ACC'
                                    ].toString()}
                                </span>
                            </p>
                        </td>

                        <td>{`IMT-34 TP Premium`} </td>
                        <td>
                            <p className="text-right">
                                {vehicleDtls['IMT34PREMIUM_TP']}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>
                            <p>
                                <strong>
                                    Sub Total (Third Party Liability Premium)
                                </strong>
                            </p>
                        </td>
                        <td>
                            <p className="text-right">
                                <strong>
                                    {vehicleDtls['TOTAL_TPL'].toString()}
                                </strong>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Bi-Fuel Kit (IMT-25)</p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span>
                                    {vehicleDtls[
                                        'BIFUELKIT_PREMIUM'
                                    ].toString()}
                                </span>
                            </p>
                        </td>
                        <td colSpan={2} className="text-center">
                            <p>
                                <strong>Personal Accident (PA) Cover</strong>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <strong>Sub Total (Basic Premium)</strong>
                        </td>
                        <td>
                            <p className="text-right">
                                <span id="lblVehicle2">
                                    <strong>
                                        {vehicleDtls[
                                            'BASIC_PREM_TOTAL'
                                        ].toString()}
                                    </strong>
                                </span>
                            </p>
                        </td>
                        <td>
                            Compulsory PA Cover for Owner Driver ₹
                            {vehicleDtls[
                                'PA_OWNER_DRIVER_COVER_AMT'
                            ].toString()}{' '}
                            (IMT-15)
                        </td>
                        <td>
                            <p className="text-right">
                                <p className="text-right">
                                    <span>
                                        {vehicleDtls[
                                            'PA_OWNER_DRIVER'
                                        ].toString()}
                                    </span>
                                </p>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>Geographical Area Extension (IMT-1)</td>
                        <td>
                            <p className="text-right">
                                <span>
                                    {vehicleDtls[
                                        'PREM_GEOGRAPH_EXT'
                                    ].toString()}
                                </span>
                            </p>
                        </td>
                        <td>
                            PA Cover for (
                            {vehicleDtls['UNNAMED_PER_COUNT'].toString()})
                            Unnamed Passengers ₹
                            {vehicleDtls['COVER_AMOUNT'].toString()} Each
                            (IMT-16)
                        </td>
                        <td>
                            <p className="text-right">
                                <span>
                                    {vehicleDtls[
                                        'PA_UNNAMED_PERSON'
                                    ].toString()}
                                </span>
                            </p>
                        </td>
                    </tr>
                    {proposalDtls['OEM_ID'] == 2 && (
                        <>
                            <tr>
                                <td>IMT 34 Premium</td>
                                <td>
                                    <p className="text-right">
                                        {vehicleDtls['IMT34_PREMIUM']}
                                    </p>
                                </td>
                                <td>
                                    {`PA Conductor(${vehicleDtls['PACONDUCTOR_COUNT']})/Cleaner(${vehicleDtls['PACLEANER_COUNT']})/Helper(${vehicleDtls['PAHELPER_COUNT']})`}{' '}
                                </td>
                                <td>
                                    <p className="text-right">
                                        {vehicleDtls['PA_CONDUCTOR'] +
                                            vehicleDtls['PA_CLEANER'] +
                                            vehicleDtls['PA_HELPER']}
                                    </p>
                                </td>
                            </tr>
                        </>
                    )}

                    <tr>
                        <td>
                            <p>IMT 23 Premium</p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span>
                                    {vehicleDtls['IMT23PREMIUM'].toString()}
                                </span>
                            </p>
                        </td>
                        <td>
                            <p>
                                PA Cover for Paid Driver ₹
                                {vehicleDtls['COVER_AMOUNT'].toString()}{' '}
                                (IMT-17)
                            </p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span>
                                    {vehicleDtls['PA_PAID_DRIVER'].toString()}
                                </span>
                            </p>
                        </td>
                    </tr>

                    {/* <td>IMT 33 Premium</td>
                        <td>
                            <p className="text-right">
                                {vehicleDtls['IMT33PREMIUM']}
                            </p>
                        </td> */}

                    {proposalDtls['OEM_ID'] == 2 && (
                        <>
                            <tr>
                                <td>{`Trailer Premium`} </td>
                                <td>
                                    <p className="text-right">
                                        {vehicleDtls['TRAILER_PREMIUM']}
                                    </p>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Overturn Premium</td>
                                <td>
                                    <p className="text-right">
                                        {vehicleDtls['OverTurn_PREMIUM']}
                                    </p>
                                </td>
                            </tr>
                        </>
                    )}

                    <tr>
                        <td>
                            <p>
                                <strong>Sub Total</strong>
                            </p>
                        </td>
                        <td>
                            <p className="text-right">
                                <strong>
                                    {vehicleDtls['SUB_TOTAL_PREM'].toString()}
                                </strong>
                            </p>
                        </td>
                        <td>
                            <p>
                                <strong>Sub Total PA Cover</strong>
                            </p>
                        </td>
                        <td>
                            <p className="text-right">
                                <strong id="">
                                    {vehicleDtls['TOTAL_PA'].toString()}
                                </strong>
                            </p>
                        </td>
                    </tr>
                    <tr className="text-center">
                        <td colSpan={2}>
                            <strong>Discounts/Deductibles</strong>
                        </td>

                        <td colSpan={2}>
                            <strong>Legal Liability</strong>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Voluntary Deductible (IMT-22A) (
                            {proposalDtls['VOLUNTARY_DISC'].toString()})
                        </td>
                        <td>
                            <p className="text-right">
                                <span id="">
                                    {vehicleDtls['DISC_VOLUNTRY'].toString()}
                                </span>
                            </p>
                        </td>
                        <td>Paid Driver (IMT-28)</td>
                        <td>
                            <p className="text-right">
                                <span id="">
                                    {vehicleDtls[
                                        'LLIAB_PAID_DRIVER'
                                    ].toString()}
                                </span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>Anti-Theft Device (IMT-10)</td>
                        <td className="text-right">
                            <span>
                                {vehicleDtls['DISC_ANTITHEFT'].toString()}
                            </span>
                        </td>
                        <td>
                            Employees (for{' '}
                            {vehicleDtls['OTHER_EMP_COUNT'].toString()} persons)
                            (IMT-29)
                        </td>
                        <td>
                            <p className="text-right">
                                <span>
                                    {vehicleDtls['LLIAB_EMPLOYEE'].toString()}
                                </span>
                            </p>
                        </td>
                    </tr>

                    {proposalDtls['OEM_ID'] == 2 && (
                        <>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>
                                    {`Legal Liability Conductor(${vehicleDtls['LLCONDUCTOR_COUNT']})/Cleaner(${vehicleDtls['LLCLEANER_COUNT']})/Helper(${vehicleDtls['LLHELPER_COUNT']})`}{' '}
                                </td>
                                <td>
                                    <p className="text-right">
                                        {vehicleDtls['LL_CONDUCTOR'] +
                                            vehicleDtls['LL_CLEANER'] +
                                            vehicleDtls['LL_HELPER']}
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>
                                    {`Legal Liability NFPP(${vehicleDtls['LLNFPP_COUNT']})`}{' '}
                                </td>
                                <td>
                                    <p className="text-right">
                                        {vehicleDtls['LL_NFPP']}
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>{`Trailer TP Premium`} </td>
                                <td>
                                    <p className="text-right">
                                        {vehicleDtls['TRAILER_TP_PREMIUM']}
                                    </p>
                                </td>
                            </tr>
                        </>
                    )}

                    <tr>
                        <td>
                            <p>AA Membership (IMT-8)</p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span>
                                    {vehicleDtls['DISC_AA_MEMB'].toString()}
                                </span>
                            </p>
                        </td>
                        <td>
                            <p>
                                <strong>Sub Total (Legal Liability)</strong>
                            </p>
                        </td>
                        <td>
                            <p className="text-right">
                                <strong>
                                    <span>
                                        {vehicleDtls['TOTAL_LLIAB'].toString()}
                                    </span>
                                </strong>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                No Claim Bonus – (
                                {proposalDtls['NCB_SLAB_PER'].toString()}%)
                            </p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span>
                                    {vehicleDtls['DISC_NCB_VALUE'].toString()}
                                </span>
                            </p>
                        </td>
                        <td align="left" valign="top">
                            <p>
                                <strong>Net liability Premium (B)</strong>
                            </p>
                        </td>
                        <td className="text-right" valign="middle">
                            <span>
                                <strong>
                                    {vehicleDtls['NET_LIAB_PREM_B'].toString()}
                                </strong>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Handicapped Discount (IMT-12)</p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span>
                                    {vehicleDtls[
                                        'HANDICAPPEDDISC_AMT'
                                    ].toString()}
                                </span>
                            </p>
                        </td>
                        <td>
                            <p>
                                <strong>Total Premium (A+B)</strong>
                            </p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span>
                                    <strong>
                                        {vehicleDtls[
                                            'TOTAL_PREM_A_B'
                                        ].toString()}
                                    </strong>
                                </span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                <strong>
                                    Sub Total (Discounts/Deductibles)
                                </strong>
                            </p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span id="">
                                    <strong>
                                        {vehicleDtls['DISC_TOTAL'].toString()}
                                    </strong>
                                </span>
                            </p>
                        </td>

                        {parseInt(vehicleDtls['GSTTYPE'].toString()) == 1 &&
                        parseInt(vehicleDtls['IGST_AMT'].toString()) > 0 ? (
                            <>
                                <td>
                                    <p>
                                        <strong>
                                            {proposalDtls.VEHICLE_TYPE ==
                                            'GCV' ? (
                                                <>
                                                    IGST (
                                                    {vehicleDtls[
                                                        'IGST_TP_PER'
                                                    ].toString()}
                                                    % of Basic TP +
                                                    {vehicleDtls[
                                                        'IGST_PER'
                                                    ].toString()}
                                                    % of rest of Premium)
                                                </>
                                            ) : (
                                                <>
                                                    IGST (
                                                    {vehicleDtls[
                                                        'IGST_PER'
                                                    ].toString()}
                                                    %)
                                                </>
                                            )}
                                        </strong>
                                    </p>
                                </td>
                                <td>
                                    <p className="text-right">
                                        <strong>
                                            <span>
                                                {vehicleDtls[
                                                    'IGST_AMT'
                                                ].toString()}
                                            </span>
                                        </strong>
                                    </p>
                                </td>
                            </>
                        ) : (
                            <>
                                <td>
                                    <p>
                                        <strong>
                                            {proposalDtls.VEHICLE_TYPE ==
                                            'GCV' ? (
                                                <>
                                                    CGST (
                                                    {vehicleDtls[
                                                        'CGST_TP_PER'
                                                    ].toString()}
                                                    % of Basic TP +
                                                    {vehicleDtls[
                                                        'CGST_PER'
                                                    ].toString()}
                                                    % of rest of Premium)
                                                </>
                                            ) : (
                                                <>
                                                    CGST (
                                                    {vehicleDtls[
                                                        'CGST_PER'
                                                    ].toString()}
                                                    %)
                                                </>
                                            )}
                                        </strong>
                                    </p>
                                </td>
                                <td>
                                    <p className="text-right">
                                        <strong>
                                            <span>
                                                {vehicleDtls[
                                                    'CGST_AMT'
                                                ].toString()}
                                            </span>
                                        </strong>
                                    </p>
                                </td>
                            </>
                        )}
                    </tr>
                    <tr>
                        <td>
                            <strong>Add-on Coverage</strong>
                        </td>
                        <td>
                            <p className="text-right">
                                <span id="">
                                    <strong>
                                        {vehicleDtls[
                                            'PREM_ADDON_PRODUCT'
                                        ].toString()}
                                    </strong>
                                </span>
                            </p>
                        </td>
                        {parseInt(vehicleDtls['GSTTYPE'].toString()) == 1 &&
                        parseInt(vehicleDtls['IGST_AMT'].toString()) > 0 ? (
                            <>
                                <td>
                                    <p>
                                        <strong></strong>
                                    </p>
                                </td>
                                <td>
                                    <p className="text-right">
                                        <span>
                                            <strong></strong>
                                        </span>
                                    </p>
                                </td>
                            </>
                        ) : parseInt(vehicleDtls['GSTTYPE'].toString()) == 3 &&
                          parseInt(vehicleDtls['SGST_AMT'].toString()) > 0 ? (
                            <>
                                <td>
                                    <p>
                                        <strong>
                                            UGST (
                                            {vehicleDtls['SGST_PER'].toString()}
                                            %)
                                        </strong>
                                    </p>
                                </td>
                                <td>
                                    <p className="text-right">
                                        <span>
                                            <strong>
                                                {vehicleDtls[
                                                    'SGST_AMT'
                                                ].toString()}
                                            </strong>
                                        </span>
                                    </p>
                                </td>
                            </>
                        ) : (
                            <>
                                <td>
                                    <p>
                                        <strong>
                                            {proposalDtls.VEHICLE_TYPE ==
                                            'GCV' ? (
                                                <>
                                                    SGST (
                                                    {vehicleDtls[
                                                        'SGST_TP_PER'
                                                    ].toString()}
                                                    % of Basic TP +
                                                    {vehicleDtls[
                                                        'SGST_PER'
                                                    ].toString()}
                                                    % of rest of Premium)
                                                </>
                                            ) : (
                                                <>
                                                    SGST (
                                                    {vehicleDtls[
                                                        'SGST_PER'
                                                    ].toString()}
                                                    %)
                                                </>
                                            )}
                                        </strong>
                                    </p>
                                </td>
                                <td>
                                    <p className="text-right">
                                        <span>
                                            <strong>
                                                {vehicleDtls[
                                                    'SGST_AMT'
                                                ].toString()}
                                            </strong>
                                        </span>
                                    </p>
                                </td>
                            </>
                        )}
                    </tr>
                    <tr>
                        <td>
                            <p>
                                <strong>Net Own Damage Premium (A)</strong>
                            </p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span id="">
                                    <strong>
                                        {vehicleDtls['NET_ODP_A'].toString()}
                                    </strong>
                                </span>
                            </p>
                        </td>
                        <td>
                            <p>
                                <strong>Gross Premium Paid</strong>
                            </p>
                        </td>
                        <td>
                            <p className="text-right">
                                <span>
                                    <strong>
                                        {vehicleDtls['GROSS_PREM'].toString()}
                                    </strong>
                                </span>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table
                width="100%"
                border={0}
                cellSpacing="0"
                cellPadding="0"
                className="NomnieeTable"
            >
                <tr>
                    <td
                        width="100"
                        colSpan={5}
                        align="left"
                        valign="middle"
                        className="bdrbottom bdrleft bdrright"
                    >
                        <strong>Add-on Cover Opted in the Policy: </strong>
                        <span>
                            {addOns != null &&
                                addOns.length > 0 &&
                                addOns
                                    .map((x) => {
                                        return x.ADDON_SRVCTYPE
                                    })
                                    .join(',')}
                        </span>
                        .
                    </td>
                </tr>
                {common.get_CheckEmptyString(type) != 'C' && (
                    <>
                        <tr>
                            <td
                                colSpan={5}
                                align="left"
                                valign="middle"
                                className="bdrbottom bdrleft bdrright"
                            >
                                <strong>
                                    SAC: 997134, Description of Service: Motor
                                    Vehicle Insurance Services, Place of Supply:{' '}
                                    {proposalDtls['SACSTATE_NAME'].toString()}{' '}
                                    (State Code:{' '}
                                    {proposalDtls[
                                        'SACGST_STATE_CODE'
                                    ].toString()}
                                    )
                                </strong>
                            </td>
                        </tr>

                        {/* <tr>
                            <td
                                colSpan={5}
                                align="left"
                                valign="middle"
                                className="p-0"
                            >
                                <table
                                    width="100%"
                                    border={0}
                                    cellSpacing="0"
                                    cellPadding="0"
                                >
                                    <tbody>
                                        <tr>
                                            <td>
                                                <span className="maintext">
                                                    <strong>
                                                        *Hypothecation Details:
                                                    </strong>{' '}
                                                    {proposalDtls[
                                                        'FINANCER_DETAILS'
                                                    ].toString()}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="maintext">
                                                    <strong>
                                                        Payment Mode:
                                                    </strong>
                                                    {proposalDtls[
                                                        'PAYMENT_MODE_CODE_NAME'
                                                    ].toString()}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr> */}
                    </>
                )}
            </table>
            {common.get_CheckEmptyString(type) != 'C' && (
                <>
                    <table
                        border={0}
                        cellPadding="0"
                        cellSpacing="0"
                        width="100%"
                        className="VehicleDetail VehicleDetail1"
                    >
                        <tr>
                            <td
                                height="0"
                                colSpan={2}
                                align="left"
                                valign="middle"
                            >
                                <p className="maintext">
                                    <strong>Declaration </strong>
                                    I/We hereby declare and state that the above
                                    statements made by me/ us are true and
                                    complete. No part of it is false. I/ we
                                    desire to effect an insurance as describe
                                    herein with{' '}
                                    <strong>
                                        {' '}
                                        {proposalDtls[
                                            'IC_COMPANY_NAME'
                                        ].toString()}
                                    </strong>
                                    and I/ we agree that this proposal and
                                    declarations shall be the basis of contract
                                    between me/ us and the{' '}
                                    <strong>
                                        {' '}
                                        {proposalDtls[
                                            'IC_COMPANY_NAME'
                                        ].toString()}
                                    </strong>{' '}
                                    . and I/ we agree to accept the policy
                                    subject to the condition specified by the
                                    Insurance Company. I/We agree to receive the
                                    policy document (without enclosing the terms
                                    and conditions of policy) from the company
                                    and authorise the company to display Terms
                                    and Conditions of the policy on its website
                                    that enables access by me. I hereby confirm
                                    that I have mandated to place my insurance
                                    cover and have read and agreed on the terms
                                    and conditions and also give my
                                    unconditional consent for receiving a call
                                    from TATA MOTORS INSURANCE BROKING AND
                                    ADVISORY SERVICES LTD or its affiliated
                                    entities on my number even if the number is
                                    enrolled under NDNC/DND registry
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td width={50}>
                                <p className="maintext">
                                    <strong>Date:</strong>{' '}
                                    {dayjs(new Date()).format('DD-MMM-YYYY')}
                                </p>
                            </td>
                            <td width={50}>
                                <p
                                    style={{ textAlign: 'right' }}
                                    className="maintext"
                                >
                                    <br />
                                    <strong>
                                        Proposer Signature/Thumb Impression
                                    </strong>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <p className="maintext">
                                    <strong>
                                        INSURANCE ACT 1938, SECTION 41-
                                        PROHIBITION OF REBATES
                                    </strong>
                                </p>
                                <p className="maintext">
                                    1.No person shall allow or offer to allow,
                                    either directly or indirectly, as an
                                    inducement to any person to take out or
                                    renew or continue an insurance in respect of
                                    any kind of risk relating to lives or
                                    property in India, any rebate of the whole
                                    or part of the commission payable or any
                                    rebate of the premium shown on the policy,
                                    nor shall any person taking out or renewing
                                    or continuing a policy accept any rebate,
                                    except such rebate as may be allowed in
                                    accordance with the published prospectuses
                                    or tables of the insurer.
                                </p>
                                <p className="maintext">
                                    2.Any person making default in complying
                                    with the provisions of this section shall be
                                    liable for a penalty which may extend to ten
                                    lakh rupees.
                                </p>
                            </td>
                        </tr>
                    </table>

                    <p className="maintext">
                        <Stack>
                            <label>
                                <Checkbox
                                    sx={{ padding: '3px' }}
                                    checked={state.termsCheck}
                                    onChange={() => {
                                        dispatch({
                                            type: 'setTermsCheck',
                                            value: !state.termsCheck
                                        })
                                    }}
                                    className="printableCheckBox"
                                />
                                I hereby agree to receive a one pager policy
                                document .
                            </label>

                            {/* As per client Request it has been commented out */}
                            {/* <label>
                                <Checkbox
                                    sx={{ padding: '3px' }}
                                    checked={state.termsCheck2}
                                    onChange={() => {
                                        dispatch({
                                            type: 'setTermsCheck2',
                                            value: !state.termsCheck2
                                        })
                                    }}
                                    className="printableCheckBox"
                                />
                                <span>
                                    I hereby confirm having a valid personal
                                    accident policy for sum Insured of minimum
                                    Rs.15 lakhs.
                                </span>
                            </label> */}
                            <label>
                                <Checkbox
                                    sx={{ padding: '3px' }}
                                    checked={state.termsCheck3}
                                    onChange={() => {
                                        dispatch({
                                            type: 'setTermsCheck3',
                                            value: !state.termsCheck3
                                        })
                                    }}
                                    className="printableCheckBox"
                                />
                                <span>
                                    I hereby confirm that I have mandated Tata
                                    Motors Insurance Broking And Advisory
                                    Services Ltd. to place my insurance risk and
                                    have read and agreed on the terms and
                                    conditions.
                                </span>
                            </label>
                        </Stack>
                    </p>
                </>
            )}
        </>
    )
}

export default VehicleDetailsPreview
