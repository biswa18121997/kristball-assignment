export default function IsUserAllowed(req, res, next) {
    try {
        const role = req.role; // ADMIN, BASE_COMMANDER, LOGISTICS_PERSONNEL
        const route = req.path.toLowerCase();
        // Role-based route access
        const ADMIN_ROUTES = [
            "/dashboard",
            "/track",
            "/purchases",
            "/transfers",
            "/transfer-asset",
            "/assignments",
            "/assign-asset",
            "/expenditures",
            "/audit-logs",
            "/manage-movement",
            "/manage-assignment",
            "/manage-expenditure",
            "/update-tracking-status",
        ];
        const BASE_COMMANDER_ROUTES = [
            "/dashboard",
            "/track",
            "/assignments",
            "/assign-asset",
            "/expenditures",
        ];
        const LOGISTICS_ROUTES = ["/purchases", "/transfers", "/transfer-asset", "/track"];
        if (role === "ADMIN") {
            return next();
        }
        if (role === "BASE_COMMANDER") {
            if (BASE_COMMANDER_ROUTES.some((r) => route.startsWith(r))) {
                if (!req.query)
                    req.query = {};
                req.query.baseId = req.baseId;
                return next();
            }
        }
        if (role === "LOGISTICS_PERSONNEL") {
            if (LOGISTICS_ROUTES.some((r) => route.startsWith(r))) {
                return next();
            }
        }
        return res.status(403).json({
            success: false,
            message: "Access denied: insufficient permissions",
        });
    }
    catch (error) {
        console.error("RBAC error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
//# sourceMappingURL=IsUserAllowed.js.map