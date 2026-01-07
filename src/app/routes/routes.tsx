import { Outlet, createHashRouter } from 'react-router-dom'
import Login from '../pages/LoginPage'
import DashBoard from '../pages/DashBoardPage'
import DealerMCQPage from '../pages/DealerMCQPage'

import PrivateRoute from '../components/private/privateComponent'
import AuthorizedRoute from '../pages/AuthorizedPage'
import LogOut from '../pages/LogOutPage'
import Policy from '../pages/PolicyCentre/Policy'

import Quotation from '../pages/Quotation/Quotation'
import Preview from '../pages/ProposalPreview/Preview'
import QuoteSearch from '../pages/QuoteListing/QuoteSearchComponent'
import ProposalPayment from '../pages/ProposalPayment/proposalPayment'

import KYC_StatusPage from '../pages/KYCStatus/kycStatusPage'
import PolicyPayment from '../pages/ProposalPayment/policyPayment'
import ProposerDetails from '../pages/PolicyCentre/ProposerDetails'

const basePath = '/'
import CustomerQuotation from '../pages/PolicyCentre/Quotation/CustomerQuotation'
import ChequeListSearch from '../pages/ChequeListing/chequeListSearch'
import SuccessPage from '../pages/StatusPages/successPage'
import FailedPage from '../pages/StatusPages/failedPage'
import CodeOfConduct from '../pages/CodeOfConduct'
import IcPreference from '../pages/Masters/IcPreference'
import ApprovalListSearch from '../pages/ApprovalListing/approvalSearch'
import CCApprovalListSearch from '../pages/CCApprovalListing/CCApprovalSearch'
import AVApprovalListSearch from '../pages/AVApprovalListing/AVApprovalSearch'
import CancelledProposal from '../pages/PolicyCentre/FetchCancelledProposal'
import { ThankYouPage } from '../pages/StatusPages/ThankYouPage'

export const routes = createHashRouter([
    {
        path: basePath,
        element: <Outlet />,
        children: [
            {
                path: basePath,
                element: <PrivateRoute Component={DashBoard}></PrivateRoute>
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'CustomerQuotation',
                element: <CustomerQuotation />
            },
            {
                path: 'dashboard',
                element: <PrivateRoute Component={DashBoard}></PrivateRoute>
            },
            {
                path: 'dealermcq',
                element: <PrivateRoute Component={DealerMCQPage}></PrivateRoute>
            },

            {
                path: 'authorized',
                element: <AuthorizedRoute />
            },
            {
                path: 'logout',
                element: <LogOut />
            },
            {
                path: 'createPolicy',
                element: <PrivateRoute Component={Policy}></PrivateRoute>
                //element: <Policy />
            },
            {
                path: 'Quotation',
                element: <PrivateRoute Component={Quotation}></PrivateRoute>
            },
            {
                path: 'ProposerDetails',
                element: (
                    <PrivateRoute Component={ProposerDetails}></PrivateRoute>
                )
            },

            {
                path: 'Preview',
                element: <PrivateRoute Component={Preview}></PrivateRoute>
            },
            {
                path: 'QuoteListing',
                element: <PrivateRoute Component={QuoteSearch}></PrivateRoute>
            },
            {
                path: 'ProposalPayment',
                element: (
                    <PrivateRoute Component={ProposalPayment}></PrivateRoute>
                )
            },
            {
                path: 'KycStatus',
                element: (
                    <PrivateRoute Component={KYC_StatusPage}></PrivateRoute>
                )
            },
            {
                path: 'policyPayment',
                element: <PrivateRoute Component={PolicyPayment}></PrivateRoute>
            },
            {
                path: 'ChequeStatus',
                element: (
                    <PrivateRoute Component={ChequeListSearch}></PrivateRoute>
                )
            },
            {
                path: 'Success',
                //element: <PrivateRoute Component={SuccessPage}></PrivateRoute>
                element: <ThankYouPage />
            },
            {
                path: 'Failed',
                element: <PrivateRoute Component={FailedPage}></PrivateRoute>
            },
            {
                path: 'COC',
                element: <PrivateRoute Component={CodeOfConduct}></PrivateRoute>
            },
            {
                path: 'HOApproval',
                element: (
                    <PrivateRoute Component={ApprovalListSearch}></PrivateRoute>
                )
            },
            {
                path: 'CCApproval',
                element: (
                    <PrivateRoute
                        Component={CCApprovalListSearch}
                    ></PrivateRoute>
                )
            },
            {
                path: 'AVApproval',
                element: (
                    <PrivateRoute
                        Component={AVApprovalListSearch}
                    ></PrivateRoute>
                )
            },
            {
                path: 'ProposalPreview/:Type',

                element: <Preview></Preview>
            },
            {
                path: 'fetchCancelledPropsal',
                element: (
                    <PrivateRoute Component={CancelledProposal}></PrivateRoute>
                )
            }
        ]
    }
])
