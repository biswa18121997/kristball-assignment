export default async function PopulateReqBody(req, res, next) {
    try {
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'internal server error',
            success: false
        });
    }
}
//# sourceMappingURL=PopulateReqBody.js.map