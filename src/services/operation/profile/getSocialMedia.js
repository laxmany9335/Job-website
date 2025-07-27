import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { GET_SOCIAL_MEDIA } = profileEndpoints;

export function getSocialMedia(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Fetching Social Media...");
        console.log("first", formData, "formData in getSocialMedia function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("GET", GET_SOCIAL_MEDIA, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Social Media Fetched Successfully");
            console.log(response, "GET_SOCIAL_MEDIA API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Fetch Social Media");
            console.error("Error fetching social media:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
