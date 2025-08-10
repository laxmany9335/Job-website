import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { DELETE_EXPERIENCE } = profileEndpoints;

export function deleteExperience(experienceId) {
    return async (dispatch) => {
        const toastId = toast.loading("Deleting Experience...");
        console.log("first", experienceId, "formData in deleteExperience function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("DELETE", DELETE_EXPERIENCE, { experienceId });

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Experience Deleted Successfully");
            console.log(response, "DELETE_EXPERIENCE API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Delete Experience");
            console.error("Error deleting experience:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
