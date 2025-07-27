import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { ADD_PROFILE } = profileEndpoints;

export function createProfile(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Creating Profile...");
        console.log("first", formData, "formData in createProfile function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("POST", ADD_PROFILE, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Profile Created Successfully");
            console.log(response, "ADD_PROFILE API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Create Profile");
            console.error("Error creating profile:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
