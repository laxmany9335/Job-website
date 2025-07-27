import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { ADD_EXPERIENCE } = profileEndpoints;

export function addExperience(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Adding Experience...");
        console.log("first", formData, "formData in addExperience function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("POST", ADD_EXPERIENCE, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Experience Added Successfully");
            console.log(response, "ADD_EXPERIENCE API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Add Experience");
            console.error("Error adding experience:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
