import mongoose from 'mongoose';

const clinicInfoSchema = new mongoose.Schema(
  {
    specialization: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    clinicLocation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ClinicInfo = mongoose.model('ClinicInfo', clinicInfoSchema);
export default ClinicInfo;
