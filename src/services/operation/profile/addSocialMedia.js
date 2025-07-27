import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { ADD_SOCIAL_MEDIA } = profileEndpoints;

export function addSocialMedia(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Adding Social Media...");
        console.log("first", formData, "formData in addSocialMedia function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("POST", ADD_SOCIAL_MEDIA, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Social Media Added Successfully");
            console.log(response, "ADD_SOCIAL_MEDIA API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Add Social Media");
            console.error("Error adding social media:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
