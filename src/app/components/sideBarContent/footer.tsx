import { BasePath } from '../../constants/baseURL'
import logo from '../../../Tata-Logo.png'
function Footer() {
    return (
        <>
            <footer className="footerSignature1">
                <div className="container-xl flex flex-col md:flex-row items-start justify-between">
                    <p
                        textAlign={'left'}
                        className="md:text-center text-center	w-full text-[8px]"
                    >
                        <img
                            src={logo}
                            style={{
                                width: '420px',
                                padding: '10px 0px 10px 0px',
                                display: 'inline'
                            }}
                        ></img>
                        <br />
                        Composite Broker License No. 375 I Validity 13/05/2023
                        to 12/05/2026 I CIN: U50300MH1997PLC149349 | IBAI
                        Membership No. 35375
                        | ISO/IEC 27001:2022 (ISMS) & ISO 9001:2015 (QMS) Certified organization
                        
                        <br />
                        Corp Office: 1st Floor AFL House, Lok Bharti complex,
                        Marol Maroshi Road, Andheri (East), Mumbai - 400 059.
                        Maharashtra. India.
                        <br />
                        Registered Office: Nanavati Mahalaya, 3rd floor,
                        Tamarind Lane, Homi Mody Street, Fort, Mumbai - 400 001.
                        Maharashtra. India.
                        <br />A sister Company of TATA AIA Life Insurance
                        Company Limited and TATA AIG General Insurance Company
                        Limited |{' '}
                        <a href="https://www.irdai.gov.in/" target="_blank">
                            IRDAI
                        </a>{' '}
                        |{' '}
                        <a href="https://ibai.org/" target="_blank">
                            IBAI
                        </a>
                    </p>
                    <div className="bg-light SignatureCompany px-4">
                        <span className="font-small">Powered By:</span>
                        <span className="flex">
                            <a
                                href="https://www.binarysemantics.com/"
                                target="_blank"
                            >
                                <img
                                    className="ml-3"
                                    width="70"
                                    src={BasePath + '/Images/Binary_logo.png'}
                                />
                            </a>
                            <a href="https://visof.in/" target="_blank">
                                <img
                                    className="ml-3"
                                    width="70"
                                    src={BasePath + '/Images/VisofLogo.png'}
                                />
                            </a>
                        </span>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
