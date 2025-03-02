const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    console.log("Received Authorization Header:", authHeader); // Debug

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Không có token hoặc sai định dạng!" });
    }

    const token = authHeader.split(" ")[1]; // Lấy token thực
    console.log("Extracted Token:", token); // Debug

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET chưa được cấu hình trong .env!");
        return res.status(500).json({ message: "Lỗi server: Thiếu JWT_SECRET" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debug token data

        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token đã hết hạn!" });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Token không hợp lệ!" });
        } else {
            console.error("JWT Verify Error:", error.message);
            return res.status(500).json({ message: "Lỗi xác thực token!" });
        }
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.user_type_id !== 1) {
        return res.status(403).json({ message: "Bạn không có quyền admin!" });
    }
    next();
};

module.exports = { authMiddleware, isAdmin };
