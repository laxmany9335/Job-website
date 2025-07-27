import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { DELETE_SOCIAL_MEDIA } = profileEndpoints;

export function deleteSocialMedia(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Deleting Social Media...");
        console.log("first", formData, "formData in deleteSocialMedia function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("POST", DELETE_SOCIAL_MEDIA, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Social Media Deleted Successfully");
            console.log(response, "DELETE_SOCIAL_MEDIA API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Delete Social Media");
            console.error("Error deleting social media:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
