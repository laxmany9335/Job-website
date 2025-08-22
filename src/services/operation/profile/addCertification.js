import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { ADD_CERTIFICATION } = profileEndpoints;

export function addCertification(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Adding Certification...");
        console.log("first", formData, "formData in addCertification function");
        dispatch(setLoading(true));
        try {
           const response = await apiConnector("POST", ADD_CERTIFICATION, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Certification Added Successfully");
            console.log(response, "ADD_ACHIEVEMENT API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Add Certification");
            console.error("Error adding Certification:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}