import {
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks/reduxHooks'
import { AuthModel } from '../../redux/features/auth/authInterface'
import { rejectApproveChq } from '../../services/policyServices/paymentService'
import { createSearchParams, useNavigate } from 'react-router-dom'
import ConfirmDialog from '../common/confirmDialog'
import { getBase64 } from '../../services/common/commonService'
import { BaseWorkAreaPath } from '../../constants/baseURL'
import common from '../../utils/common'

function ChequeApprovalSection({ data }: any) {
    const navigate = useNavigate()
    const [chequeDtls] = data['Table12']
    const [proposalDtls] = data['Table']
    const onConfirmDialogClose = (
        action: boolean,
        dataKYC: IC_KYC_Response | null
    ) => {
        setDialog({ ...dialog, ['open']: false })
        navigate('/ChequeStatus')
    }

    const [dialog, setDialog] = useState({
        open: false,
        content: '',
        title: '',
        data: {},
        onClose: onConfirmDialogClose,
        dialogType: 'confirm'
    })

    const loginSelector = useAppSelector<AuthModel>(
        (state: any) => state.auth.loginData
    )

    useEffect(() => {
        setRemarks(chequeDtls['QC_REMARKS'].toString())
    }, [data])

    const [chequeApprove, setChequeApprove] = useState('1')
    const [remarks, setRemarks] = useState('')

    function downloadPDF(pdf: any, path: string) 
    {
        var extension=path.substring(path.lastIndexOf('.')+1);
       
        if (path.indexOf('.pdf') > -1) {
            var byteCharacters = atob(pdf)
            var byteNumbers = new Array(byteCharacters.length)
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            var byteArray = new Uint8Array(byteNumbers)
            var file = new Blob([byteArray], { type: 'application/pdf;base64' })
            var fileURL = URL.createObjectURL(file)

            window.open(fileURL);
        }
        else if((extension.toUpperCase()=="PNG") ||(extension.toUpperCase()=="JPEG")
            || (extension.toUpperCase()=="JPG"))
        {
            var image = new Image()
            image.src = 'data:image/jpg;base64,' + pdf

            var w = window.open('')
            w.document.write(image.outerHTML)
        }
        else if((extension.toUpperCase()=="DOCX"))
        {
           var byteCharacters = atob(pdf); // docxBase64 should be the base64 string of your DOCX file
                var byteNumbers = new Array(byteCharacters.length);
                for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);

                // Note the change in MIME type to 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                var file = new Blob([byteArray], {
                    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                });

                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
        }
        
        else if (path != '') {
            var fileURL = URL.createObjectURL(file)

            window.open(fileURL)
        } 
        // const linkSource = `data:application/pdf;base64,${pdf}`
        // const downloadLink = document.createElement('a')
        // const fileName = 'Cheque_' + loginSelector.DealerCode + '.pdf'

        // window.open(linkSource)

        // downloadLink.href = linkSource
        // downloadLink.download = fileName
        // downloadLink.click()
    }

    const [showRemark, setshowRemark] = useState(false)
    const ApproveRejectChequeQC = async () => {
        let chequeObj = {
            IsApprove: parseInt(chequeApprove),
            ProposalID: proposalDtls['PROPOSAL_ID'],
            ProductID: proposalDtls['PRODUCT_ID'],
            UserID: loginSelector.UserId,
            Remarks: remarks,
            HOSTIP: '',
            ICServiceEnabled: proposalDtls['ISPROPOSALSRVACTIVE'],
            ConsentType: 0
        }
        if (proposalDtls['MandateStatus'] == 1) {
            chequeObj.ConsentType = 2
        } else {
            chequeObj.ConsentType = 1
        }

        if (chequeObj.IsApprove == 2 && chequeObj.Remarks == '') {
            setshowRemark(true)
            return
        }

        let status = await rejectApproveChq(chequeObj)
        if (status.status == 200) {
            if (status.data['ErrorCode'] == 1) {
                setDialog({
                    ...dialog,
                    ['open']: true,
                    ['title']: 'Success',
                    ['content']: status.data['ErrorMessage'],
                    data: null,
                    dialogType: 'alert'
                })
            } else if (status.data['ErrorCode'] == -1) {
                setDialog({
                    ...dialog,
                    ['open']: true,
                    ['title']: 'Success',
                    ['content']: common.isNotNullOrEmpty(
                        status.data['ErrorMessage']
                    )
                        ? status.data['ErrorMessage']
                        : 'Cheque Approved Successfully.',
                    data: null,
                    dialogType: 'alert'
                })
            }
        } else {
            setDialog({
                ...dialog,
                ['open']: true,
                ['title']: 'Error',
                ['content']: 'Error In Service.',
                data: null,
                dialogType: 'alert'
            })
        }
    }

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChequeApprove(e.target.value)
        setshowRemark(false)
    }

    const openChequeFile = async (path) => {
        let file = ''
        let folder = path
        if (path.includes(BaseWorkAreaPath)) {
            path = path.replace(BaseWorkAreaPath, '')

            file = path.split('\\')[path.split('\\').length - 1]
            folder = path.replace(file, '')
        }

        let obj = {
            Folder: folder,
            File: file
        }

        let result = await getBase64(obj)
        if (result.ErrorCode == 0) {
            setDialog({
                ...dialog,
                ['open']: true,
                ['title']: 'Error',
                ['content']: result.ErrorMessage,
                data: null,
                dialogType: 'alert'
            })
            return
        }

        downloadPDF(result.ErrorMessage, path)
    }

    return (
        <>
            <ConfirmDialog {...dialog} />
            <Stack alignItems={'center'} pt={4} pb={4}>
                <table
                    border={0}
                    cellPadding="0"
                    cellSpacing="0"
                    width="100%"
                    style={{ marginTop: '10px' }}
                    className="premiumCalc premiumCalc1 VehicleDetail1"
                >
                    <tbody>
                        <tr>
                            <td
                                colSpan={4}
                                width="34%"
                                align="left"
                                valign="middle"
                                color="#ddd"
                            >
                                <p>
                                    {' '}
                                    <strong>Cheque Details</strong>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Cheque No.:</strong>
                            </td>
                            <td>
                                <p className="text-right">
                                    <span id="lblVehicle2">
                                        <span>
                                            {chequeDtls['CHEQUE_NO'].toString()}
                                        </span>
                                    </span>
                                </p>
                            </td>
                            <td>
                                <strong>Cheque Date:</strong>
                            </td>
                            <td>
                                <p className="text-right">
                                    <span>
                                        {chequeDtls['CHEQUE_DATE'].toString()}
                                    </span>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Bank Name:</strong>
                            </td>
                            <td>
                                <p className="text-right">
                                    <span id="lblVehicle2">
                                        <span>
                                            {chequeDtls['BANK_NAME'].toString()}
                                        </span>
                                    </span>
                                </p>
                            </td>
                            <td>
                                <strong>Bank City:</strong>
                            </td>
                            <td>
                                <p className="text-right">
                                    <span>
                                        {chequeDtls['CITY_NAME'].toString()}
                                    </span>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Account No.:</strong>
                            </td>
                            <td>
                                <p className="text-right">
                                    <span id="lblVehicle2">
                                        <span>
                                            {chequeDtls[
                                                'ACCOUNT_NO'
                                            ].toString()}
                                        </span>
                                    </span>
                                </p>
                            </td>
                            <td>
                                <strong>Upload Copy:</strong>
                            </td>
                            <td>
                                <p className="text-right">
                                    <Button
                                        sx={{
                                            padding: '0px',
                                            minWidth: 'auto',
                                            textTransform: 'capitalize',
                                            textDecoration: 'underline'
                                        }}
                                        className="mt-2"
                                        onClick={() => {
                                            openChequeFile(
                                                chequeDtls[
                                                    'CHEQUE_UPLD_PATH'
                                                ].toString()
                                            )
                                        }}
                                    >
                                        View File
                                    </Button>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>HO Approval:</strong>
                            </td>
                            <td colSpan={3}>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        value={chequeApprove}
                                        name="radio-buttons-group"
                                        onChange={handleRadioChange}
                                    >
                                        <Stack spacing={2} direction={'row'}>
                                            <FormControlLabel
                                                value={'1'}
                                                control={<Radio />}
                                                label="Approve"
                                            />
                                            <FormControlLabel
                                                value={'2'}
                                                control={<Radio />}
                                                label="Reject"
                                            />
                                        </Stack>
                                    </RadioGroup>
                                </FormControl>
                            </td>
                        </tr>
                        {chequeApprove == 2 && (
                            <tr>
                                <td>
                                    <strong>Remarks:</strong>
                                </td>
                                <td colSpan={3}>
                                    <textarea
                                        id="txtRemarks"
                                        className="requiredField"
                                        style={{
                                            border: '1px solid',
                                            borderRadius: '5px'
                                        }}
                                        onChange={(e) => {
                                            setRemarks(e.target.value)
                                        }}
                                        value={remarks}
                                    />
                                    {showRemark && (
                                        <span className="text-red-600">
                                            &nbsp;Please Enter Remarks.
                                        </span>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Stack direction={'row'} spacing={6} pt={4}>
                    <Button variant="contained" onClick={ApproveRejectChequeQC}>
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            navigate('/ChequeStatus')
                        }}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </>
    )
}

export default ChequeApprovalSection
