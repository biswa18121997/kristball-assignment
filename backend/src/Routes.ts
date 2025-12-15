import type {Application} from 'express'
import VerifyLogin from "./middlewares/VerifyLogin.js";
import Login from "./controllers/Login.js";
import TokenVerifier from "./middlewares/TokenVerifier.js";
import IsUserAllowed from "./middlewares/IsUserAllowed.js";
import DashboardData from "./controllers/DashboardData.js";
import AssignAssetToPersonnel from "./controllers/AssignAssetToPersonnel.js";
import UpdateTrackingStatus from "./controllers/UpdateTrackingStatus.js";
import GetAllAssignments from "./controllers/GetAllAssignments.js";
import NewPurchase from "./controllers/NewPurchase.js";
import GetAllPurchases from "./controllers/GetAllPurchases.js";
import GetAllTransfers from "./controllers/GetAllTransfers.js";
import GetAuditLogs from "./controllers/GetAuditLogs.js";
import TransferAsset from "./controllers/TransferAsset.js";
import GetExpenditures from "./controllers/GetExpenditures.js";
import CreateExpenditure from "./controllers/CreateExpenditure.js";
//  System that will enable commanders and logistics personnel to manage the movement, 
// assignment and expenditure of critical assets (such as vehicles, weapons, and ammunition) across multiple bases.
//  The system must provide transparency, streamline logistics and ensure accountability, while offering a secure and role-based solution.
export default function Routes(app : Application){

    app.post('/login', VerifyLogin, Login);
    // app.post('/manage-movement', TokenVerifier);
    // app.post('/manage-assignment', TokenVerifier, IsUserAllowed, ManageAssignment);
    // app.post('/manage-expenditure', TokenVerifier, IsUserAllowed, ManageExpenditure);
    app.post('/update-tracking-status', TokenVerifier, IsUserAllowed, UpdateTrackingStatus);
    app.post('/dashboard', TokenVerifier, IsUserAllowed, DashboardData);
    // app.post('/track/assets',TokenVerifier, IsUserAllowed, TrackAssets);
    app.get('/purchases', TokenVerifier, IsUserAllowed, GetAllPurchases);
    app.post('/purchases', TokenVerifier, IsUserAllowed, NewPurchase);
    app.get('/transfers', TokenVerifier, IsUserAllowed, GetAllTransfers);
    app.post('/transfer-asset', TokenVerifier, IsUserAllowed, TransferAsset);
    app.get('/assignments', TokenVerifier, IsUserAllowed, GetAllAssignments);
    app.post('/assign-asset', TokenVerifier, IsUserAllowed, AssignAssetToPersonnel);
    app.get('/expenditures', TokenVerifier, IsUserAllowed, GetExpenditures);
    app.post('/expenditures', TokenVerifier, IsUserAllowed, CreateExpenditure);
    app.post('/audit-logs', TokenVerifier, IsUserAllowed, GetAuditLogs);
    //     Tracking of Opening Balances, Closing Balances, and Net Movements (Purchases + Transfers In - Transfers Out).
// Recording of asset assignments and expended.
// Transfers of assets between bases with a clear history of movements.


}