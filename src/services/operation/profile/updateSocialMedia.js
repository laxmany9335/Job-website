import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { UPDATE_SOCIAL_MEDIA } = profileEndpoints;

export function updateSocialMedia(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating Social Media...");
        console.log("first", formData, "formData in updateSocialMedia function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("PUT", UPDATE_SOCIAL_MEDIA, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Social Media Updated Successfully");
            console.log(response, "UPDATE_SOCIAL_MEDIA API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Update Social Media");
            console.error("Error updating social media:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
