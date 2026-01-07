function BrokerDetailsPreview({ data }: any) {
    const [proposalDtls] = data['Table']
    const [brokerDtls] = data['Table9']
    return (
        <>
            <table
                border={0}
                cellPadding="0"
                cellSpacing="0"
                width="100%"
                className="VehicleDetail VehicleDetail1"
            >
                <tr>
                    <td width="33%" align="left" valign="middle">
                        <p>
                            <strong>Broker Code:</strong>{' '}
                            {brokerDtls['BROKER_CODE'].toString()}
                            <br />
                            <strong>CIN:</strong>{' '}
                            <span>{brokerDtls['CIN'].toString()}</span>
                        </p>
                        {/* <strong>GST:</strong>{' '}
                        <span> {brokerDtls['BROKER_GSTIN'].toString()} </span> */}
                        <p>
                            <strong>License No:</strong>{' '}
                            <span>
                                {' '}
                                {brokerDtls['IRDA_LIC_NO'].toString()}{' '}
                            </span>
                            <br></br>
                            <strong>Category:</strong>{' '}
                            <span> {brokerDtls['CATEGORY'].toString()} </span>
                            <br></br>
                            <strong>Validity:</strong>{' '}
                            <span>
                                {' '}
                                {brokerDtls['LICENSE_FROM'].toString()} to{' '}
                                {brokerDtls['LICENSE_TO'].toString()}{' '}
                            </span>
                        </p>
                    </td>
                    <td width="33%" align="left" valign="middle">
                        <p>
                            <strong>
                                MISP NAME:{' '}
                                {proposalDtls['MISP_NAME'].toString()}
                            </strong>
                            <br />
                            <strong>
                                MISP CODE:{' '}
                                {proposalDtls['MISP_CODE'].toString()}{' '}
                            </strong>
                            <br />
                            <strong>
                                MISP PAN:{' '}
                                {proposalDtls['MISP_PAN'].toString()}{' '}
                            </strong>
                        </p>
                        <strong>
                            {proposalDtls['MISP_NAME'].toString()!='' ? proposalDtls['AGENT_TYPE']=='SP'? 'Sales Person ':'Designated Person ' : 'POSP'}   :{' '}
                            {proposalDtls['AGENT_NAME'].toString()}{' '}
                        </strong>
                    </td>
                    <td align="left" valign="middle" className="p-0">
                        <table
                            width="100%"
                            border={0}
                            cellSpacing="0"
                            cellPadding="0"
                        >
                            <tbody>
                                <tr>
                                    <td align="left" className="bdrl0 bdrb0">
                                        <strong>
                                            Proposal Form Created by:
                                        </strong>
                                    </td>
                                    <td
                                        rowSpan={2}
                                        align="right"
                                        className="bdrl0 bdrb0"
                                    ></td>
                                </tr>
                                <tr>
                                    <td align="right" className="bdrl0 bdrb0">
                                        <p>&nbsp;</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        colSpan={2}
                                        align="right"
                                        valign="top"
                                        className="bdrl0 bdrb0"
                                    >
                                        <strong>
                                            MISP Authorised Signatory
                                        </strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </table>
        </>
    )
}

export default BrokerDetailsPreview
