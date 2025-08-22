import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { DELETE_CERTIFICATION } = profileEndpoints;

export function deleteCertification(certificationId) {
    return async (dispatch) => {
         const toastId = toast.loading("Deleting certifications...");
    
        dispatch(setLoading(true));
        try {
           const response = await apiConnector("DELETE", DELETE_CERTIFICATION, { certificationId });

            
            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Certification Deleted Successfully");
            console.log(response, "DELETE_CERTIFICATION API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Delete Certification");
            console.error("Error deleting Certification:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}