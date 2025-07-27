import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { UPDATE_PROFILE } = profileEndpoints;

export function updateProfile(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating Profile...");
        console.log("first", formData, "formData in updateProfile function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("PUT", UPDATE_PROFILE, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Profile Updated Successfully");
            console.log(response, "UPDATE_PROFILE API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Update Profile");
            console.error("Error updating profile:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
