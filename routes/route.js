import { Router } from "express";
import opening from "../controller/authentication/opening.js";
import login from "../controller/authentication/login.js";
import registerDoctor from "../controller/authentication/registerDoctor.js";
import registerPatient from "../controller/authentication/registerPatient.js";
import verifyOtp from "../controller/authentication/verifyOtp.js";
import resetPassword from "../controller/authentication/resetPassword.js";




const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

router.post('/opening', opening);
router.post('/login', login);
router.post('/registerDoctor', registerDoctor);
router.post('/registerPatient', registerPatient);
router.post('/verifyOtp', verifyOtp);
router.post('/resetPassword', resetPassword);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});
export default router;