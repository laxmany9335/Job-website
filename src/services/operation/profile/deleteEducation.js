import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { DELETE_EDUCATION } = profileEndpoints;

export function deleteEducation(educationId) {
    return async (dispatch) => {
        const toastId = toast.loading("Deleting Education...");
        console.log("first", educationId, " Education By ID");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("DELETE", DELETE_EDUCATION, { educationId });

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Education Deleted Successfully");
            console.log(response, "DELETE_EDUCATION API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Delete Education");
            console.error("Error deleting Education:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
